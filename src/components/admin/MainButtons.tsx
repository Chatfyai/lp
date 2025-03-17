import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

interface MainButtonsProps {
  onUpdate?: () => void;
}

const MainButtons = ({ onUpdate }: MainButtonsProps) => {
  const [buttons, setButtons] = useState<MainButton[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [tempButton, setTempButton] = useState<MainButton | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchButtons();
  }, []);

  const fetchButtons = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('main_buttons')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      // Type cast the data to ensure status is treated as 'normal' | 'destaque'
      const typedData = data?.map(item => ({
        ...item,
        status: item.status as 'normal' | 'destaque'
      })) || [];
      
      setButtons(typedData);
    } catch (error) {
      console.error('Error fetching buttons:', error);
      toast({
        title: "Erro ao carregar botões",
        description: "Não foi possível carregar os botões. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddButton = async () => {
    const highestOrder = buttons.length > 0 
      ? Math.max(...buttons.map(b => b.order_index)) 
      : 0;
    
    const newButton: Omit<MainButton, 'id'> = {
      icon: '🔗',
      name: 'Novo Botão',
      description: 'Descrição do novo botão',
      link: 'https://',
      status: 'normal',
      order_index: highestOrder + 1
    };
    
    try {
      const { data, error } = await supabase
        .from('main_buttons')
        .insert([newButton])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        // Type cast the returned data
        const addedButton = {
          ...data[0],
          status: data[0].status as 'normal' | 'destaque'
        };
        
        setButtons([...buttons, addedButton]);
        setEditMode(addedButton.id);
        setTempButton(addedButton);
        
        toast({
          title: "Botão adicionado",
          description: "Um novo botão foi adicionado à lista",
        });
        
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Error adding button:', error);
      toast({
        title: "Erro ao adicionar botão",
        description: "Não foi possível adicionar o botão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (button: MainButton) => {
    setEditMode(button.id);
    setTempButton({...button});
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('main_buttons')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setButtons(buttons.filter(button => button.id !== id));
      toast({
        title: "Botão removido",
        description: "O botão foi removido com sucesso",
        variant: "destructive",
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting button:', error);
      toast({
        title: "Erro ao remover botão",
        description: "Não foi possível remover o botão. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (id: string) => {
    if (tempButton) {
      try {
        const { error } = await supabase
          .from('main_buttons')
          .update(tempButton)
          .eq('id', id);
          
        if (error) throw error;
        
        setButtons(buttons.map(button => 
          button.id === id ? tempButton : button
        ));
        setEditMode(null);
        setTempButton(null);
        
        toast({
          title: "Alterações salvas",
          description: "As alterações no botão foram salvas com sucesso",
        });
        
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error updating button:', error);
        toast({
          title: "Erro ao salvar alterações",
          description: "Não foi possível salvar as alterações. Tente novamente.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCancel = () => {
    setEditMode(null);
    setTempButton(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-store-highlight" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 border-0 shadow-sm">
        <div className="mb-4 text-sm text-gray-600">
          <p>Aqui você pode gerenciar os botões principais que aparecem no topo do seu site. Você pode adicionar, editar, excluir e ordenar esses botões. Os botões marcados como "Destaque" terão bordas verdes pulsantes e aparecerão primeiro na lista.</p>
        </div>
        
        <Button 
          onClick={handleAddButton}
          className="mb-4 bg-store-highlight hover:bg-opacity-90"
        >
          <Plus size={16} className="mr-2" /> Adicionar Botão
        </Button>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">#</th>
                <th className="py-2 text-left">Ícone</th>
                <th className="py-2 text-left">Nome</th>
                <th className="py-2 text-left">Descrição</th>
                <th className="py-2 text-left">Link</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              {buttons.map((button, index) => (
                <tr key={button.id} className="border-b hover:bg-gray-50 transition-all">
                  {editMode === button.id ? (
                    // Edit mode
                    <>
                      <td className="py-3">{index + 1}</td>
                      <td className="py-3">
                        <Input 
                          value={tempButton?.icon || ''} 
                          onChange={e => setTempButton({...tempButton!, icon: e.target.value})}
                          className="w-16"
                        />
                      </td>
                      <td className="py-3">
                        <Input 
                          value={tempButton?.name || ''} 
                          onChange={e => setTempButton({...tempButton!, name: e.target.value})}
                        />
                      </td>
                      <td className="py-3">
                        <Input 
                          value={tempButton?.description || ''} 
                          onChange={e => setTempButton({...tempButton!, description: e.target.value})}
                        />
                      </td>
                      <td className="py-3">
                        <Input 
                          value={tempButton?.link || ''} 
                          onChange={e => setTempButton({...tempButton!, link: e.target.value})}
                        />
                      </td>
                      <td className="py-3">
                        <select 
                          value={tempButton?.status || 'normal'}
                          onChange={e => setTempButton({...tempButton!, status: e.target.value as 'normal' | 'destaque'})}
                          className="p-2 border rounded-md"
                        >
                          <option value="normal">Normal</option>
                          <option value="destaque">Destaque</option>
                        </select>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleSave(button.id)}
                            className="text-green-600 border-green-200 hover:bg-green-50"
                          >
                            Salvar
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleCancel}
                            className="text-gray-500 border-gray-200 hover:bg-gray-50"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // View mode
                    <>
                      <td className="py-3">{index + 1}</td>
                      <td className="py-3 text-xl">{button.icon}</td>
                      <td className="py-3">{button.name}</td>
                      <td className="py-3 text-sm text-gray-600">{button.description}</td>
                      <td className="py-3 text-sm text-blue-600 truncate max-w-[150px]">{button.link}</td>
                      <td className="py-3">
                        <span 
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            button.status === 'destaque' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {button.status === 'destaque' ? 'Destaque' : 'Normal'}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleEdit(button)}
                            className="h-8 w-8 text-yellow-600 hover:bg-yellow-50"
                          >
                            <Pencil size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDelete(button.id)}
                            className="h-8 w-8 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MainButtons;
