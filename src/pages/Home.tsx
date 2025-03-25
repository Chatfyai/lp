import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import Logo from '@/components/Logo';
import LinkCard from '@/components/LinkCard';
import ProductCard from '@/components/ProductCard';
import StoreStatus from '@/components/StoreStatus';
import SectionTitle from '@/components/SectionTitle';
import { ArrowRight, Loader2, ShoppingCart } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

// Importar o carrossel com lazy loading
const BenefitsCarousel = lazy(() => import('@/components/BenefitsCarousel'));

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

// Função para verificar se é uma string base64 válida - melhorada para performance
const isBase64Image = (str: string) => {
  return str && str.startsWith('data:');
};

// Função para comprimir imagem base64 - otimizada
const compressImage = (base64: string, maxWidth = 300, maxHeight = 300, quality = 0.6): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Se a string não for muito grande, não comprimir
    if (base64.length < 50000) {
      resolve(base64);
      return;
    }
    
    // Criar uma imagem a partir do base64
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    
    img.onload = () => {
      // Calcular as novas dimensões mantendo a proporção
      let width = img.width;
      let height = img.height;
      
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round(height * maxWidth / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round(width * maxHeight / height);
          height = maxHeight;
        }
      }
      
      // Criar um canvas e redimensionar a imagem
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64); // Se falhar, usar a original
        return;
      }
      
      // Desenhar a imagem no canvas redimensionada
      ctx.drawImage(img, 0, 0, width, height);
      
      // Obter o formato da imagem original
      let format = 'image/jpeg';
      if (base64.includes('data:image/png')) {
        format = 'image/png';
      } else if (base64.includes('data:image/gif')) {
        format = 'image/gif';
      } else if (base64.includes('data:image/webp')) {
        format = 'image/webp';
      }
      
      // Converter para base64 comprimido
      const compressedBase64 = canvas.toDataURL(format, quality);
      resolve(compressedBase64);
    };
    
    img.onerror = () => {
      resolve(base64); // Se falhar, usar a original
    };
    
    img.src = base64;
  });
};

// Processa URL da imagem - otimizada
const processImageUrl = async (image: string) => {
  const defaultImage = "/lovable-uploads/fd1285cf-8fdd-4e0e-99f8-0bf38a976c78.png";
  
  if (!image) return defaultImage;
  
  if (isBase64Image(image)) {
    // Se for base64 e for grande, comprimir
    if (image.length > 50000) {
      try {
        return await compressImage(image);
      } catch (error) {
        return image; // Em caso de erro, usa a original
      }
    }
    // Se não for grande, usa a original
    return image;
  } else if (image.startsWith('http')) {
    // Se for URL absoluta
    return image;
  } else {
    // Outros casos (pode ser UUID ou caminho relativo)
    return image;
  }
};

// Função simplificada para obter URL da imagem - otimizada
const getImageUrl = (image) => {
  const defaultImage = "https://picsum.photos/id/237/300/300";
  
  if (!image) return defaultImage;
  
  // Se já for uma URL http, usar diretamente
  if (image.startsWith('http')) {
    return image;
  }
  
  // Se for um dado base64, retorna diretamente
  if (image.startsWith('data:')) {
    return image;
  }
  
  // Caso contrário, assumir que é uma imagem padrão
  return defaultImage;
};

// Componente de Loader
const LoadingIndicator = () => (
  <div className="flex justify-center items-center py-6">
    <div className="w-8 h-8 border-4 border-gray-200 border-t-[#16A34A] rounded-full animate-spin"></div>
  </div>
);

