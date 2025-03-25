import { useEffect, useRef, useState, memo } from 'react';
import { 
  FiShoppingBag, 
  FiTruck, 
  FiShield, 
  FiMessageCircle, 
  FiHeart, 
  FiPackage, 
  FiBox,
  FiCreditCard,
  FiLink,
  FiChevronLeft,
  FiChevronRight
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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

  // Função para calcular o índice ativo
  const calculateActiveIndex = () => {
    const carousel = carouselRef.current;
    if (!carousel) return 0;
    
    const scrollPosition = carousel.scrollLeft;
    const itemWidth = carousel.scrollWidth / benefits.length;
    const index = Math.round(scrollPosition / itemWidth);
    
    return Math.min(index, benefits.length - 1);
  };

  // Função otimizada para scroll automático
  const scrollCarousel = () => {
    const carousel = carouselRef.current;
    if (!carousel || isPaused) return;
    
    // Se chegou ao final, voltar ao início
    if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });
      setActiveIndex(0);
    } else {
      // Caso contrário, continuar rolando
      carousel.scrollBy({ left: 120, behavior: 'smooth' });
      
      // Atualizar o índice ativo após a rolagem
      setTimeout(() => {
        setActiveIndex(calculateActiveIndex());
      }, 500);
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
  }, [isPaused]);

  // Efeito para monitorar o scroll e atualizar o indicador ativo
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    const handleScroll = () => {
      setActiveIndex(calculateActiveIndex());
    };
    
    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  // Manipulador de interação do usuário - pausar o scroll
  const handleUserInteraction = () => {
    // Cancelar scroll automático durante a interação
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    
    // Retomar o scroll após um período
    scrollTimerRef.current = window.setTimeout(() => {
      scrollCarousel();
    }, 4000);
  };

  // Navegação para o item anterior
  const scrollToPrevious = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    setIsPaused(true);
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    
    const itemWidth = carousel.scrollWidth / benefits.length;
    carousel.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    
    setTimeout(() => {
      setActiveIndex(calculateActiveIndex());
      setIsPaused(false);
    }, 500);
  };

  // Navegação para o próximo item
  const scrollToNext = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    setIsPaused(true);
    if (scrollTimerRef.current) {
      clearTimeout(scrollTimerRef.current);
    }
    
    const itemWidth = carousel.scrollWidth / benefits.length;
    carousel.scrollBy({ left: itemWidth, behavior: 'smooth' });
    
    setTimeout(() => {
      setActiveIndex(calculateActiveIndex());
      setIsPaused(false);
    }, 500);
  };

  return (
    <div className="w-full my-4 overflow-hidden bg-white relative">
      <h3 className="text-center text-lg font-bold text-[#16A34A] mb-3 pt-3">Benefícios da naturalys</h3>
      
      {/* Indicação visual de que há mais conteúdo para rolagem */}
      <div className="flex items-center justify-center gap-1 mb-2">
        {benefits.map((_, i) => (
          <div 
            key={i} 
            className={`h-1 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-5 bg-[#16A34A]' : 'w-1 bg-gray-200'}`}
          />
        ))}
      </div>
      
      {/* Botões de navegação */}
      <div className="relative px-1">
        <button 
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md border border-gray-100 text-[#16A34A] transition-all"
          onClick={scrollToPrevious}
          aria-label="Item anterior"
        >
          <FiChevronLeft size={24} />
        </button>
        
        <button 
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white rounded-full p-2 shadow-md border border-gray-100 text-[#16A34A] transition-all"
          onClick={scrollToNext}
          aria-label="Próximo item"
        >
          <FiChevronRight size={24} />
        </button>
        
        {/* Wrapper do carrossel com controle de scroll horizontal */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto pb-4 pt-2 gap-5 px-12 no-scrollbar touch-pan-x"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory'
          }}
          onTouchStart={handleUserInteraction}
          onMouseDown={handleUserInteraction}
        >
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="scroll-snap-align-start"
              style={{ scrollSnapAlign: 'start' }}
            >
              <BenefitItemComponent benefit={benefit} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(BenefitsCarousel); 