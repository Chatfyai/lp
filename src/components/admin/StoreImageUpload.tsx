import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useStore } from "@/context/StoreContext";
import Image from "next/image";

export default function StoreImageUpload() {
  const { settings, refreshData } = useStore();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

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

      // Upload do arquivo para o Storage do Supabase
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `store-images/${fileName}`;

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

      // Atualizar a URL da imagem nas configurações da loja
      const { error: updateError } = await supabase
        .from('store_settings')
        .update({ store_image: publicUrl })
        .eq('id', settings.id);

      if (updateError) {
        throw updateError;
      }

      // Atualizar o contexto
      await refreshData();

    } catch (error) {
      console.error('Erro ao fazer upload da imagem:', error);
      alert('Erro ao fazer upload da imagem. Por favor, tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Imagem da Loja</h3>
      
      {(preview || settings.store_image) && (
        <div className="relative w-32 h-32">
          <Image
            src={preview || settings.store_image}
            alt="Imagem da Loja Preview"
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
        {uploading ? 'Enviando...' : 'Escolher Imagem'}
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