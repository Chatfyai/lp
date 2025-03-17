import React, { useState, useEffect } from 'react';
import { 
  listImages, 
  createImage, 
  updateImage, 
  deleteImage 
} from '@/supabase-operations';
import { supabase } from '@/integrations/supabase/client';

const ImageManager = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    alt_text: '',
    tags: '',
  });

  // Carregar imagens quando o componente montar
  useEffect(() => {
    fetchImages();
  }, []);

  // Buscar todas as imagens
  const fetchImages = async () => {
    setLoading(true);
    try {
      const imagesData = await listImages();
      if (imagesData) {
        setImages(imagesData);
      }
    } catch (err) {
      setError('Erro ao carregar imagens: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Manipular mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manipular seleção de arquivo
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Manipular envio de formulário
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Selecione um arquivo para upload');
      return;
    }
    
    setLoading(true);
    setUploadProgress(0);
    setError(null);
    
    try {
      // 1. Fazer upload do arquivo para o bucket do Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `public/images/${fileName}`;
      
      // Upload do arquivo para o Storage do Supabase
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false,
          onUploadProgress: (progress) => {
            const percent = Math.round((progress.loaded / progress.total) * 100);
            setUploadProgress(percent);
          }
        });
      
      if (uploadError) {
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }
      
      // 2. Obter URL pública do arquivo
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);
      
      // 3. Salvar informações da imagem no banco de dados
      const tags = formData.tags.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');
      
      const imageData = {
        title: formData.title,
        description: formData.description,
        file_path: publicUrl,
        file_type: selectedFile.type,
        file_size: selectedFile.size,
        alt_text: formData.alt_text,
        tags: tags,
      };
      
      const newImage = await createImage(imageData);
      
      if (newImage) {
        setImages([newImage, ...images]);
        
        // Limpar formulário
        setFormData({
          title: '',
          description: '',
          alt_text: '',
          tags: '',
        });
        setSelectedFile(null);
        
        // Resetar input de arquivo
        const fileInput = document.getElementById('image-file');
        if (fileInput) fileInput.value = '';
      }
    } catch (err) {
      setError('Erro ao enviar imagem: ' + err.message);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };
  
  // Manipular exclusão de imagem
  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta imagem?')) {
      setLoading(true);
      try {
        await deleteImage(id);
        setImages(images.filter(img => img.id !== id));
      } catch (err) {
        setError('Erro ao excluir imagem: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Gerenciador de Imagens</h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulário de Upload */}
        <div className="md:col-span-1 bg-white p-5 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Adicionar Nova Imagem</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Descrição</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                rows="3"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Texto Alternativo</label>
              <input
                type="text"
                name="alt_text"
                value={formData.alt_text}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Tags (separadas por vírgula)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="ex: banner, produto, destaque"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Arquivo</label>
              <input
                id="image-file"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full"
                required
              />
            </div>
            
            {uploadProgress > 0 && (
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {uploadProgress}% concluído
                </p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? 'Enviando...' : 'Enviar Imagem'}
            </button>
          </form>
        </div>
        
        {/* Lista de Imagens */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Imagens Disponíveis</h3>
          
          {loading && images.length === 0 ? (
            <div className="text-center py-8">
              <p>Carregando imagens...</p>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <p>Nenhuma imagem encontrada</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map(image => (
                <div key={image.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={image.file_path}
                      alt={image.alt_text || image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="mt-1 text-sm truncate">{image.title}</div>
                  
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all rounded-lg">
                    <button 
                      onClick={() => handleDelete(image.id)}
                      className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageManager; 