import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Criar o contexto
const ImageContext = createContext();

// Hook customizado para usar o contexto
export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage deve ser usado dentro de um ImageProvider');
  }
  return context;
};

// Verificar se a URL é válida
const isValidImageUrl = async (url) => {
  if (!url) return false;
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (e) {
    console.error('Erro ao validar URL da imagem:', e);
    return false;
  }
};

// Provedor do contexto
export const ImageProvider = ({ children }) => {
  const [logoImage, setLogoImage] = useState('');
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [loading, setLoading] = useState(true);
  const [fetchCount, setFetchCount] = useState(0);

  // Função para buscar a imagem mais recente
  const fetchLogoImage = async () => {
    try {
      setLoading(true);
      const newFetchCount = fetchCount + 1;
      setFetchCount(newFetchCount);
      console.log(`Contexto [${newFetchCount}]: Buscando imagem mais recente...`);
      
      const { data, error } = await supabase
        .from('store_settings')
        .select('store_image')
        .limit(1)
        .single();

      if (error) {
        console.error(`Contexto [${newFetchCount}]: Erro ao buscar imagem:`, error);
        return;
      }

      if (data && data.store_image) {
        console.log(`Contexto [${newFetchCount}]: Nova imagem encontrada:`, data.store_image);
        
        // Validar a URL da imagem antes de tentar usar
        const isValid = await isValidImageUrl(data.store_image);
        if (!isValid) {
          console.error(`Contexto [${newFetchCount}]: URL da imagem inválida:`, data.store_image);
          return;
        }
        
        // Forçar nova instância ao atualizar a URL da imagem
        const timestamp = Date.now();
        const imageUrl = data.store_image.includes('?') 
          ? data.store_image.split('?')[0] + `?t=${timestamp}`
          : `${data.store_image}?t=${timestamp}`;
        
        console.log(`Contexto [${newFetchCount}]: Definindo URL da imagem com cache-buster:`, imageUrl);
        setLogoImage(imageUrl);
        setLastUpdated(timestamp);
      } else {
        console.log(`Contexto [${newFetchCount}]: Nenhuma imagem encontrada no banco de dados`);
      }
    } catch (error) {
      console.error(`Contexto: Erro geral:`, error);
    } finally {
      setLoading(false);
    }
  };

  // Buscar a imagem ao montar o componente e a cada x segundos
  useEffect(() => {
    console.log('Contexto: Inicializando provedor de imagem');
    
    // Carregar imediatamente
    fetchLogoImage();
    
    // Tentar mais uma vez após 2 segundos (para garantir que dados estejam disponíveis)
    const initialTimer = setTimeout(() => {
      console.log('Contexto: Tentativa adicional após delay inicial');
      fetchLogoImage();
    }, 2000);
    
    // Configurar listener de Realtime para atualizações da tabela
    const channel = supabase.channel('image-context-changes');
    
    channel
      .on(
        'postgres_changes', 
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'store_settings',
        }, 
        (payload) => {
          console.log('Contexto: Alteração detectada no banco de dados', payload);
          if (payload.new) {
            fetchLogoImage();
          }
        }
      )
      .subscribe((status) => {
        console.log('Contexto: Status da subscrição Realtime:', status);
      });
    
    // Configurar verificação periódica da imagem
    const interval = setInterval(() => {
      console.log('Contexto: Verificação periódica');
      fetchLogoImage();
    }, 3000); // Verificar a cada 3 segundos
    
    // Limpar ao desmontar
    return () => {
      console.log('Contexto: Limpando recursos');
      clearTimeout(initialTimer);
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  // Função para atualizar a imagem manualmente
  const refreshImage = () => {
    console.log('Contexto: Atualizando imagem manualmente');
    fetchLogoImage();
  };

  // Valores a serem compartilhados pelo contexto
  const value = {
    logoImage,
    lastUpdated,
    loading,
    refreshImage
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};

export default ImageContext; 