const Home = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [optimizedImages, setOptimizedImages] = useState<Record<string, string>>({});
  const { 
    products, 
    mainButtons, 
    settings, 
    isLoading, 
    error, 
    refreshData,
    lastUpdate
  } = useStore();
  
  const [showMoreTestimonials, setShowMoreTestimonials] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Maria Jarluce",
      initial: "M",
      bgColor: "bg-green-100",
      textColor: "text-green-700",
      rating: 5,
      comment: "Atendimento atencioso e eficaz, me sentir acolhida e satisfeita.",
      isLocalGuide: false
    },
    {
      id: 2,
      name: "Johnny García",
      initial: "J",
      bgColor: "bg-purple-100",
      textColor: "text-purple-700",
      rating: 5,
      comment: "Ótimo atendimento, loja moderna. Os gestores são pessoas de uma energia positiva, maravilhosos e na real, os produtos curam de verdade.",
      isLocalGuide: false
    },
    {
      id: 3,
      name: "Valéria",
      initial: "V",
      bgColor: "bg-red-100",
      textColor: "text-red-700",
      isLocalGuide: true,
      rating: 5,
      comment: "Lugar agradável com um atendimento especial, profissional que sabe sugerir produtos de acordo com suas necessidades. Maravilhoso!!!"
    },
    {
      id: 4,
      name: "Lucia de fatima",
      initial: "L",
      bgColor: "bg-blue-100",
      textColor: "text-blue-700",
      rating: 5,
      comment: "Atendente muito educado, altamente preparado para responder as dúvidas dos clientes. Estão de parabéns",
      isLocalGuide: false
    },
    {
      id: 5,
      name: "Francisca Vitorino",
      initial: "F",
      bgColor: "bg-yellow-100",
      textColor: "text-yellow-700",
      rating: 5,
      comment: "A atendente Mariana foi muito prestativa, atenciosa e eficiente, senti-me bem acolhida.",
      isLocalGuide: false
    },
    {
      id: 6,
      name: "Vitória alves",
      initial: "V",
      bgColor: "bg-pink-100",
      textColor: "text-pink-700",
      rating: 5,
      comment: "Ótimo gosto muito dos produtos e do atendimento tbm vcs tão de parabéns",
      isLocalGuide: false
    }
  ];

  // Determinar quais depoimentos mostrar com base no estado
  const visibleTestimonials = showMoreTestimonials ? testimonials : testimonials.slice(0, 3);

  // Determinar quais produtos mostrar com base no estado
  const visibleProducts = showAllProducts ? products : products.slice(0, 2);

  // Processar e comprimir imagens base64 dos produtos - otimizado
  useEffect(() => {
    if (products && products.length > 0) {
      const processImages = async () => {
        // Processamento em lote das imagens
        const optimized: Record<string, string> = {};
        
        // Usar Promise.all para processar imagens em paralelo
        await Promise.all(products.map(async (product) => {
          if (product.image && isBase64Image(product.image) && product.image.length > 50000) {
            try {
              optimized[product.id] = await processImageUrl(product.image);
            } catch {
              // Silenciar erros de processamento de imagem
            }
          }
        }));
        
        setOptimizedImages(optimized);
      };
      
      // Usar setTimeout para não bloquear a renderização inicial
      const timer = setTimeout(() => {
        processImages();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [products]);

  // Efeito para animar a entrada quando os dados são carregados
  useEffect(() => {
    if (!isLoading && !isLoaded) {
      // Reduzir timeout para 100ms para acelerar a animação inicial
      setTimeout(() => {
        setIsLoaded(true);
      }, 100);
    }
  }, [isLoading]);

  // Forçar atualização dos dados quando o componente for montado
  useEffect(() => {
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

  // Obter URL de imagem otimizada ou original
  const getOptimizedImage = (product) => {
    return optimizedImages[product.id] || product.image;
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center py-6 px-3 md:py-10 md:px-4">
      <div 
        className={`w-full max-w-[400px] mx-auto bg-white rounded-2xl shadow-lg transition-all duration-700 ${
          isLoaded ? 'opacity-100 transform-none' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="flex flex-col items-center text-center p-4 pb-2">
          <Logo />
          <h1 className="text-xl md:text-2xl font-bold text-store-primary mb-1">{settings?.store_name || 'Sua Loja'}</h1>
          <p className="text-sm text-gray-500 mb-3">{settings?.description || 'Produtos exclusivos para você'}</p>
          
          <div className="w-full flex justify-center">
            <StoreStatus settings={settings} />
          </div>
        </div>
        
        <div className="space-y-3 px-4 animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
        
        {/* Carrossel de benefícios com lazy loading */}
        <Suspense fallback={<LoadingIndicator />}>
          <BenefitsCarousel />
        </Suspense>
        
        <div className="px-4">
          <SectionTitle 
            title="Produtos em Destaque" 
            subtitle="Nossa seleção especial para você"
          />
          
          <div className="grid grid-cols-2 gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {visibleProducts.map(product => (
              <div key={`${product.id}-${lastUpdate}`}>
                <ProductCard 
                  name={product.name}
                  price={product.price}
                  promoPrice={product.promo_price}
                  image={getOptimizedImage(product)}
                  href="#"
                />
              </div>
            ))}
          </div>
          
          {!showAllProducts && products.length > 2 && (
            <button 
              className="w-full py-3 mt-3 mb-6 text-center text-green-600 font-medium hover:bg-green-50 transition-colors border border-green-200 rounded-lg flex items-center justify-center"
              onClick={() => setShowAllProducts(true)}
            >
              <span>Ver mais produtos ({products.length - 2})</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          )}
          
          <SectionTitle 
            title="Comentários" 
            subtitle="O que falam sobre a Naturalys"
          />
          
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {visibleTestimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-start">
                  <div className={`${testimonial.bgColor} rounded-full w-10 h-10 flex items-center justify-center ${testimonial.textColor} font-medium flex-shrink-0`}>
                    {testimonial.initial}
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-medium text-gray-900">{testimonial.name}</h3>
                    {testimonial.isLocalGuide && <p className="text-xs text-gray-500 mt-0 mb-1">Local Guide</p>}
                    <div className="text-yellow-400 flex mt-1 mb-2">★★★★★</div>
                    <p className="text-gray-600 text-sm">{testimonial.comment}</p>
                  </div>
                </div>
              </div>
            ))}

            {!showMoreTestimonials && (
              <button 
                className="w-full py-3 text-center text-green-600 font-medium hover:bg-green-50 transition-colors border border-green-200 rounded-lg"
                onClick={() => setShowMoreTestimonials(true)}
              >
                Ver mais comentários ({testimonials.length - 3})
              </button>
            )}
          </div>
          
          <SectionTitle 
            title="Faça seu pedido" 
            subtitle="Enviamos para todo o Brasil"
          />
          
          <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <a 
              href={`https://wa.me/${settings?.whatsapp_number?.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-green-500 hover:bg-green-600 transition-colors text-white rounded-lg p-4 text-center shadow-md"
            >
              <div className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6 mr-2">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span className="font-medium text-lg">Fazer pedido</span>
              </div>
            </a>
          </div>
          
          <div className="text-xs text-gray-400 mt-5 mb-2 text-center">
            © 2025 {settings?.store_name || 'Sua Loja'} - Todos os direitos reservados
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
