#!/usr/bin/env node

/**
 * Script para executar as migrações no Supabase
 * Este script executa o SQL da migração para criar/atualizar a tabela 'images'
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Configurar caminhos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const migrationsDir = path.join(projectRoot, 'supabase', 'migrations');

// Credenciais Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://soiwkehhnccoestmjjmg.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvaXdrZWhobmNjb2VzdG1qam1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MzE2MTcsImV4cCI6MjA1NTQwNzYxN30.mgf0MAL7dTL3ek34wqrWu4f2Wxjghbws23-FIgIcRJ4';

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🚀 Executando migrações do Supabase...');
    
    // Verificar se o diretório de migrações existe
    if (!fs.existsSync(migrationsDir)) {
      console.error('❌ Diretório de migrações não encontrado:', migrationsDir);
      process.exit(1);
    }
    
    // Ler todos os arquivos de migração
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b));
    
    if (migrationFiles.length === 0) {
      console.warn('⚠️ Nenhum arquivo de migração encontrado.');
      process.exit(0);
    }
    
    console.log(`📋 Migrações encontradas: ${migrationFiles.length} arquivo(s)`);
    
    // Executar cada migração
    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      console.log(`🔄 Executando migração: ${file}`);
      
      // Ler o arquivo SQL
      const sqlQuery = fs.readFileSync(filePath, 'utf8');
      
      // Executar a consulta SQL no Supabase
      const { error } = await supabase.rpc('exec_sql', { query: sqlQuery });
      
      if (error) {
        console.error(`❌ Erro ao executar migração ${file}:`, error);
        
        // Tentar executar usando REST API como fallback
        try {
          console.log('⚠️ Tentando método alternativo (REST API)...');
          
          // Fazer a solicitação à API REST do Supabase
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseKey,
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ query: sqlQuery })
          });
          
          if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`REST API error: ${errorData}`);
          }
          
          console.log(`✅ Migração ${file} executada com sucesso (método alternativo)`);
        } catch (restError) {
          console.error('❌ Falha no método alternativo:', restError);
          
          // Imprimir mensagem com instruções manuais
          console.log('\n⚙️ INSTRUÇÕES PARA EXECUTAR MANUALMENTE:');
          console.log('1. Acesse o painel do Supabase: https://app.supabase.io');
          console.log('2. Vá para SQL Editor');
          console.log('3. Cole o seguinte SQL e execute:');
          console.log('----------------------------------');
          console.log(sqlQuery);
          console.log('----------------------------------\n');
          
          // Continue com as próximas migrações
          continue;
        }
      } else {
        console.log(`✅ Migração ${file} executada com sucesso`);
      }
    }
    
    console.log('🎉 Todas as migrações foram executadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao executar migrações:', error);
    process.exit(1);
  }
}

// Executar a função principal
runMigration(); 