import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
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
          
          let logoUrl = data.store_image;
          
          // Verificar se é um UUID que pode referenciar uma imagem na tabela images
          if (logoUrl.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
            try {
              // Tentar buscar da tabela de imagens usando a API pública
              const response = await fetch(`${process.env.VITE_SUPABASE_URL || 'https://soiwkehhnccoestmjjmg.supabase.co'}/rest/v1/images?select=file_path&id=eq.${logoUrl}`, {
                headers: {
                  'apikey': process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaXdrZWhobmNjb2VzdG1qam1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MzE2MTcsImV4cCI6MjA1NTQwNzYxN30.mgf0MAL7dTL3ek34wqrWu4f2Wxjghbws23-FIgIcRJ4',
                  'Content-Type': 'application/json'
                }
              });
              
              if (response.ok) {
                const imagesData = await response.json();
                if (imagesData && imagesData.length > 0 && imagesData[0].file_path) {
                  logoUrl = imagesData[0].file_path;
                  console.log("Imagem do logo encontrada na tabela images:", logoUrl);
                }
              }
            } catch (imgErr) {
              console.warn("Não foi possível carregar imagem do logo da tabela images:", imgErr);
            }
          }
          
          // Adicionar timestamp para evitar cache
          const cacheBuster = `?t=${Date.now()}`;
          const formattedUrl = logoUrl.includes('?') 
            ? logoUrl.split('?')[0] + cacheBuster
            : logoUrl + cacheBuster;
            
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
  }, []);

  // Imagem padrão se não houver imagem carregada
  const defaultImage = "/lovable-uploads/fd1285cf-8fdd-4e0e-99f8-0bf38a976c78.png";
  
  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      {/* Indicador de carregamento */}
      {!isLoaded && !error && (
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
          setError(false);
        }}
        onError={() => {
          console.error('Erro ao carregar imagem:', imageUrl);
          setIsLoaded(true);
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
