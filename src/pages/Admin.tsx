import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import AdminSidebar from '@/components/admin/AdminSidebar';
import MainButtons from '@/components/admin/MainButtons';
import Products from '@/components/admin/Products';
import Statistics from '@/components/admin/Statistics';
import Settings from '@/components/admin/Settings';

const SECTIONS = {
  MAIN_BUTTONS: 'main_buttons',
  PRODUCTS: 'products',
  STATISTICS: 'statistics',
  SETTINGS: 'settings',
  IMAGES: 'images'
};

const Admin = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(SECTIONS.MAIN_BUTTONS);
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSectionChange = (section) => {
    if (section === SECTIONS.IMAGES) {
      navigate('/admin/images');
    } else {
      setActiveSection(section);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case SECTIONS.MAIN_BUTTONS:
        return <MainButtons onUpdate={() => toast({ title: "Alterações salvas", description: "As alterações foram salvas e aparecerão na página principal." })} />;
      case SECTIONS.PRODUCTS:
        return <Products onUpdate={() => toast({ title: "Alterações salvas", description: "As alterações foram salvas e aparecerão na página principal." })} />;
      case SECTIONS.STATISTICS:
        return <Statistics />;
      case SECTIONS.SETTINGS:
        return <Settings onUpdate={() => toast({ title: "Alterações salvas", description: "As alterações foram salvas e aparecerão na página principal." })} />;
      default:
        return <MainButtons onUpdate={() => toast({ title: "Alterações salvas", description: "As alterações foram salvas e aparecerão na página principal." })} />;
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
        sections={SECTIONS}
      />
      
      <div className="flex-1 p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {activeSection === SECTIONS.MAIN_BUTTONS && 'Gerenciar Botões Principais'}
            {activeSection === SECTIONS.PRODUCTS && 'Gerenciar Produtos'}
            {activeSection === SECTIONS.STATISTICS && 'Estatísticas'}
            {activeSection === SECTIONS.SETTINGS && 'Configurações'}
          </h1>
          <Button 
            variant="outline"
            onClick={handleLogout}
            className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
          >
            Sair
          </Button>
        </div>
        
        <div className="animate-fade-in">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Admin;
