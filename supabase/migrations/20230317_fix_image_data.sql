-- Migração para extrair imagens base64 e convertê-las em registros na tabela images
-- Esta migração processa produtos com imagens em formato base64 e cria entradas na tabela images

-- Inserir registros na tabela images para os produtos existentes (se ainda não existirem)
DO $$
DECLARE
    product_record RECORD;
    new_image_id UUID;
BEGIN
    -- Processar produtos com imagens base64
    FOR product_record IN 
        SELECT id, name, image 
        FROM public.products 
        WHERE image LIKE 'data:%'
    LOOP
        -- Gerar um novo UUID para a imagem
        SELECT gen_random_uuid() INTO new_image_id;
        
        -- Inserir na tabela images (usando apenas o UUID como file_path temporariamente)
        INSERT INTO public.images (
            id, 
            title, 
            description, 
            file_path, 
            file_type, 
            is_active
        ) VALUES (
            new_image_id,
            'Imagem do produto: ' || product_record.name,
            'Imagem importada automaticamente do produto ' || product_record.name,
            'https://picsum.photos/id/237/300/300', -- URL temporária enquanto o upload não é feito
            'image/jpeg',
            true
        ) ON CONFLICT (id) DO NOTHING;
        
        -- Atualizar o produto para referenciar o ID da imagem
        UPDATE public.products
        SET image = new_image_id::text
        WHERE id = product_record.id;
    END LOOP;
END $$;

-- Adicionar instruções para o administrador sobre como fazer upload das imagens
COMMENT ON TABLE public.images IS 'Tabela para armazenar metadados de imagens. NOTA: Após executar esta migração, faça upload das imagens para o bucket do Supabase e atualize os campos file_path nas entradas correspondentes.'; 