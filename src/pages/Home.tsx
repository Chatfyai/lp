import { useEffect, useState } from 'react';
import Logo from '@/components/Logo';
import LinkCard from '@/components/LinkCard';
import ProductCard from '@/components/ProductCard';
import StoreStatus from '@/components/StoreStatus';
import SectionTitle from '@/components/SectionTitle';
import SocialLinks from '@/components/SocialLinks';
import { ArrowRight, Loader2, ShoppingCart } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

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

interface Product {
  id: string;
  name: string;
  price: string;
  promo_price: string;
  image: string;
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

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { 
    products, 
    mainButtons, 
    settings, 
    isLoading, 
    error, 
    refreshData,
    lastUpdate
  } = useStore();
  
  // Efeito para animar a entrada quando os dados são carregados
  useEffect(() => {
    if (!isLoading && !isLoaded) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 300);
    }
  }, [isLoading]);

  // Forçar atualização dos dados quando o componente for montado
  useEffect(() => {
    console.log("Home: Buscando dados atualizados...");
    refreshData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-10 px-4">
        <Loader2 className="h-10 w-10 animate-spin text-store-highlight" />
        <p className="mt-4 text-gray-500">Carregando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center py-10 px-4">
        <div className="bg-red-50 p-4 rounded-lg text-red-600 max-w-lg mx-auto">
          <h2 className="font-bold mb-2">Erro ao carregar dados</h2>
          <p>{error}</p>
          <button 
            onClick={refreshData}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-10 px-4">
      <div 
        className={`max-w-lg mx-auto bg-white bg-opacity-95 rounded-2xl p-6 shadow-lg transition-all duration-700 ${
          isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h1 className="text-2xl font-bold text-store-primary mb-1">{settings?.store_name || 'Sua Loja'}</h1>
          <p className="text-sm text-gray-500 mb-5">{settings?.description || 'Produtos exclusivos para você'}</p>
          
          <div className="w-full flex justify-center">
            <StoreStatus settings={settings} />
          </div>
        </div>
        
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {mainButtons.filter(button => button.status === 'destaque').map(button => (
            <LinkCard 
              key={`${button.id}-${lastUpdate}`}
              icon={button.icon}
              title={button.name}
              description={button.description || ''}
              href={button.link}
              highlight={true}
            />
          ))}
          
          {mainButtons.filter(button => button.status !== 'destaque').map(button => (
            <LinkCard 
              key={`${button.id}-${lastUpdate}`}
              icon={button.icon}
              title={button.name}
              description={button.description || ''}
              href={button.link}
              highlight={false}
            />
          ))}
        </div>
        
        <SectionTitle 
          title="Produtos em Destaque" 
          subtitle=""
        />
        
        <div className="grid grid-cols-2 gap-5 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {products.map(product => (
            <div key={`${product.id}-${lastUpdate}`}>
              <ProductCard 
                name={product.name}
                price={product.price}
                promoPrice={product.promo_price}
                image={product.image}
                href="#"
              />
            </div>
          ))}
        </div>
        
        <div className="text-center mt-4 mb-6">
          <a 
            href="#" 
            className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700"
          >
            Ver todos os produtos <ArrowRight size={16} className="ml-1" />
          </a>
        </div>
        
        <SectionTitle 
          title="Ofertas Especiais" 
          subtitle="Preços imperdíveis por tempo limitado"
        />
        
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: '0.5s' }}>
          {products
            .filter(product => product.promo_price && product.promo_price.trim() !== '')
            .slice(0, 3)
            .map(product => (
              <div 
                key={`highlight-${product.id}-${lastUpdate}`} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-1/3 h-48 sm:h-auto">
                    <div className="absolute inset-0 bg-gray-200">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 m-2 rounded">
                      OFERTA
                    </div>
                  </div>
                  
                  <div className="p-4 sm:w-2/3 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                      <div className="flex flex-col mb-2">
                        <span className="text-gray-500 line-through text-sm">{product.price}</span>
                        <div className="flex items-baseline">
                          <span className="font-bold text-red-600 text-lg mr-1">Por apenas</span>
                          <span className="font-bold text-red-600 text-xl">{product.promo_price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <button className="mt-4 bg-store-highlight hover:bg-opacity-90 text-white py-2 px-4 rounded-lg font-medium flex items-center justify-center">
                      <ShoppingCart size={16} className="mr-2" />
                      Comprar agora
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
          {products.filter(product => product.promo_price && product.promo_price.trim() !== '').length === 0 && (
            <div className="text-center py-6 text-gray-500">
              Nenhuma oferta especial disponível no momento.
            </div>
          )}
        </div>
        
        <SectionTitle 
          title="Mais Links" 
          subtitle=""
        />
        
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <LinkCard 
            icon="🔥"
            title="Promoções da Semana"
            description="Aproveite nossos descontos"
            href="#"
          />
          
          <LinkCard 
            icon="📦"
            title="Rastrear Pedido"
            description="Acompanhe sua entrega"
            href="#"
          />
        </div>
        
        <div className="flex justify-center">
          <SocialLinks />
        </div>
        
        <div className="text-xs text-gray-400 mt-5 text-center">
          © 2025 {settings?.store_name || 'Sua Loja'} - Todos os direitos reservados
        </div>
      </div>
    </div>
  );
};

export default Home;
