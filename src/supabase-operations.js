// Arquivo temporário para testar operações no Supabase
import { supabase } from './integrations/supabase/client';

// Função para listar as tabelas
export async function listTables() {
  try {
    // Esta query retorna todas as tabelas do schema público
    const { data, error } = await supabase
      .from('pg_catalog.pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (error) {
      console.error('Erro ao listar tabelas:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Erro:', err);
    return null;
  }
}

// Função para listar registros de uma tabela
export async function listRecords(tableName) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) {
      console.error(`Erro ao listar registros da tabela ${tableName}:`, error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Erro:', err);
    return null;
  }
}

// Função para atualizar um registro
export async function updateRecord(tableName, id, updateData) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Erro ao atualizar registro na tabela ${tableName}:`, error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Erro:', err);
    return null;
  }
}

// Função para criar um novo registro
export async function insertRecord(tableName, recordData) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .insert(recordData)
      .select();

    if (error) {
      console.error(`Erro ao inserir registro na tabela ${tableName}:`, error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Erro:', err);
    return null;
  }
}

// Função para deletar um registro
export async function deleteRecord(tableName, id) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error(`Erro ao deletar registro na tabela ${tableName}:`, error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Erro:', err);
    return null;
  }
}

// ----- FUNÇÕES ESPECÍFICAS PARA A TABELA DE IMAGENS -----

// Função para listar todas as imagens
export async function listImages(options = {}) {
  try {
    const { limit = 100, offset = 0, isActive = true, tags = null } = options;
    
    let query = supabase
      .from('images')
      .select('*')
      .eq('is_active', isActive)
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1);
      
    // Filtrar por tags se fornecido
    if (tags && Array.isArray(tags) && tags.length > 0) {
      query = query.contains('tags', tags);
    }
    
    const { data, error } = await query;

    if (error) {
      console.error('Erro ao listar imagens:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Erro:', err);
    return null;
  }
}

// Função para obter uma imagem por ID
export async function getImageById(id) {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Erro ao obter imagem:', error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error('Erro:', err);
    return null;
  }
}

// Função para criar uma nova imagem
export async function createImage(imageData) {
  try {
    const { data, error } = await supabase
      .from('images')
      .insert(imageData)
      .select();

    if (error) {
      console.error('Erro ao criar imagem:', error);
      return null;
    }
    
    return data[0];
  } catch (err) {
    console.error('Erro:', err);
    return null;
  }
}

// Função para atualizar uma imagem
export async function updateImage(id, updateData) {
  try {
    const { data, error } = await supabase
      .from('images')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao atualizar imagem:', error);
      return null;
    }
    
    return data[0];
  } catch (err) {
    console.error('Erro:', err);
    return null;
  }
}

// Função para excluir uma imagem
export async function deleteImage(id) {
  try {
    const { data, error } = await supabase
      .from('images')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Erro ao excluir imagem:', error);
      return null;
    }
    
    return data[0];
  } catch (err) {
    console.error('Erro:', err);
    return null;
  }
} 