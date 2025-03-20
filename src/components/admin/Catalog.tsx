import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Loader2, Tag, Package, X, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from '@/components/ImageUpload';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';

interface Brand {
  id: string;
  name: string;
  created_at?: string;
}

interface CatalogProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  brand_id: string;
  created_at?: string;
  updated_at?: string;
}

interface CatalogProps {
  onUpdate?: () => void;
}

const Catalog = ({ onUpdate }: CatalogProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<CatalogProduct>>({
    name: '',
    description: '',
    image: 'https://picsum.photos/id/237/300/300',
    brand_id: ''
  });
  const { toast } = useToast();

  // Estado para armazenar informações de diagnóstico
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);

  // Função para verificar a conexão com o Supabase
  const checkSupabaseConnection = async () => {
    try {
      // Verificar URL e chave anon
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://soiwkehhnccoestmjjmg.supabase.co";
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaXdrZWhobmNjb2VzdG1qam1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MzE2MTcsImV4cCI6MjA1NTQwNzYxN30.mgf0MAL7dTL3ek34wqrWu4f2Wxjghbws23-FIgIcRJ4";
      
      setDiagnosticInfo({
        supabaseUrl,
        supabaseKeyFirstChars: supabaseKey.substring(0, 10) + '...',
        timestamp: new Date().toISOString()
      });
      
      // Testar conexão básica com a tabela brands
      const { data: brandsData, error: brandsError } = await supabase
        .from('brands')
        .select('count')
        .limit(1);
      
      if (brandsError) {
        setDiagnosticInfo(prev => ({
          ...prev,
          brandsCheck: {
            success: false,
            error: brandsError
          }
        }));
        
        console.error('Erro ao verificar tabela brands:', brandsError);
        
        if (brandsError.code === '42P01') {
          toast({
            title: "Tabela 'brands' não encontrada",
            description: "A tabela 'brands' não foi encontrada no banco de dados. Execute o SQL para criar as tabelas.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erro de conexão com o Supabase",
            description: `Erro ao acessar tabela brands: ${brandsError.message || brandsError}`,
            variant: "destructive",
          });
        }
      } else {
        setDiagnosticInfo(prev => ({
          ...prev,
          brandsCheck: {
            success: true,
            data: brandsData
          }
        }));
        
        console.log('Conexão com a tabela brands bem-sucedida:', brandsData);
      }
      
      return true;
    } catch (err) {
      console.error('Erro ao verificar conexão com o Supabase:', err);
      setDiagnosticInfo(prev => ({
        ...prev,
        connectionError: err
      }));
      
      toast({
        title: "Erro de conexão",
        description: "Não foi possível conectar ao banco de dados. Verifique o console para mais detalhes.",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  useEffect(() => {
    checkSupabaseConnection();
    fetchBrands();
    fetchProducts();
  }, []);

  // Função para buscar marcas usando MCP
  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      console.log('Tentando carregar marcas via MCP Supabase...');
      
      const sql = `SELECT id, name, created_at, updated_at FROM brands ORDER BY name ASC;`;
      
      // @ts-ignore - Ignorar erro de tipos do TypeScript para a função global
      const result = await mcp_supabase_query({ sql });
      
      if (result.isError) {
        console.error('Erro ao carregar marcas:', result.error);
        toast({
          title: "Erro ao carregar marcas",
          description: "Não foi possível carregar as marcas. Erro de permissão do Supabase.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Processar resultado
      const brandsData = result.content && 
                        result.content[0]?.type === 'text' && 
                        JSON.parse(result.content[0].text);
      
      console.log('Marcas carregadas com sucesso via MCP:', brandsData?.length || 0, 'marcas encontradas');
      setBrands(brandsData || []);
      
      // Atualizar diagnóstico
      setDiagnosticInfo(prev => ({
        ...prev,
        brandsCheck: {
          success: true,
          countLoaded: brandsData?.length || 0,
          lastUpdated: new Date().toISOString()
        }
      }));
      
    } catch (error) {
      console.error('Erro ao carregar marcas via MCP:', error);
      toast({
        title: "Erro ao carregar marcas",
        description: "Ocorreu um erro ao tentar carregar as marcas. Verifique o console.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      console.log('Tentando carregar produtos do catálogo via MCP...');
      
      const sql = `SELECT * FROM catalog_products ORDER BY name ASC;`;
      
      // @ts-ignore - Ignorar erro de tipos do TypeScript para a função global
      const result = await mcp_supabase_query({ sql });
      
      if (result.isError) {
        console.error('Erro ao carregar produtos:', result.error);
        toast({
          title: "Erro ao carregar produtos",
          description: "Não foi possível carregar os produtos do catálogo. Erro de permissão do Supabase.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Processar resultado
      const productsData = result.content && 
                         result.content[0]?.type === 'text' && 
                         JSON.parse(result.content[0].text);
      
      console.log('Produtos carregados com sucesso via MCP:', productsData?.length || 0, 'produtos encontrados');
      setProducts(productsData || []);
      
    } catch (error) {
      console.error('Erro ao carregar produtos via MCP:', error);
      toast({
        title: "Erro ao carregar produtos",
        description: "Ocorreu um erro ao tentar carregar os produtos. Verifique o console.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBrand = async () => {
    if (!newBrandName.trim()) {
      toast({
        title: "Nome da marca é obrigatório",
        description: "Por favor, insira um nome para a marca.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    console.log('Tentando adicionar marca via MCP:', newBrandName.trim());

    try {
      const brandName = newBrandName.trim();
      
      // Verificar se já existe uma marca com este nome
      const checkSql = `SELECT id FROM brands WHERE name = '${brandName}' LIMIT 1;`;
      
      // @ts-ignore - Ignorar erro de tipos do TypeScript para a função global
      const checkResult = await mcp_supabase_query({ sql: checkSql });
      
      if (checkResult.isError) {
        console.error('Erro ao verificar marca existente:', checkResult.error);
        toast({
          title: "Erro ao verificar marca",
          description: "Não foi possível verificar se a marca já existe.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      const existingBrandData = checkResult.content && 
                             checkResult.content[0]?.type === 'text' && 
                             JSON.parse(checkResult.content[0].text);
      
      if (existingBrandData && existingBrandData.length > 0) {
        toast({
          title: "Marca já existe",
          description: "Já existe uma marca com este nome.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Inserir nova marca
      const insertSql = `
        INSERT INTO brands (name, created_at, updated_at) 
        VALUES ('${brandName}', NOW(), NOW()) 
        RETURNING id, name, created_at;
      `;
      
      // @ts-ignore - Ignorar erro de tipos do TypeScript para a função global
      const insertResult = await mcp_supabase_query({ sql: insertSql });
      
      if (insertResult.isError) {
        console.error('Erro ao adicionar marca:', insertResult.error);
        toast({
          title: "Erro ao adicionar marca",
          description: "Não foi possível adicionar a marca. Erro de permissão do Supabase.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Processar resultado
      const newBrandData = insertResult.content && 
                        insertResult.content[0]?.type === 'text' && 
                        JSON.parse(insertResult.content[0].text);
      
      if (newBrandData && newBrandData.length > 0) {
        // Adicionar a nova marca à lista
        setBrands([...brands, newBrandData[0]]);
        setNewBrandName('');
        setIsAddingBrand(false);
        
        toast({
          title: "Marca adicionada",
          description: "A marca foi adicionada com sucesso via MCP.",
        });
        
        if (onUpdate) onUpdate();
      } else {
        toast({
          title: "Aviso",
          description: "A marca parece ter sido adicionada, mas não foi possível confirmar.",
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar marca via MCP:', error);
      toast({
        title: "Erro ao adicionar marca",
        description: "Ocorreu um erro ao adicionar a marca. Verifique o console.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBrand = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta marca? Isso também removerá todos os produtos associados.")) {
      try {
        setIsLoading(true);
        console.log('Tentando remover marca via MCP:', id);
        
        // SQL para apagar a marca
        const deleteSql = `DELETE FROM brands WHERE id = '${id}' RETURNING id;`;
        
        // @ts-ignore - Ignorar erro de tipos do TypeScript para a função global
        const deleteResult = await mcp_supabase_query({ sql: deleteSql });
        
        if (deleteResult.isError) {
          console.error('Erro ao remover marca:', deleteResult.error);
          toast({
            title: "Erro ao remover marca",
            description: "Não foi possível remover a marca. Erro de permissão do Supabase.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // Atualizar a interface removendo a marca
        setBrands(brands.filter(brand => brand.id !== id));
        
        // Também precisa atualizar a lista de produtos removendo os relacionados à marca
        setProducts(products.filter(product => product.brand_id !== id));
        
        toast({
          title: "Marca removida",
          description: "A marca foi removida com sucesso via MCP.",
        });
        
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Erro ao remover marca via MCP:', error);
        toast({
          title: "Erro ao remover marca",
          description: "Ocorreu um erro ao remover a marca. Verifique o console.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name?.trim()) {
      toast({
        title: "Nome do produto é obrigatório",
        description: "Por favor, insira um nome para o produto.",
        variant: "destructive",
      });
      return;
    }

    if (!newProduct.brand_id) {
      toast({
        title: "Marca é obrigatória",
        description: "Por favor, selecione uma marca para o produto.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      console.log('Tentando adicionar produto via MCP:', newProduct);
      
      // SQL para inserir produto
      const insertSql = `
        INSERT INTO catalog_products (name, description, image, brand_id, created_at, updated_at)
        VALUES (
          '${newProduct.name.trim().replace(/'/g, "''")}',
          '${(newProduct.description || '').replace(/'/g, "''")}',
          '${newProduct.image || 'https://picsum.photos/id/237/300/300'}',
          '${newProduct.brand_id}',
          NOW(),
          NOW()
        )
        RETURNING id, name, description, image, brand_id, created_at;
      `;
      
      // @ts-ignore - Ignorar erro de tipos do TypeScript para a função global
      const insertResult = await mcp_supabase_query({ sql: insertSql });
      
      if (insertResult.isError) {
        console.error('Erro ao adicionar produto:', insertResult.error);
        toast({
          title: "Erro ao adicionar produto",
          description: "Não foi possível adicionar o produto. Erro de permissão do Supabase.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Processar resultado
      const newProductData = insertResult.content && 
                          insertResult.content[0]?.type === 'text' && 
                          JSON.parse(insertResult.content[0].text);
      
      if (newProductData && newProductData.length > 0) {
        // Adicionar o novo produto à lista
        setProducts([...products, newProductData[0]]);
        
        // Limpar formulário
        setNewProduct({
          name: '',
          description: '',
          image: 'https://picsum.photos/id/237/300/300',
          brand_id: ''
        });
        
        setIsAddingProduct(false);
        
        toast({
          title: "Produto adicionado",
          description: "O produto foi adicionado ao catálogo com sucesso via MCP.",
        });
        
        if (onUpdate) onUpdate();
      } else {
        toast({
          title: "Aviso",
          description: "O produto parece ter sido adicionado, mas não foi possível confirmar.",
        });
      }
    } catch (error) {
      console.error('Erro ao adicionar produto via MCP:', error);
      toast({
        title: "Erro ao adicionar produto",
        description: "Ocorreu um erro ao adicionar o produto. Verifique o console.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este produto do catálogo?")) {
      try {
        setIsLoading(true);
        console.log('Tentando remover produto via MCP:', id);
        
        // SQL para apagar o produto
        const deleteSql = `DELETE FROM catalog_products WHERE id = '${id}' RETURNING id;`;
        
        // @ts-ignore - Ignorar erro de tipos do TypeScript para a função global
        const deleteResult = await mcp_supabase_query({ sql: deleteSql });
        
        if (deleteResult.isError) {
          console.error('Erro ao remover produto:', deleteResult.error);
          toast({
            title: "Erro ao remover produto",
            description: "Não foi possível remover o produto. Erro de permissão do Supabase.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        
        // Atualizar a interface removendo o produto
        setProducts(products.filter(product => product.id !== id));
        
        toast({
          title: "Produto removido",
          description: "O produto foi removido do catálogo com sucesso via MCP.",
        });
        
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Erro ao remover produto via MCP:', error);
        toast({
          title: "Erro ao remover produto",
          description: "Ocorreu um erro ao remover o produto. Verifique o console.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleImageUpload = (imageUrl: string) => {
    setNewProduct({
      ...newProduct,
      image: imageUrl
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-store-highlight" />
        <span className="ml-2">Carregando...</span>
      </div>
    );
  }

  if (diagnosticInfo?.brandsCheck?.error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-lg font-medium text-red-800 mb-2">Erro de conexão com o banco de dados</h3>
          <p className="text-sm text-red-600 mb-4">
            Não foi possível conectar à tabela 'brands' no Supabase. Verifique se você criou as tabelas necessárias.
          </p>
          
          <div className="bg-white p-4 rounded border border-red-100 mb-4 text-xs font-mono overflow-auto max-h-40">
            <p>Código do erro: {diagnosticInfo.brandsCheck.error.code}</p>
            <p>Mensagem: {diagnosticInfo.brandsCheck.error.message}</p>
            <p>Detalhes: {diagnosticInfo.brandsCheck.error.details || 'Sem detalhes adicionais'}</p>
            <p>URL do Supabase: {diagnosticInfo.supabaseUrl}</p>
            <p>Chave (parcial): {diagnosticInfo.supabaseKeyFirstChars}</p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-md">
            <h4 className="font-medium text-yellow-800 mb-2">Como resolver:</h4>
            <ol className="list-decimal pl-5 text-sm space-y-2 text-yellow-700">
              <li>Acesse o painel do Supabase em <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">https://app.supabase.com</a></li>
              <li>Selecione seu projeto</li>
              <li>Vá para a seção "SQL Editor"</li>
              <li>Clique em "New Query"</li>
              <li>Cole o SQL para criar as tabelas (disponível no arquivo <code className="bg-gray-100 px-1 py-0.5 rounded">supabase/migrations/create_catalog_fixed.sql</code>)</li>
              <li>Execute o SQL</li>
              <li>Recarregue esta página após criar as tabelas</li>
            </ol>
          </div>
          
          <Button 
            onClick={checkSupabaseConnection}
            className="mt-4"
          >
            Verificar conexão novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Dialog open={isAddingBrand} onOpenChange={setIsAddingBrand}>
          <DialogTrigger asChild>
            <Button className="bg-store-primary hover:bg-store-primary/90">
              <Tag className="mr-2 h-4 w-4" />
              Adicionar Marca
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Marca</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="brand-name">Nome da Marca</Label>
                <Input
                  id="brand-name" 
                  placeholder="Digite o nome da marca"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingBrand(false)}>Cancelar</Button>
              <Button onClick={handleAddBrand}>Adicionar Marca</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
          <DialogTrigger asChild>
            <Button className="bg-store-highlight hover:bg-store-highlight/90">
              <Package className="mr-2 h-4 w-4" />
              Adicionar Produto ao Catálogo
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Adicionar Produto ao Catálogo</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="mb-4">
                <Label htmlFor="product-image" className="block mb-2">Foto do Produto</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                    {newProduct.image && (
                      <img
                        src={newProduct.image}
                        alt="Preview da imagem do produto"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <ImageUpload onUploadComplete={handleImageUpload} />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product-name">Nome do Produto</Label>
                <Input
                  id="product-name" 
                  placeholder="Digite o nome do produto"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product-description">Descrição</Label>
                <Textarea
                  id="product-description"
                  placeholder="Digite a descrição do produto"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="product-brand">Marca</Label>
                <Select 
                  value={newProduct.brand_id} 
                  onValueChange={(value) => setNewProduct({...newProduct, brand_id: value})}
                >
                  <SelectTrigger id="product-brand">
                    <SelectValue placeholder="Selecione uma marca" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.length === 0 ? (
                      <SelectItem value="no-brands" disabled>
                        Nenhuma marca cadastrada
                      </SelectItem>
                    ) : (
                      brands.map(brand => (
                        <SelectItem key={brand.id} value={brand.id}>
                          {brand.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingProduct(false)}>Cancelar</Button>
              <Button onClick={handleAddProduct}>Adicionar Produto</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="brands">Marcas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          {products.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum produto no catálogo</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece adicionando um novo produto ao seu catálogo.
              </p>
              <Button 
                className="mt-4 bg-store-highlight hover:bg-store-highlight/90"
                onClick={() => setIsAddingProduct(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(product => {
                const brand = brands.find(b => b.id === product.brand_id);
                return (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square bg-gray-100 relative">
                      <img 
                        src={product.image || 'https://picsum.photos/id/237/300/300'} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://picsum.photos/id/237/300/300';
                        }}
                      />
                      <button 
                        onClick={() => handleDeleteProduct(product.id)}
                        className="absolute top-2 right-2 p-1 bg-red-50 text-red-600 rounded-full hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-2 h-10 mt-1">
                        {product.description || 'Sem descrição'}
                      </p>
                      {brand && (
                        <div className="mt-2 inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-medium">
                          {brand.name}
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="brands" className="space-y-4">
          {brands.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <Tag className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhuma marca cadastrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece adicionando uma nova marca.
              </p>
              <Button 
                className="mt-4"
                onClick={() => setIsAddingBrand(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Marca
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map(brand => (
                <Card key={brand.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold">{brand.name}</h3>
                    <button 
                      onClick={() => handleDeleteBrand(brand.id)}
                      className="p-1 text-red-600 rounded-full hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {products.filter(p => p.brand_id === brand.id).length} produtos
                  </p>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Catalog; 