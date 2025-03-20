import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LogoProps {
  src?: string;
  alt?: string;
}

const Logo = ({ alt = "Logo da Loja" }: LogoProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  
  // Imagem padrão se não houver imagem carregada
  const defaultImage = "https://picsum.photos/id/156/300/300"; // Imagem bonita do picsum como fallback
  
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
          setHasError(true);
          return;
        }

        if (data && data.store_image) {
          console.log('Logo encontrada:', data.store_image);
          
          let logoUrl = data.store_image;
          
          // Verificar se é uma URL http ou base64
          if (logoUrl.startsWith('http')) {
            // Se for URL http, usar diretamente
            setImageUrl(logoUrl);
          } else if (logoUrl.startsWith('data:')) {
            // Se for base64, usar diretamente
            setImageUrl(logoUrl);
          } else {
            // Para outros casos (UUID por exemplo), tentar usar URL de imagem padrão
            setImageUrl(defaultImage);
          }
        } else {
          console.log("Nenhuma imagem encontrada");
          setHasError(true);
          setImageUrl(defaultImage);
        }
      } catch (error) {
        console.error('Erro:', error);
        setHasError(true);
        setImageUrl(defaultImage);
      }
    };

    fetchLogo();
  }, []);
  
  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      {/* Indicador de carregamento */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-full">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      )}
      
      {/* Imagem carregada ou padrão */}
      <img 
        src={imageUrl || defaultImage} 
        alt={alt}
        className={`w-24 h-24 rounded-full mx-auto object-cover border-4 border-store-highlight shadow-md transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={() => {
          setIsLoaded(true);
          setHasError(false);
        }}
        onError={(e) => {
          console.error('Erro ao carregar imagem:', imageUrl);
          // Tentar carregar a imagem padrão em caso de erro
          if (imageUrl !== defaultImage) {
            (e.target as HTMLImageElement).src = defaultImage;
          } else {
            setHasError(true);
            setIsLoaded(true);
          }
        }}
      />
      
      {/* Fallback se houver erro mesmo com a imagem padrão */}
      {hasError && isLoaded && (
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-store-highlight flex items-center justify-center text-white text-lg font-bold">
          L
        </div>
      )}
    </div>
  );
};

export default Logo;
