'use client';

import React, { createContext, useContext, ReactNode, useState, useEffect, useCallback, useMemo } from 'react';
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

// Defina a interface para as configurações da loja
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
  logo_url: string;
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
  lastUpdate: number;
}

// Nome da chave para armazenar os dados em cache
const CACHE_KEY = 'store_data_cache';
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutos em milissegundos

// Tipo para o objeto de cache completo
interface CachedData {
  products: Product[];
  mainButtons: MainButton[];
  settings: StoreSettings | null;
  timestamp: number;
}

// Carregar dados do cache
const loadFromCache = (): CachedData | null => {
  try {
    const cachedData = localStorage.getItem(CACHE_KEY);
    if (!cachedData) return null;
    
    const parsed = JSON.parse(cachedData) as CachedData;
    const now = Date.now();
    
    // Verificar se o cache expirou
    if (now - parsed.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    
    return parsed;
  } catch (error) {
    // Em caso de erro, limpar o cache corrompido
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
};

// Salvar dados no cache
const saveToCache = (data: CachedData) => {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      ...data,
      timestamp: Date.now()
    }));
  } catch (error) {
    // Ignorar erros de armazenamento (ex. quando o localStorage está cheio)
    console.warn('Erro ao salvar no cache:', error);
  }
};

// Criação do contexto
const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Hook para usar o contexto
export const useStore = () => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore deve ser usado dentro de um StoreProvider');
  }
  return context;
};

// Configurações padrão
const defaultSettings: StoreSettings = {
  id: "",
  store_name: "Naturalys",
  description: "Produtos Naturais",
  whatsapp_number: "",
  instagram_handle: "",
  address: "",
  open_weekdays: false,
  open_saturday: false,
  open_sunday: false,
  weekday_open_time: "",
  weekday_close_time: "",
  saturday_open_time: "",
  saturday_close_time: "",
  sunday_open_time: "",
  sunday_close_time: "",
  store_image: "",
  logo_url: "",
  created_at: "",
  updated_at: "",
};

// Provider do contexto
export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [mainButtons, setMainButtons] = useState<MainButton[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());
  
  // Usar uma função para buscar todos os dados de uma vez
  const fetchAllData = useCallback(async (skipCache = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Verificar se há dados em cache válidos
      if (!skipCache) {
        const cachedData = loadFromCache();
        if (cachedData) {
          setProducts(cachedData.products);
          setMainButtons(cachedData.mainButtons);
          setSettings(cachedData.settings);
          setLoading(false);
          setLastUpdate(Date.now());
          
          // Buscar dados atualizados em segundo plano
          setTimeout(() => fetchAllData(true), 0);
          return;
        }
      }
      
      // Buscar dados em paralelo
      const [
        { data: productsData, error: productsError },
        { data: buttonsData, error: buttonsError },
        { data: settingsData, error: settingsError }
      ] = await Promise.all([
        supabase.from('products').select('*').order('order_index'),
        supabase.from('main_buttons').select('*').order('order_index'),
        supabase.from('store_settings').select('*').single()
      ]);
      
      // Verificar erros
      if (productsError) throw new Error(`Erro ao buscar produtos: ${productsError.message}`);
      if (buttonsError) throw new Error(`Erro ao buscar botões: ${buttonsError.message}`);
      if (settingsError) throw new Error(`Erro ao buscar configurações: ${settingsError.message}`);
      
      // Atualizar o estado com os dados buscados
      setProducts(productsData || []);
      setMainButtons((buttonsData || []).map(button => ({
        ...button,
        status: button.status as 'normal' | 'destaque'
      })));
      setSettings(settingsData);
      
      if (settingsData) {
        setSettings({
          ...settingsData,
          logo_url: settingsData.logo_url || ""
        });
      }
      
      // Salvar os dados em cache para acelerar futuros carregamentos
      saveToCache({
        products: productsData || [],
        mainButtons: (buttonsData || []).map(button => ({
          ...button,
          status: button.status as 'normal' | 'destaque'
        })),
        settings: settingsData,
        timestamp: Date.now()
      });
      
      // Atualizar o timestamp para forçar re-renderização em componentes que dependem dele
      setLastUpdate(Date.now());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido ao buscar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar configurações da loja
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('StoreContext: Buscando configurações da loja...');

      const { data, error: fetchError } = await supabase
        .from('store_settings')
        .select('*')
        .single();

      if (fetchError) {
        console.log('StoreContext: Erro ao buscar configurações:', fetchError);
        
        if (fetchError.code === 'PGRST116') {
          // Tabela vazia, criar registro inicial
          console.log('StoreContext: Tabela vazia, criando registro inicial...');
          
          const { data: newSettings, error: insertError } = await supabase
            .from('store_settings')
            .insert([defaultSettings])
            .select()
            .single();

          if (insertError) {
            throw insertError;
          }

          console.log('StoreContext: Registro inicial criado:', newSettings);
          setSettings(newSettings as StoreSettings);
        } else {
          throw fetchError;
        }
      } else if (data) {
        // Certifique-se de que todos os campos necessários estejam presentes
        const completeSettings = {
          ...defaultSettings,
          ...data,
        };
        
        console.log('StoreContext: Configurações carregadas:', completeSettings);
        console.log('StoreContext: Logo URL:', completeSettings.logo_url);
        
        setSettings(completeSettings);
      }
    } catch (err) {
      console.error('StoreContext: Erro ao carregar configurações:', err);
      setError('Erro ao carregar configurações da loja');
      // Em caso de erro, usar configurações padrão
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  // Carrega as configurações ao iniciar
  useEffect(() => {
    fetchSettings();
  }, []);

  // Evitar re-renderizações desnecessárias usando useMemo para o valor do contexto
  const contextValue = useMemo(() => ({
    products,
    mainButtons,
    settings,
    isLoading: loading,
    error,
    refreshData: () => fetchAllData(true),
    lastUpdate
  }), [products, mainButtons, settings, loading, error, fetchAllData, lastUpdate]);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider; 