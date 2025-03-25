'use client';

import { useStore } from '@/context/StoreContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export default function DebugPage() {
  const { settings, isLoading, error, refreshData } = useStore();
  const [supabaseStatus, setSupabaseStatus] = useState<string>('Verificando...');
  const [dbSettings, setDbSettings] = useState<any>(null);
  const [testId, setTestId] = useState<string>('');

  useEffect(() => {
    // Testar conexão com Supabase
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('store_settings').select('count').single();
        
        if (error) {
          setSupabaseStatus(`Erro: ${error.message}`);
        } else {
          setSupabaseStatus('Conectado com sucesso!');
        }
      } catch (e) {
        setSupabaseStatus(`Erro de conexão: ${e}`);
      }
    };

    testConnection();
  }, []);

  const handleRefreshData = () => {
    refreshData();
  };

  const handleFetchDirectly = async () => {
    try {
      const { data, error } = await supabase.from('store_settings').select('*').single();
      
      if (error) {
        console.error('Erro ao buscar configurações diretamente:', error);
        setDbSettings({ error: error.message });
      } else {
        console.log('Configurações encontradas diretamente:', data);
        setDbSettings(data);
      }
    } catch (e) {
      console.error('Erro ao buscar configurações diretamente:', e);
      setDbSettings({ error: String(e) });
    }
  };

  const handleCreateTestSettings = async () => {
    try {
      const testSettings = {
        store_name: 'Naturalys - Teste',
        description: 'Loja de teste',
        store_image: 'https://via.placeholder.com/200x100?text=Logo+Teste',
        whatsapp_number: '',
        instagram_handle: '',
        address: '',
        open_weekdays: false,
        open_saturday: false,
        open_sunday: false,
        weekday_open_time: '',
        weekday_close_time: '',
        saturday_open_time: '',
        saturday_close_time: '',
        sunday_open_time: '',
        sunday_close_time: '',
        logo_url: '',
      };

      const { data, error } = await supabase
        .from('store_settings')
        .insert([testSettings])
        .select()
        .single();
      
      if (error) {
        console.error('Erro ao criar configurações de teste:', error);
        alert(`Erro: ${error.message}`);
      } else {
        console.log('Configurações de teste criadas:', data);
        setTestId(data.id);
        alert('Configurações de teste criadas com sucesso!');
        refreshData();
      }
    } catch (e) {
      console.error('Erro ao criar configurações de teste:', e);
      alert(`Erro: ${e}`);
    }
  };

  const handleUpdateLogo = async () => {
    if (!settings?.id) {
      alert('Nenhuma configuração encontrada para atualizar!');
      return;
    }

    try {
      const { error } = await supabase
        .from('store_settings')
        .update({ 
          store_image: `https://via.placeholder.com/200x100?text=Logo+Atualizado+${Date.now()}` 
        })
        .eq('id', settings.id);
      
      if (error) {
        console.error('Erro ao atualizar imagem da loja:', error);
        alert(`Erro: ${error.message}`);
      } else {
        console.log('Imagem da loja atualizada com sucesso!');
        alert('Imagem da loja atualizada com sucesso!');
        refreshData();
      }
    } catch (e) {
      console.error('Erro ao atualizar imagem da loja:', e);
      alert(`Erro: ${e}`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Página de Diagnóstico</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Status do Contexto</h2>
          <p><strong>Status:</strong> {isLoading ? 'Carregando...' : 'Carregado'}</p>
          <p><strong>Erro:</strong> {error || 'Nenhum'}</p>
          <p><strong>ID das Configurações:</strong> {settings?.id || 'Não encontrado'}</p>
          <p><strong>Nome da Loja:</strong> {settings?.store_name || 'Não encontrado'}</p>
          <p><strong>URL da Imagem da Loja:</strong> {settings?.store_image || 'Não encontrado'}</p>
          
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-4"
            onClick={handleRefreshData}
          >
            Atualizar Dados
          </button>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">Status do Supabase</h2>
          <p><strong>Conexão:</strong> {supabaseStatus}</p>
          
          <button 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4"
            onClick={handleFetchDirectly}
          >
            Buscar Configurações Diretamente
          </button>
          
          {dbSettings && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <h3 className="font-semibold mb-2">Dados do Banco:</h3>
              <pre className="text-xs overflow-auto max-h-40">{JSON.stringify(dbSettings, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Ações de Teste</h2>
        
        <div className="flex flex-wrap gap-4">
          <button 
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded"
            onClick={handleCreateTestSettings}
          >
            Criar Configurações de Teste
          </button>
          
          <button 
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            onClick={handleUpdateLogo}
          >
            Atualizar Logo
          </button>
        </div>
        
        {testId && (
          <p className="mt-4"><strong>ID do Teste Criado:</strong> {testId}</p>
        )}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Visualização da Logo</h2>
        
        {settings?.store_image ? (
          <div className="border p-4 rounded flex flex-col items-center">
            <p className="mb-4">URL da Imagem da Loja: {settings.store_image}</p>
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 flex items-center justify-center p-1 bg-white mb-4">
              <img 
                src={settings.store_image} 
                alt="Logo da Loja" 
                className="w-full h-full object-contain rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/200x100?text=Erro+ao+Carregar";
                }}
              />
            </div>
            <p className="text-sm text-gray-600">
              Esta é a visualização de como o logo aparecerá na página principal
            </p>
          </div>
        ) : (
          <p>Nenhuma imagem de logo definida.</p>
        )}
      </div>
    </div>
  );
} 