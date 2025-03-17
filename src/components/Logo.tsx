import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface LogoProps {
  src?: string;
  alt?: string;
}

const Logo = ({ alt = "Logo da Loja" }: LogoProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  
  // Buscar imagem diretamente do Supabase - abordagem simplificada
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        console.log("Logo: Buscando imagem do Supabase");
        
        const { data, error } = await supabase
          .from('store_settings')
          .select('store_image')
          .limit(1)
          .single();

        if (error) {
          console.error('Erro ao buscar logo:', error);
          setError(true);
          return;
        }

        if (data && data.store_image) {
          console.log('Logo encontrada:', data.store_image);
          
          // Adicionar timestamp para evitar cache
          const cacheBuster = `?t=${Date.now()}`;
          const formattedUrl = data.store_image.includes('?') 
            ? data.store_image.split('?')[0] + cacheBuster
            : data.store_image + cacheBuster;
            
          setImageUrl(formattedUrl);
        } else {
          console.log("Nenhuma imagem encontrada");
          setError(true);
        }
      } catch (error) {
        console.error('Erro:', error);
        setError(true);
      }
    };

    fetchLogo();
    
    // Configurar verificação periódica
    const interval = setInterval(fetchLogo, 5000);
    return () => clearInterval(interval);
  }, []);

  // Imagem padrão se não houver imagem carregada
  const defaultImage = "/lovable-uploads/fd1285cf-8fdd-4e0e-99f8-0bf38a976c78.png";
  
  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      {/* Círculo de carregamento */}
      <div className={`absolute inset-0 bg-gray-200 rounded-full ${isLoaded && !error ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}></div>
      
      {/* Imagem carregada ou padrão */}
      <img 
        src={imageUrl || defaultImage} 
        alt={alt}
        className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-store-highlight shadow-md"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          console.error('Erro ao carregar imagem:', imageUrl);
          setError(true);
        }}
      />
      
      {/* Fallback se houver erro */}
      {error && (
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-store-highlight flex items-center justify-center text-white text-lg font-bold">
          N
        </div>
      )}
    </div>
  );
};

export default Logo;
