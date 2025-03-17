import { ReactNode } from 'react';

interface LinkCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  highlight?: boolean;
}

const LinkCard = ({ icon, title, description, href, highlight = false }: LinkCardProps) => {
  return (
    <a 
      href={href} 
      className={`link-card ${highlight ? 'destaque' : ''} ${highlight ? 'relative' : ''}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {highlight && (
        <div className="absolute inset-0 border-2 border-store-highlight rounded-xl animate-pulse-border"></div>
      )}
      <div className="w-7 h-7 flex items-center justify-center text-xl">
        {icon}
      </div>
      <div className="text-left">
        <div className="font-medium">{title}</div>
        <div className="text-xs text-gray-500 mt-0.5">{description}</div>
      </div>
    </a>
  );
};

export default LinkCard;
