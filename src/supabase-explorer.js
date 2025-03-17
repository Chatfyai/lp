/**
 * Explorador de banco de dados Supabase
 * Use este script para explorar as tabelas e dados do seu banco Supabase
 * 
 * ATENÇÃO: Execute este script apenas em ambiente de desenvolvimento!
 */

import { listAllTables, describeTable, query } from './supabase-direct-connection.js';

// Função principal
async function exploreDatabase() {
  try {
    console.log('=== EXPLORADOR DE BANCO DE DADOS SUPABASE ===');
    
    // Listar todas as tabelas
    console.log('\n📋 TABELAS DISPONÍVEIS:');
    const tables = await listAllTables();
    
    if (tables.length === 0) {
      console.log('Nenhuma tabela encontrada no banco de dados.');
      return;
    }
    
    tables.forEach((table, index) => {
      console.log(`${index + 1}. ${table}`);
    });
    
    // Explorar cada tabela
    for (const table of tables) {
      await exploreTable(table);
    }
    
    console.log('\n✅ Exploração concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao explorar banco de dados:', error);
  }
}

// Explorar uma tabela específica
async function exploreTable(tableName) {
  try {
    console.log(`\n🔍 EXPLORANDO TABELA: ${tableName}`);
    
    // Obter estrutura da tabela
    console.log('\nEstrutura:');
    const structure = await describeTable(tableName);
    
    // Exibir colunas em formato de tabela
    console.table(structure);
    
    // Contar registros
    const countResult = await query(`SELECT COUNT(*) FROM ${tableName}`);
    const totalRows = parseInt(countResult.rows[0].count);
    console.log(`\nTotal de registros: ${totalRows}`);
    
    // Mostrar amostra de dados (primeiros 5 registros)
    if (totalRows > 0) {
      console.log('\nAmostra de dados (primeiros 5 registros):');
      const sampleData = await query(`SELECT * FROM ${tableName} LIMIT 5`);
      console.table(sampleData.rows);
    }
    
  } catch (error) {
    console.error(`Erro ao explorar tabela ${tableName}:`, error);
  }
}

// Executar o explorador
exploreDatabase().catch(error => {
  console.error('Erro fatal:', error);
  process.exit(1);
}); 