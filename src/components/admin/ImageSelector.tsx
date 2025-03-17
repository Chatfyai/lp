import React, { useState, useEffect } from 'react';
import { Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { listImages } from '@/supabase-operations';

interface ImageSelectorProps {
  onSelect: (imageUrl: string) => void;
  buttonText?: string;
}

interface Image {
  id: string;
  title: string;
  file_path: string;
  alt_text?: string;
  tags?: string[];
}

const ImageSelector = ({ onSelect, buttonText = "Selecionar Imagem" }: ImageSelectorProps) => {
  const [open, setOpen] = useState(false);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (open) {
      fetchImages();
    }
  }, [open]);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const imagesData = await listImages();
      if (imagesData) {
        setImages(imagesData);
      } else {
        setImages([]);
      }
    } catch (err) {
      console.error('Erro ao carregar imagens:', err);
      setError('Não foi possível carregar as imagens. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (imageUrl: string) => {
    onSelect(imageUrl);
    setOpen(false);
  };

  // Filtrar imagens pelo título ou tags
  const filteredImages = images.filter(img => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = img.title?.toLowerCase().includes(searchLower);
    
    // Verificar tags, se existirem
    const tagsMatch = Array.isArray(img.tags) && 
      img.tags.some(tag => tag.toLowerCase().includes(searchLower));
    
    return titleMatch || tagsMatch;
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">{buttonText}</Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Selecione uma imagem</DialogTitle>
        </DialogHeader>
        
        <div className="py-2">
          <input
            type="text"
            placeholder="Pesquisar por título ou tag..."
            className="w-full px-3 py-2 border rounded-md mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <Button
                size="sm"
                variant="outline"
                className="ml-2"
                onClick={fetchImages}
              >
                Tentar novamente
              </Button>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Carregando imagens...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              {searchTerm ? (
                <p>Nenhuma imagem encontrada para "{searchTerm}"</p>
              ) : (
                <p>Nenhuma imagem encontrada. Adicione imagens no gerenciador de imagens.</p>
              )}
            </div>
          ) : (
            <ScrollArea className="h-[400px] rounded-md">
              <div className="grid grid-cols-3 gap-4 p-1">
                {filteredImages.map(image => (
                  <div 
                    key={image.id} 
                    className="relative aspect-square bg-gray-100 rounded-md overflow-hidden border border-gray-200 hover:border-blue-400 cursor-pointer transition-all"
                    onClick={() => handleSelect(image.file_path)}
                  >
                    <img
                      src={image.file_path}
                      alt={image.alt_text || image.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 p-2">
                      <p className="text-white text-xs truncate">{image.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageSelector; 