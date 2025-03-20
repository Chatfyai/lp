import { useEffect, useRef } from 'react';
import { 
  FiShoppingBag, 
  FiTruck, 
  FiShield, 
  FiMessageCircle, 
  FiHeart, 
  FiPackage, 
  FiBox 
} from 'react-icons/fi';

interface BenefitItem {
  icon: JSX.Element;
  text: string;
}

const BenefitsCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Lista de benefícios com ícones e textos
  const benefits: BenefitItem[] = [
    {
      icon: <FiTruck className="w-7 h-7 text-[#16A34A]" />,
      text: "Entrega super rápida"
    },
    {
      icon: <FiShoppingBag className="w-7 h-7 text-[#16A34A]" />,
      text: "Enviamos para todo o Brasil"
    },
    {
      icon: <FiShield className="w-7 h-7 text-[#16A34A]" />,
      text: "Segurança na sua compra"
    },
    {
      icon: <FiMessageCircle className="w-7 h-7 text-[#16A34A]" />,
      text: "Atendimento ultra rápido"
    },
    {
      icon: <FiHeart className="w-7 h-7 text-[#16A34A]" />,
      text: "Produtos 100% natural"
    },
    {
      icon: <FiPackage className="w-7 h-7 text-[#16A34A]" />,
      text: "Suplementos direto de fábrica"
    },
    {
      icon: <FiBox className="w-7 h-7 text-[#16A34A]" />,
      text: "Todas as vitaminas puras"
    }
  ];

  // Efeito para iniciar a rolagem automática
  useEffect(() => {
    let scrollInterval: NodeJS.Timeout;
    const carousel = carouselRef.current;
    
    if (carousel) {
      // Configurar rolagem automática
      scrollInterval = setInterval(() => {
        // Se chegou ao final, voltar ao início
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10) {
          carousel.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Caso contrário, continuar rolando
          carousel.scrollBy({ left: 120, behavior: 'smooth' });
        }
      }, 3500);
    }

    // Limpar o intervalo quando o componente for desmontado
    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <div className="w-full my-4 overflow-hidden bg-white relative">
      <h3 className="text-center text-lg font-medium text-gray-800 mb-3 pt-3">Benefícios</h3>
      
      {/* Indicação visual de que há mais conteúdo para rolagem */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {[...Array(7)].map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full ${i === 0 ? 'w-5 bg-[#16A34A]' : 'w-1 bg-gray-200'}`}
          />
        ))}
      </div>
      
      {/* Wrapper do carrossel com controle de scroll horizontal */}
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto pb-3 gap-5 px-4 no-scrollbar touch-pan-x"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {benefits.map((benefit, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center justify-start gap-2 min-w-[105px] flex-shrink-0"
          >
            <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100">
              {benefit.icon}
            </div>
            <p className="text-center text-xs text-gray-600 w-full">
              {benefit.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BenefitsCarousel; 