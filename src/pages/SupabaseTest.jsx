import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const SupabaseTest = () => {
  const [mainButtons, setMainButtons] = useState([]);
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      // Buscar botões
      const { data: buttonsData, error: buttonsError } = await supabase
        .from('main_buttons')
        .select('*')
        .order('order_index', { ascending: true });

      if (buttonsError) {
        console.error("Erro ao buscar botões:", buttonsError);
        throw new Error("Não foi possível carregar os botões principais");
      }
      
      // Buscar produtos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('order_index', { ascending: true });

      if (productsError) {
        console.error("Erro ao buscar produtos:", productsError);
        throw new Error("Não foi possível carregar os produtos");
      }
      
      // Buscar configurações
      const { data: settingsData, error: settingsError } = await supabase
        .from('store_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (settingsError) {
        console.error("Erro ao buscar configurações:", settingsError);
        throw new Error("Não foi possível carregar as configurações da loja");
      }

      console.log("Dados dos botões:", buttonsData);
      console.log("Dados dos produtos:", productsData);
      console.log("Dados das configurações:", settingsData);
      
      setMainButtons(buttonsData || []);
      setProducts(productsData || []);
      setSettings(settingsData);
      setIsLoading(false);
      
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err instanceof Error ? err.message : "Erro ao carregar dados");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">Teste de Acesso ao Supabase</h1>
      
      {isLoading ? (
        <div className="text-gray-600">Carregando dados...</div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded-md text-red-700">
          <p className="font-bold">Erro:</p>
          <p>{error}</p>
          <button 
            className="mt-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            onClick={fetchData}
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-bold mb-4">Configurações da Loja</h2>
            {settings ? (
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                {JSON.stringify(settings, null, 2)}
              </pre>
            ) : (
              <p>Nenhuma configuração encontrada</p>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Botões Principais</h2>
            {mainButtons.length > 0 ? (
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                {JSON.stringify(mainButtons, null, 2)}
              </pre>
            ) : (
              <p>Nenhum botão encontrado</p>
            )}
          </div>
          
          <div>
            <h2 className="text-xl font-bold mb-4">Produtos</h2>
            {products.length > 0 ? (
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto max-h-60">
                {JSON.stringify(products, null, 2)}
              </pre>
            ) : (
              <p>Nenhum produto encontrado</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SupabaseTest; 