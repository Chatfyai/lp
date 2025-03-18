import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Interfaces para os tipos de dados
interface Product {
  id: string;
  name: string;
  price: string;
  promo_price?: string; // Preço promocional (opcional)
  image: string;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

interface MainButton {
  id: string;
  icon: string;
  name: string;
  description: string;
  link: string;
  status: 'normal' | 'destaque';
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

interface StoreSettings {
  id: string;
  store_name: string;
  description: string;
  whatsapp_number: string;
  instagram_handle: string;
  address: string;
  open_weekdays: boolean;
  open_saturday: boolean;
  open_sunday: boolean;
  weekday_open_time: string;
  weekday_close_time: string;
  saturday_open_time: string;
  saturday_close_time: string;
  sunday_open_time: string;
  sunday_close_time: string;
  store_image: string;
  created_at?: string;
  updated_at?: string;
}

// Interface para o contexto
interface StoreContextType {
  products: Product[];
  mainButtons: MainButton[];
  settings: StoreSettings | null;
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  refreshProducts: () => Promise<Product[]>;
  refreshButtons: () => Promise<MainButton[]>;
  refreshSettings: () => Promise<StoreSettings | null>;
  lastUpdate: number;
}

// Criação do contexto
const StoreContext = createContext<StoreContextType | null>(null);

// Hook para usar o contexto
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore deve ser usado dentro de um StoreProvider');
  }
  return context;
};

// Provider do contexto
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [mainButtons, setMainButtons] = useState<MainButton[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Função para buscar todos os dados
  const refreshData = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      await Promise.all([
        refreshProducts(),
        refreshButtons(),
        refreshSettings()
      ]);
      
      setLastUpdate(Date.now());
      setIsLoading(false);
    } catch (err) {
      console.error('Erro ao atualizar dados:', err);
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      setIsLoading(false);
    }
  }, []);

  // Função para buscar apenas produtos
  const refreshProducts = useCallback(async () => {
    try {
      const timestamp = Date.now();
      const { data, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('order_index', { ascending: true });

      if (productsError) {
        throw productsError;
      }
      
      // Buscar imagens do storage do Supabase
      let imagesMap = {};
      try {
        // Tentar buscar da tabela de imagens usando a API pública
        const response = await fetch(`${process.env.VITE_SUPABASE_URL || 'https://soiwkehhnccoestmjjmg.supabase.co'}/rest/v1/images?select=id,file_path&is_active=eq.true`, {
          headers: {
            'apikey': process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaXdrZWhobmNjb2VzdG1qam1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MzE2MTcsImV4cCI6MjA1NTQwNzYxN30.mgf0MAL7dTL3ek34wqrWu4f2Wxjghbws23-FIgIcRJ4',
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const imagesData = await response.json();
          if (imagesData && imagesData.length > 0) {
            imagesMap = imagesData.reduce((acc, img) => {
              acc[img.id] = img.file_path;
              return acc;
            }, {});
            console.log("Mapa de imagens carregado:", Object.keys(imagesMap).length, "imagens");
          }
        }
      } catch (imgErr) {
        console.warn("Não foi possível carregar imagens:", imgErr);
      }
      
      // Processar as URLs de imagem
      const processedData = data?.map(product => {
        // Verificar se é um UUID que pode referenciar uma imagem na tabela images
        let imageUrl = product.image;
        if (product.image && product.image.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
          // Se a imagem for um UUID e existir no mapa de imagens, use a URL da tabela images
          imageUrl = imagesMap[product.image] || product.image;
        }
        
        // Adicionar timestamp para evitar cache
        if (imageUrl && !imageUrl.includes('?')) {
          imageUrl = `${imageUrl}?t=${timestamp}`;
        }
        
        return {
          ...product,
          image: imageUrl
        };
      }) || [];
      
      console.log("Produtos atualizados:", processedData);
      setProducts(processedData);
      return processedData;
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      throw err;
    }
  }, []);

  // Função para buscar apenas botões
  const refreshButtons = useCallback(async () => {
    try {
      const { data, error: buttonsError } = await supabase
        .from('main_buttons')
        .select('*')
        .order('order_index', { ascending: true });

      if (buttonsError) {
        throw buttonsError;
      }
      
      // Type cast para o status
      const typedData = data?.map(item => ({
        ...item,
        status: item.status as 'normal' | 'destaque'
      })) || [];
      
      console.log("Botões atualizados:", typedData);
      setMainButtons(typedData);
      return typedData;
    } catch (err) {
      console.error('Erro ao buscar botões:', err);
      throw err;
    }
  }, []);

  // Função para buscar apenas configurações
  const refreshSettings = useCallback(async () => {
    try {
      const { data, error: settingsError } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (settingsError) {
        throw settingsError;
      }
      
      console.log("Configurações atualizadas:", data);
      setSettings(data);
      return data;
    } catch (err) {
      console.error('Erro ao buscar configurações:', err);
      throw err;
    }
  }, []);

  // Carregar dados iniciais
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Valor do contexto
  const value = {
    products,
    mainButtons,
    settings,
    isLoading,
    error,
    refreshData,
    refreshProducts,
    refreshButtons,
    refreshSettings,
    lastUpdate
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider; 