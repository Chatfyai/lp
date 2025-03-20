-- Criação da tabela de marcas
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criação da tabela de produtos do catálogo
CREATE TABLE IF NOT EXISTS catalog_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policies para a tabela brands
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso anônimo de leitura para brands" 
ON brands FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Permitir acesso de leitura para usuários autenticados para brands" 
ON brands FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Permitir acesso de inserção para usuários autenticados para brands" 
ON brands FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir acesso de atualização para usuários autenticados para brands" 
ON brands FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Permitir acesso de exclusão para usuários autenticados para brands" 
ON brands FOR DELETE 
TO authenticated
USING (true);

-- Policies para a tabela catalog_products
ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso anônimo de leitura para catalog_products" 
ON catalog_products FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Permitir acesso de leitura para usuários autenticados para catalog_products" 
ON catalog_products FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Permitir acesso de inserção para usuários autenticados para catalog_products" 
ON catalog_products FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Permitir acesso de atualização para usuários autenticados para catalog_products" 
ON catalog_products FOR UPDATE 
TO authenticated
USING (true);

CREATE POLICY "Permitir acesso de exclusão para usuários autenticados para catalog_products" 
ON catalog_products FOR DELETE 
TO authenticated
USING (true);

-- Criar diretório de armazenamento para imagens de produtos do catálogo
INSERT INTO storage.buckets (id, name, public) VALUES ('catalog_products', 'catalog_products', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de armazenamento para permitir acesso público às imagens
CREATE POLICY "Permitir acesso público de leitura para imagens do catálogo" 
ON storage.objects FOR SELECT 
TO anon
USING (bucket_id = 'catalog_products');

CREATE POLICY "Permitir acesso de leitura para usuários autenticados para imagens do catálogo" 
ON storage.objects FOR SELECT 
TO authenticated
USING (bucket_id = 'catalog_products');

CREATE POLICY "Permitir acesso de inserção para usuários autenticados para imagens do catálogo" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'catalog_products');

CREATE POLICY "Permitir acesso de atualização para usuários autenticados para imagens do catálogo" 
ON storage.objects FOR UPDATE 
TO authenticated
USING (bucket_id = 'catalog_products');

CREATE POLICY "Permitir acesso de exclusão para usuários autenticados para imagens do catálogo" 
ON storage.objects FOR DELETE 
TO authenticated
USING (bucket_id = 'catalog_products'); 