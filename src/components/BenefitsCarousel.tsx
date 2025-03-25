import { useEffect, useRef, memo } from 'react';
import { 
  FiShoppingBag, 
  FiTruck, 
  FiShield, 
  FiMessageCircle, 
  FiHeart, 
  FiPackage, 
  FiBox,
  FiCreditCard,
  FiLink
} from 'react-icons/fi';

interface BenefitItem {
  icon: JSX.Element;
  text: string;
}

// Ícones pré-renderizados para melhor performance
const IconCard = memo(({ icon }: { icon: JSX.Element }) => (
  <div className="bg-white p-3 rounded-full shadow-sm border border-gray-100">
    {icon}
  </div>
));

// Componente de Item do Benefício otimizado
const BenefitItemComponent = memo(({ benefit }: { benefit: BenefitItem }) => (
  <div className="flex flex-col items-center justify-start gap-2 min-w-[105px] flex-shrink-0">
    <IconCard icon={benefit.icon} />
    <p className="text-center text-xs text-gray-600 w-full">
      {benefit.text}
    </p>
  </div>
));

const BenefitsCarousel = () => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);

  // Lista de benefícios com ícones e textos
  const benefits: BenefitItem[] = [
    {
      icon: <FiCreditCard className="w-7 h-7 text-[#16A34A]" />,
      text: "Parcelamos sem juros"
    },
    {
      icon: <FiLink className="w-7 h-7 text-[#16A34A]" />,
      text: "Aceitamos link de pagamentos"
    },
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

  // Função otimizada para scroll automático
  const scrollCarousel = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    // Se chegou ao final, voltar ao início
    if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      // Caso contrário, continuar rolando
      carousel.scrollBy({ left: 120, behavior: 'smooth' });
    }
    
    // Agendar próximo scroll
    scrollTimerRef.current = window.setTimeout(scrollCarousel, 3500);
  };

  // Efeito para iniciar a rolagem automática com otimização de performance
  useEffect(() => {
    // Iniciar rolagem após um breve delay para permitir renderização da página
    const initialTimer = window.setTimeout(() => {
      scrollCarousel();
    }, 1000);
    
    // Limpar os timers quando o componente for desmontado
    return () => {
      clearTimeout(initialTimer);
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }
    };
  }, []);

  // Manipulador de interação do usuário - pausar o scroll
  const handleUserInteraction = () => {
    // Cancelar scroll automático durante a interação
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    
    // Retomar o scroll após um período
    scrollTimerRef.current = window.setTimeout(scrollCarousel, 4000);
  };

  return (
    <div className="w-full my-4 overflow-hidden bg-white relative">
      <h3 className="text-center text-lg font-bold text-[#16A34A] mb-3 pt-3">Benefícios da naturalys</h3>
      
      {/* Indicação visual de que há mais conteúdo para rolagem */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {[...Array(9)].map((_, i) => (
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
        onTouchStart={handleUserInteraction}
        onMouseDown={handleUserInteraction}
      >
        {benefits.map((benefit, index) => (
          <BenefitItemComponent key={index} benefit={benefit} />
        ))}
      </div>
    </div>
  );
};

export default memo(BenefitsCarousel); 