import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const ImageUpload = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');

  const resizeImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          // Definir as dimensões máximas desejadas
          const MAX_WIDTH = 500;
          const MAX_HEIGHT = 500;
          
          let width = img.width;
          let height = img.height;
          
          // Calcular as novas dimensões mantendo a proporção
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }
          
          // Para os produtos, é melhor ter imagens quadradas
          // Vamos verificar se foi especificado para forçar formato quadrado
          if (file.forcedSquare) {
            // Tamanho para o quadrado final
            const size = Math.max(width, height);
            
            // Criar um canvas maior para o formato quadrado
            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;
            
            // Preencher com fundo branco
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);
            
            // Centralizar a imagem no canvas
            const offsetX = (size - width) / 2;
            const offsetY = (size - height) / 2;
            
            // Desenhar a imagem redimensionada no centro
            ctx.drawImage(img, offsetX, offsetY, width, height);
            
            canvas.toBlob((blob) => {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            }, file.type, 0.9);
          } else {
            // Proceder com o redimensionamento normal
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            
            canvas.toBlob((blob) => {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            }, file.type, 0.9);
          }
        };
      };
    });
  };

  const uploadToImgBB = async (file) => {
    try {
      // Criar o formulário para enviar
      const formData = new FormData();
      formData.append('image', file);
      
      // Fazer o upload para o ImgBB (serviço gratuito sem chave de API)
      const response = await fetch('https://imgbb.com/json', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Erro ao fazer upload para o ImgBB');
      }
      
      const data = await response.json();
      
      if (data && data.data && data.data.url) {
        return data.data.url;
      } else {
        throw new Error('URL da imagem não encontrada na resposta');
      }
    } catch (error) {
      console.error('Erro ao fazer upload para o ImgBB:', error);
      throw error;
    }
  };

  const uploadToBase64 = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Retorna a string base64 da imagem
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
    });
  };

  const uploadToFileIO = async (file) => {
    try {
      // Criar o formulário para enviar
      const formData = new FormData();
      formData.append('file', file);
      
      // Fazer o upload para o File.io (serviço sem necessidade de chave)
      const response = await fetch('https://file.io/?expires=1d', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Erro ao fazer upload para o File.io');
      }
      
      const data = await response.json();
      
      if (data && data.success && data.link) {
        return data.link;
      } else {
        throw new Error('URL da imagem não encontrada na resposta');
      }
    } catch (error) {
      console.error('Erro ao fazer upload para o File.io:', error);
      throw error;
    }
  };

  // Após obter a URL pública, vamos assegurar que ela está formatada corretamente
  const getCleanPublicUrl = (publicUrl) => {
    // Verifique se a URL já possui um protocolo (http:// ou https://)
    if (!publicUrl.startsWith('http://') && !publicUrl.startsWith('https://')) {
      // Se não tiver, adicione https://
      return 'https://' + publicUrl;
    }
    return publicUrl;
  };

  // Upload para o Supabase Storage
  const uploadToSupabase = async (file) => {
    console.log('Fazendo upload para o Supabase...');
    
    // Primeiro tenta verificar os buckets disponíveis
    const { data: buckets, error: bucketsError } = await supabase
      .storage
      .listBuckets();
      
    console.log('Buckets disponíveis:', buckets);
    
    // Usar o bucket public ou o primeiro disponível
    let bucketName = 'public';
    if (bucketsError || !buckets.some(b => b.name === 'public')) {
      if (buckets && buckets.length > 0) {
        bucketName = buckets[0].name;
      }
    }
    
    console.log(`Usando bucket "${bucketName}" para upload`);
    
    // Criar um caminho exclusivo para a imagem
    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 10);
    const fileExt = file.name.split('.').pop();
    const uniquePath = `store-images/${timestamp}-${uniqueId}.${fileExt}`;
    
    // Fazer o upload
    const { error: uploadError, data } = await supabase.storage
      .from(bucketName)
      .upload(uniquePath, file, {
        cacheControl: '3600',
        upsert: true,
        contentType: file.type,
      });
      
    if (uploadError) {
      console.error('Erro no upload:', uploadError);
      throw uploadError;
    }
    
    // Verificar se o upload foi bem sucedido
    if (!data || !data.path) {
      throw new Error('Erro ao fazer upload: resposta inválida do servidor');
    }
    
    console.log('Upload concluído:', data);
    
    // Tornar o arquivo público
    await supabase.storage
      .from(bucketName)
      .makePublic(uniquePath);
    
    // Obter a URL pública da imagem
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(uniquePath);
      
    if (!urlData || !urlData.publicUrl) {
      throw new Error('Erro ao obter URL pública da imagem');
    }
    
    console.log('URL pública:', urlData.publicUrl);
    
    // Verificar e corrigir o formato da URL
    const cleanUrl = getCleanPublicUrl(urlData.publicUrl);
    console.log('URL formatada:', cleanUrl);
    
    return cleanUrl;
  };

  const uploadImage = async (event) => {
    try {
      setError(null);
      setUploading(true);
      setProgress(0);
      setUploadStatus('Preparando imagem...');
      
      const file = event.target.files[0];
      if (!file) return;
      
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        setError('O arquivo selecionado não é uma imagem.');
        setUploading(false);
        return;
      }
      
      // Redimensionar a imagem
      setUploadStatus('Redimensionando imagem...');
      console.log('Redimensionando imagem...');
      
      // Para produtos, queremos forçar formato quadrado
      file.forcedSquare = true;
      
      const resizedFile = await resizeImage(file);
      
      // Tentar fazer upload no Supabase
      setUploadStatus('Enviando para o servidor...');
      setProgress(30);
      
      try {
        const publicUrl = await uploadToSupabase(resizedFile);
        setProgress(100);
        
        if (onUploadComplete) {
          onUploadComplete(publicUrl);
        }
        
        setUploading(false);
      } catch (supErr) {
        console.error('Erro no Supabase:', supErr);
        
        // Tentar métodos alternativos de upload
        setUploadStatus('Tentando método alternativo...');
        setProgress(50);
        
        try {
          // Tentar File.io
          const fileIoUrl = await uploadToFileIO(resizedFile);
          console.log('Upload para File.io concluído:', fileIoUrl);
          
          if (onUploadComplete) {
            onUploadComplete(fileIoUrl);
            setProgress(100);
            setUploading(false);
            return;
          }
        } catch (fileErr) {
          console.error('Erro no File.io:', fileErr);
          
          try {
            // Tentar ImgBB
            const imgBbUrl = await uploadToImgBB(resizedFile);
            console.log('Upload para ImgBB concluído:', imgBbUrl);
            
            if (onUploadComplete) {
              onUploadComplete(imgBbUrl);
              setProgress(100);
              setUploading(false);
              return;
            }
          } catch (imgErr) {
            console.error('Erro no ImgBB:', imgErr);
            
            // Último recurso: base64
            try {
              setUploadStatus('Usando método local...');
              const base64String = await uploadToBase64(resizedFile);
              const dataUrl = `data:${file.type};base64,${base64String}`;
              console.log('Usando imagem em base64');
              
              if (onUploadComplete) {
                onUploadComplete(dataUrl);
                setProgress(100);
                setUploading(false);
                return;
              }
            } catch (base64Err) {
              console.error('Erro no base64:', base64Err);
              throw new Error('Falha em todos os métodos de upload de imagem');
            }
          }
        }
      }
      
    } catch (err) {
      console.error('Erro geral no upload:', err);
      setError('Erro ao processar a imagem. Por favor tente novamente.');
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {uploading ? (
            <div className="w-full">
              <div className="text-center mb-2">{uploadStatus} {progress}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-store-highlight h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Clique para carregar</span> ou arraste uma imagem</p>
              <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
            </>
          )}
        </div>
        <input 
          id="file-upload" 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={uploadImage}
          disabled={uploading}
        />
      </label>
      
      {error && (
        <div className="mt-2 p-2 bg-red-50 text-sm text-red-600 rounded-md">
          <p className="font-semibold">Erro:</p>
          <p>{error}</p>
          <p className="mt-1 text-xs">Tente usar uma imagem menor ou em outro formato (JPG, PNG).</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 