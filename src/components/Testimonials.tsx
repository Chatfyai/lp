'use client';

import { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  rating: number;
  date: string;
  isNew?: boolean;
  comment: string;
  reply?: {
    date: string;
    text: string;
  };
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Lucia de fatima de souza Lucinha",
    rating: 5,
    date: "Há 1 semana",
    isNew: true,
    comment: "Atendente muito educado, altamente preparado para responder as dúvidas dos clientes. Estão de parabéns",
    reply: {
      date: "Há 1 semana",
      text: "Que ótimo feedback 😍😍💚"
    }
  },
  {
    id: 2,
    name: "Maria Jarluce",
    rating: 5,
    date: "Há 1 semana",
    isNew: true,
    comment: "Atendimento atencioso e eficaz, me sentir acolhida e satisfeita.",
    reply: {
      date: "Há 1 semana",
      text: "Que ótimo depoimento Jarluce, ficamos super felizes, sempre estamos dando o nosso máximo para deixar nossos clientes ainda mais satisfeito 😍😍💚 Obrigada por escolher A Naturalys"
    }
  },
  {
    id: 3,
    name: "Johnny García",
    rating: 5,
    date: "Há 5 semanas",
    comment: "Ótimo atendimento, loja moderna. Os gestores são pessoas de uma energia positiva, maravilhosos e na real, os produtos curam de verdade.",
    reply: {
      date: "Há 5 semanas",
      text: "💚💚🥰"
    }
  },
  {
    id: 4,
    name: "Igor Samuel",
    rating: 5,
    date: "Há 6 semanas",
    comment: "Ótimo atendimento",
    reply: {
      date: "Há 6 semanas",
      text: "💚🥰"
    }
  },
  {
    id: 5,
    name: "Maria Susanna da Silveira Dantas",
    rating: 5,
    date: "Há 7 semanas",
    comment: "Sempre o melhor atendimento ❤️ e preço também ✅",
    reply: {
      date: "Há 11 semanas",
      text: "Ficamos Super felizes pelo o seu ótimo feedback, Esse é o nosso propósito, obrigado por ser Naturalys 💚😍"
    }
  },
  {
    id: 6,
    name: "Maze Salgados",
    rating: 5,
    date: "Há 8 semanas",
    comment: "Gosto muito dos produtos daí, sem falar no ótimo atendimento 😃",
    reply: {
      date: "Há 8 semanas",
      text: "💚💚"
    }
  },
  {
    id: 7,
    name: "Isabella Rayanne Araujo",
    rating: 5,
    date: "Há 9 semanas",
    comment: "Ótimo atendimento estão de parabéns",
    reply: {
      date: "Há 8 semanas",
      text: "Muitooo obrigadaa Isabella 💚💚"
    }
  },
  {
    id: 8,
    name: "Francisca Vitorino",
    rating: 5,
    date: "Há 11 semanas",
    comment: "A atendente Mariana foi muito prestativa, atenciosa e eficiente, senti-me bem acolhida.",
    reply: {
      date: "Há 11 semanas",
      text: "Obrigadaaaa, pelo o seu ótimo feedback 😍😍😍😍😍💚"
    }
  },
  {
    id: 9,
    name: "Vitória alves",
    rating: 5,
    date: "Há 20 semanas",
    comment: "Ótimo gosto muito dos produtos e do atendimento tbm vcs tão de parabéns",
    reply: {
      date: "Há 20 semanas",
      text: "Obrigado vitória, ficamos muitos felizes por sua mensagem 💚"
    }
  },
  {
    id: 10,
    name: "EFDS 123",
    rating: 5,
    date: "Há 24 semanas",
    comment: "Ótimo atendimento, super indico",
    reply: {
      date: "Há 24 semanas",
      text: "Muito obrigado pelo seu ótimo feedback, ficamos muito felizes, sempre se esforçamos para manter o nosso padrão de qualidade no atendimento 💚"
    }
  },
  {
    id: 11,
    name: "Valéria",
    rating: 5,
    date: "27 de mar. de 2023",
    comment: "Lugar agradável com um atendimento especial, profissional que sabe sugerir produtos de acordo com suas necessidades. Maravilhoso!!!",
    reply: {
      date: "27 de mar. de 2023",
      text: "Obrigado Valéria, ficamos super felizes pelo o seu depoimento 💚💚, Sempre que precisar, estamos a disposição 😍"
    }
  },
  {
    id: 12,
    name: "Mariana Jamilly",
    rating: 5,
    date: "23 de mar. de 2023",
    comment: "Amei o atendimento e sem falar da variedade de produtos.",
    reply: {
      date: "23 de mar. de 2023",
      text: "Obrigado Mariana ficamos Super feliz, qualquer dúvida estamos sempre a disposição."
    }
  }
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="border rounded-lg p-4 mb-6 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-semibold">{testimonial.name}</p>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-lg">★</span>
              ))}
            </div>
            <span>{testimonial.date}</span>
            {testimonial.isNew && <span className="text-green-600 font-medium">Novo</span>}
          </div>
        </div>
      </div>
      
      <p className="text-gray-700 mb-4">{testimonial.comment}</p>
      
      {testimonial.reply && (
        <div className="bg-gray-50 p-3 rounded-lg mt-2 border-l-4 border-green-400">
          <div className="flex items-center mb-1">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2 border border-green-200">
              <span className="text-green-600 text-sm font-bold">N</span>
            </div>
            <div>
              <p className="font-medium text-sm">Loja de Produtos Naturais e Suplementos - Naturalys</p>
              <p className="text-xs text-gray-500">Proprietário</p>
              <p className="text-xs text-gray-500">{testimonial.reply.date}</p>
            </div>
          </div>
          <p className="text-gray-700 text-sm ml-10">{testimonial.reply.text}</p>
        </div>
      )}
    </div>
  );
};

export default function Testimonials() {
  const [visibleCount, setVisibleCount] = useState(3);
  
  // Selecionar os melhores depoimentos com base em critérios (comentários mais completos)
  const bestTestimonials = [
    testimonials[1], // Maria Jarluce - comentário completo e resposta detalhada
    testimonials[2], // Johnny García - comentário mais detalhado sobre produtos e atendimento
    testimonials[10], // Valéria - depoimento mais completo sobre o atendimento
    testimonials[8], // Vitória alves - elogio aos produtos e atendimento
    testimonials[7], // Francisca Vitorino - depoimento personalizado sobre atendente
    testimonials[0], // Lucia de fatima - depoimento completo sobre atendimento
  ];
  
  const visibleTestimonials = bestTestimonials.slice(0, visibleCount);
  
  const handleShowMore = () => {
    // Se estamos mostrando 3, passar para 6. Se já mostramos 6, mostrar todos
    if (visibleCount === 3) {
      setVisibleCount(6);
    } else {
      setVisibleCount(testimonials.length);
    }
  };
  
  return (
    <div className="py-8 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">O que falam sobre a Naturalys</h2>
        <p className="text-gray-600">Veja o que nossos clientes estão dizendo sobre nós</p>
      </div>
      
      <div className="max-w-3xl mx-auto">
        {visibleTestimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.id} testimonial={testimonial} />
        ))}
        
        {visibleCount < bestTestimonials.length && (
          <button
            onClick={handleShowMore}
            className="w-full py-3 text-center text-green-600 font-medium hover:bg-green-50 transition-colors border border-green-200 rounded-lg mt-2"
          >
            Ver mais comentários ({bestTestimonials.length - visibleCount})
          </button>
        )}
      </div>
    </div>
  );
} 