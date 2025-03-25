'use client';

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/context/StoreContext";

export default function LogoUpload() {
  const { settings, refreshData } = useStore();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      
      reader.readAsDataURL(file);

      setUploading(true);
      setUploadSuccess(false);

      // Upload do arquivo para o Storage do Supabase
      const fileExt = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('store-assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obter a URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('store-assets')
        .getPublicUrl(filePath);

      console.log('URL da imagem da loja:', publicUrl);

      // Atualizar a URL da imagem nas configurações da loja
      const { error: updateError } = await supabase
        .from('store_settings')
        .update({ store_image: publicUrl })
        .eq('id', settings?.id);

      if (updateError) {
        throw updateError;
      }

      console.log('Imagem da loja atualizada com sucesso, atualizando contexto...');
      
      // Atualizar o contexto
      await refreshData();
      setUploadSuccess(true);
      console.log('Contexto atualizado!');

    } catch (error) {
      console.error('Erro ao fazer upload da imagem da loja:', error);
      alert('Erro ao fazer upload da imagem. Por favor, tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Logo da Loja</h3>
      
      {(preview || settings?.store_image) && (
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-500 flex items-center justify-center p-1 bg-white">
          <img
            src={preview || settings?.store_image || "/default-logo.png"}
            alt="Logo Preview"
            className="w-full h-full object-contain rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/default-logo.png";
            }}
          />
        </div>
      )}

      {uploadSuccess && (
        <div className="text-green-600 font-medium text-center">
          Logo atualizado com sucesso!
        </div>
      )}

      <div className="text-sm text-gray-600 text-center mb-2">
        Para melhor resultado, use imagens quadradas ou circulares
      </div>

      <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        {uploading ? 'Enviando...' : 'Escolher Logo'}
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </label>
    </div>
  );
} 