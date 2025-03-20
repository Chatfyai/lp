import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, Plus, Loader2, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from '@/components/ImageUpload';
import ImageSelector from './ImageSelector';
import { useStore } from '@/context/StoreContext';

interface Product {
  id: string;
  name: string;
  price: string;
  promo_price?: string;
  image: string;
  order_index: number;
}

interface ProductsProps {
  onUpdate?: () => void;
}

const Products = ({ onUpdate }: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [tempProduct, setTempProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { refreshProducts } = useStore();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Não foi possível carregar os produtos. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async () => {
    const highestOrder = products.length > 0 
      ? Math.max(...products.map(p => p.order_index)) 
      : 0;
    
    const newProduct: Omit<Product, 'id'> = {
      name: 'Novo Produto',
      price: '',
      image: 'https://picsum.photos/id/237/300/300',
      order_index: highestOrder + 1
    };
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([newProduct])
        .select();
        
      if (error) throw error;
      
      if (data && data.length > 0) {
        const addedProduct = data[0];
        setProducts([...products, addedProduct]);
        setEditMode(addedProduct.id);
        setTempProduct(addedProduct);
        
        await refreshProducts();
        
        toast({
          title: "Produto adicionado",
          description: "Um novo produto foi adicionado à lista",
        });
        
        if (onUpdate) onUpdate();
      }
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: "Não foi possível adicionar o produto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditMode(product.id);
    setTempProduct({...product});
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      setProducts(products.filter(product => product.id !== id));
      
      await refreshProducts();
      
      toast({
        title: "Produto removido",
        description: "O produto foi removido com sucesso",
        variant: "destructive",
      });
      
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Erro ao remover produto",
        description: "Não foi possível remover o produto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async (id: string) => {
    if (tempProduct) {
      try {
        toast({
          title: "Salvando alterações",
          description: "Aguarde enquanto salvamos suas alterações...",
        });
        
        const { error } = await supabase
          .from('products')
          .update(tempProduct)
          .eq('id', id);
          
        if (error) throw error;
        
        setProducts(products.map(product => 
          product.id === id ? tempProduct : product
        ));
        setEditMode(null);
        setTempProduct(null);
        
        await refreshProducts();
        
        toast({
          title: "Alterações salvas",
          description: "As alterações no produto foram salvas com sucesso",
        });
        
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error updating product:', error);
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
    setTempProduct(null);
  };
  
  const handleImageUpload = async (id: string, imageUrl: string) => {
    if (!tempProduct) return;
    
    try {
      console.log("Salvando nova imagem para produto:", imageUrl);
      
      // Remover parâmetros de URL se existirem
      let cleanImageUrl = imageUrl;
      if (imageUrl.includes('?')) {
        cleanImageUrl = imageUrl.split('?')[0];
      }
      
      // Atualizar o tempProduct com a nova imagem
      setTempProduct({...tempProduct, image: cleanImageUrl});
      
      // Atualizar diretamente no banco também para garantir
      const { error } = await supabase
        .from('products')
        .update({ image: cleanImageUrl })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      await refreshProducts();
      
      toast({
        title: "Imagem carregada",
        description: "A imagem do produto foi atualizada com sucesso",
      });
      
      // Refrescar produtos após atualização
      fetchProducts();
      
    } catch (error) {
      console.error('Erro ao atualizar imagem do produto:', error);
      toast({
        title: "Erro ao carregar imagem",
        description: "Não foi possível atualizar a imagem do produto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleImageSelect = async (id: string, imageUrl: string) => {
    if (!tempProduct) return;
    
    try {
      console.log("Selecionando imagem para produto:", imageUrl);
      
      // Atualizar o tempProduct com a nova imagem
      setTempProduct({...tempProduct, image: imageUrl});
      
      // Atualizar diretamente no banco também para garantir
      const { error } = await supabase
        .from('products')
        .update({ image: imageUrl })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      await refreshProducts();
      
      toast({
        title: "Imagem atualizada",
        description: "A imagem do produto foi atualizada com sucesso",
      });
      
      // Refrescar produtos após atualização
      fetchProducts();
      
    } catch (error) {
      console.error('Erro ao atualizar imagem do produto:', error);
      toast({
        title: "Erro ao atualizar imagem",
        description: "Não foi possível atualizar a imagem do produto. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    return (
      <Card key={product.id} className="p-4 mb-4 transition-all border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Nome do Produto</label>
            <Input 
              type="text" 
              value={tempProduct?.name || ''} 
              onChange={(e) => setTempProduct({...tempProduct!, name: e.target.value})}
              className="mt-1"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Imagem do Produto</label>
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden border aspect-square">
                  {tempProduct?.image ? (
                    <img 
                      src={tempProduct.image} 
                      alt={tempProduct.name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        // Fallback se a imagem não carregar
                        e.currentTarget.src = 'https://picsum.photos/id/237/300/300';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <Image size={48} />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="w-full md:w-2/3 space-y-4">
                <div>
                  <div className="text-sm font-medium mb-2">Upload de Imagem</div>
                  <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
                    <ImageUpload 
                      onUploadComplete={(imageUrl) => handleImageUpload(product.id, imageUrl)} 
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Faça upload de uma imagem do seu computador. Formatos suportados: JPG, PNG, GIF, WebP.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="outline" 
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => handleSave(product.id)}
            >
              Salvar Alterações
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-10 w-10 animate-spin text-store-highlight" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Produtos</h2>
        <Button onClick={handleAddProduct} size="sm" variant="outline" className="flex items-center">
          <Plus size={16} className="mr-1" /> Adicionar Produto
        </Button>
      </div>
      
      {products.length === 0 && !isLoading ? (
        <div className="text-center py-10 border border-dashed rounded-lg">
          <p className="text-gray-500 mb-4">Você ainda não tem nenhum produto cadastrado.</p>
          <Button onClick={handleAddProduct} variant="outline" className="flex items-center mx-auto">
            <Plus size={16} className="mr-1" /> Adicionar seu primeiro produto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map(product => (
            editMode === product.id ? handleEditProduct(product) : (
              <Card key={product.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex">
                    <div className="flex-1">
                      <h3 className="font-medium">{product.name}</h3>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleEdit(product)} 
                        size="icon" 
                        variant="outline"
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button 
                        onClick={() => handleDelete(product.id)} 
                        size="icon" 
                        variant="outline"
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="relative pb-[75%] overflow-hidden bg-gray-100">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="absolute inset-0 h-full w-full object-cover" 
                  />
                </div>
              </Card>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
