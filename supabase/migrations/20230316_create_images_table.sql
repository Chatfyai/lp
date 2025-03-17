-- Criação da tabela 'images' para armazenar imagens
CREATE TABLE IF NOT EXISTS public.images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    width INTEGER,
    height INTEGER,
    alt_text VARCHAR(255),
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar comentários para documentação da tabela
COMMENT ON TABLE public.images IS 'Tabela para armazenar metadados de imagens';
COMMENT ON COLUMN public.images.id IS 'Identificador único da imagem';
COMMENT ON COLUMN public.images.title IS 'Título da imagem';
COMMENT ON COLUMN public.images.description IS 'Descrição detalhada da imagem';
COMMENT ON COLUMN public.images.file_path IS 'Caminho do arquivo no bucket de armazenamento';
COMMENT ON COLUMN public.images.file_type IS 'Tipo de arquivo da imagem (MIME type)';
COMMENT ON COLUMN public.images.file_size IS 'Tamanho do arquivo em bytes';
COMMENT ON COLUMN public.images.width IS 'Largura da imagem em pixels';
COMMENT ON COLUMN public.images.height IS 'Altura da imagem em pixels';
COMMENT ON COLUMN public.images.alt_text IS 'Texto alternativo para acessibilidade';
COMMENT ON COLUMN public.images.tags IS 'Array de tags para categorizar a imagem';
COMMENT ON COLUMN public.images.is_active IS 'Flag para indicar se a imagem está ativa';
COMMENT ON COLUMN public.images.created_at IS 'Data de criação do registro';
COMMENT ON COLUMN public.images.updated_at IS 'Data da última atualização do registro';

-- Criar índices para melhorar a performance de consultas comuns
CREATE INDEX IF NOT EXISTS idx_images_title ON public.images (title);
CREATE INDEX IF NOT EXISTS idx_images_created_at ON public.images (created_at);
CREATE INDEX IF NOT EXISTS idx_images_is_active ON public.images (is_active);

-- Trigger para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON public.images
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp(); 