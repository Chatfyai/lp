import { Link } from 'react-router-dom';
import { ChevronRight, Link as LinkIcon, ShoppingBag, BarChart, Settings as SettingsIcon, Bookmark } from 'lucide-react';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  sections: {
    MAIN_BUTTONS: string;
    PRODUCTS: string;
    CATALOG: string;
    STATISTICS: string;
    SETTINGS: string;
  };
}

const AdminSidebar = ({ activeSection, onSectionChange, sections }: AdminSidebarProps) => {
  const isActive = (section: string) => activeSection === section;

  return (
    <div className="w-64 bg-store-primary text-white min-h-screen p-4 hidden md:block">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 bg-store-highlight rounded-md flex items-center justify-center">
          <span className="text-white font-bold">A</span>
        </div>
        <h1 className="text-xl font-bold">Painel Admin</h1>
      </div>
      
      <nav className="space-y-2">
        <button
          onClick={() => onSectionChange(sections.MAIN_BUTTONS)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-left ${
            isActive(sections.MAIN_BUTTONS)
              ? 'bg-white bg-opacity-10 text-white'
              : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
          }`}
        >
          <LinkIcon size={18} />
          <span>Botões Principais</span>
          {isActive(sections.MAIN_BUTTONS) && <ChevronRight size={16} className="ml-auto" />}
        </button>
        
        <button
          onClick={() => onSectionChange(sections.PRODUCTS)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-left ${
            isActive(sections.PRODUCTS)
              ? 'bg-white bg-opacity-10 text-white'
              : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
          }`}
        >
          <ShoppingBag size={18} />
          <span>Produtos</span>
          {isActive(sections.PRODUCTS) && <ChevronRight size={16} className="ml-auto" />}
        </button>
        
        <button
          onClick={() => onSectionChange(sections.CATALOG)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-left ${
            isActive(sections.CATALOG)
              ? 'bg-white bg-opacity-10 text-white'
              : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
          }`}
        >
          <Bookmark size={18} />
          <span>Catálogo dos Produtos</span>
          {isActive(sections.CATALOG) && <ChevronRight size={16} className="ml-auto" />}
        </button>
        
        <button
          onClick={() => onSectionChange(sections.STATISTICS)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-left ${
            isActive(sections.STATISTICS)
              ? 'bg-white bg-opacity-10 text-white'
              : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
          }`}
        >
          <BarChart size={18} />
          <span>Estatísticas</span>
          {isActive(sections.STATISTICS) && <ChevronRight size={16} className="ml-auto" />}
        </button>
        
        <button
          onClick={() => onSectionChange(sections.SETTINGS)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all text-left ${
            isActive(sections.SETTINGS)
              ? 'bg-white bg-opacity-10 text-white'
              : 'text-gray-300 hover:bg-white hover:bg-opacity-5'
          }`}
        >
          <SettingsIcon size={18} />
          <span>Configurações</span>
          {isActive(sections.SETTINGS) && <ChevronRight size={16} className="ml-auto" />}
        </button>
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <Link to="/" className="block w-full px-3 py-2 bg-white bg-opacity-5 hover:bg-opacity-10 rounded-md text-center text-sm transition-all">
          Ver Loja
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
