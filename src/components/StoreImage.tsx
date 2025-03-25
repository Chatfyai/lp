'use client';

import { useStore } from '@/context/StoreContext';

const StoreImage = () => {
  const { settings } = useStore();
  
  if (!settings) {
    return null;
  }
  
  return (
    <div className="relative w-full h-64 mb-8">
      <img 
        src={settings.store_image || "/default-store.jpg"} 
        alt="Imagem da Loja" 
        className="w-full h-64 object-cover rounded-lg shadow-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/default-store.jpg";
        }}
      />
    </div>
  );
};

export default StoreImage; 