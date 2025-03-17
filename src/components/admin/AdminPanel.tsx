import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Products from './Products';
import MainButtons from './MainButtons';
import StoreSettings from './StoreSettings';
import { useStore } from '@/context/StoreContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const { refreshData } = useStore();
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };
  
  const handleRefreshMainPage = async () => {
    setIsRefreshing(true);
    
    try {
      toast({
        title: "Atualizando dados",
        description: "Aguarde enquanto sincronizamos os dados com a página principal...",
      });
      
      await refreshData();
      
      toast({
        title: "Dados atualizados",
        description: "A página principal foi atualizada com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível sincronizar os dados. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <Button 
          variant="outline" 
          onClick={handleRefreshMainPage} 
          disabled={isRefreshing}
          className="flex items-center gap-2"
        >
          <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Atualizando...' : 'Atualizar Página Principal'}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full flex border-b mb-8">
          <TabsTrigger value="products" className="flex-1">Produtos</TabsTrigger>
          <TabsTrigger value="buttons" className="flex-1">Botões</TabsTrigger>
          <TabsTrigger value="settings" className="flex-1">Configurações</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products">
          <Products onUpdate={refreshData} />
        </TabsContent>
        
        <TabsContent value="buttons">
          <MainButtons onUpdate={refreshData} />
        </TabsContent>
        
        <TabsContent value="settings">
          <StoreSettings onUpdate={refreshData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel; 