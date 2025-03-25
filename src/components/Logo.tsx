'use client';

import { useStore } from '@/context/StoreContext';
import { useEffect, useState } from 'react';

// Imagem de marcador de posição
const DEFAULT_LOGO = "https://via.placeholder.com/200x100?text=Logo+Naturalys";

const Logo = () => {
  const { settings, isLoading } = useStore();
  const [logoUrl, setLogoUrl] = useState<string>(DEFAULT_LOGO);
  
  useEffect(() => {
    // Atualizar a URL do logo quando as configurações forem carregadas
    if (settings?.store_image) {
      console.log('Logo: Imagem da loja encontrada:', settings.store_image);
      setLogoUrl(settings.store_image);
    } else {
      console.log('Logo: Usando imagem padrão');
      setLogoUrl(DEFAULT_LOGO);
    }
  }, [settings]);
  
  if (isLoading) {
    return (
      <div className="h-24 w-full flex justify-center items-center mb-4">
        <div className="animate-pulse bg-gray-200 h-24 w-24 rounded-full"></div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center py-4 mb-2">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 flex items-center justify-center p-1 bg-white">
        <img 
          src={logoUrl} 
          alt="Logo da Loja" 
          className="w-full h-full object-contain rounded-full"
          onError={(e) => {
            console.log('Logo: Erro ao carregar imagem, usando padrão');
            const target = e.target as HTMLImageElement;
            target.src = DEFAULT_LOGO;
          }}
        />
      </div>
    </div>
  );
};

export default Logo;
