/**
 * Conexão direta com o PostgreSQL do Supabase
 * Este arquivo configura uma conexão direta com o banco de dados PostgreSQL do Supabase
 * usando o pacote pg para Node.js.
 * 
 * ATENÇÃO: Use esta conexão apenas em ambientes seguros como backend ou
 * funções serverless. NUNCA exponha estas credenciais no frontend.
 */

import pg from 'pg';
const { Pool } = pg;

// Configuração da conexão usando a string completa
const connectionString = 'postgresql://postgres.soiwkehhnccoestmjjmg:YSD0wkmJGXPJkYXL@aws-0-us-east-2.pooler.supabase.com:5432/postgres';

// Alternativa: configuração usando parâmetros individuais
const connectionConfig = {
  user: 'postgres.soiwkehhnccoestmjjmg',
  password: 'YSD0wkmJGXPJkYXL',
  host: 'aws-0-us-east-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  ssl: { rejectUnauthorized: false } // Necessário para conexões SSL com Supabase
};

// Criar o pool de conexão
const pool = new Pool({ connectionString });

/**
 * Executa uma consulta SQL no banco de dados
 * @param {string} text - A consulta SQL a ser executada
 * @param {Array} params - Parâmetros para a consulta SQL (opcional)
 * @returns {Promise} - Resultado da consulta
 */
export async function query(text, params) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Consulta executada', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erro na consulta', { text, error });
    throw error;
  }
}

/**
 * Lista todas as tabelas do banco de dados
 * @returns {Promise} - Array com nomes das tabelas
 */
export async function listAllTables() {
  const sql = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    ORDER BY table_name;
  `;
  
  try {
    const result = await query(sql);
    return result.rows.map(row => row.table_name);
  } catch (error) {
    console.error('Erro ao listar tabelas:', error);
    throw error;
  }
}

/**
 * Descreve a estrutura de uma tabela específica
 * @param {string} tableName - Nome da tabela
 * @returns {Promise} - Estrutura detalhada da tabela
 */
export async function describeTable(tableName) {
  const sql = `
    SELECT 
      column_name, 
      data_type, 
      is_nullable,
      column_default
    FROM information_schema.columns 
    WHERE table_name = $1 AND table_schema = 'public'
    ORDER BY ordinal_position;
  `;
  
  try {
    const result = await query(sql, [tableName]);
    return result.rows;
  } catch (error) {
    console.error(`Erro ao descrever tabela ${tableName}:`, error);
    throw error;
  }
}

// Exportar o pool para uso avançado se necessário
export { pool };

// Exemplo de uso:
// import { listAllTables, describeTable, query } from './supabase-direct-connection.js';
//
// async function exampleUsage() {
//   try {
//     // Listar todas as tabelas
//     const tables = await listAllTables();
//     console.log('Tabelas:', tables);
//
//     // Descrever estrutura de uma tabela
//     const productStructure = await describeTable('products');
//     console.log('Estrutura da tabela products:', productStructure);
//
//     // Executar uma consulta personalizada
//     const products = await query('SELECT * FROM products LIMIT 10');
//     console.log('Produtos:', products.rows);
//   } catch (error) {
//     console.error('Erro:', error);
//   }
// } 