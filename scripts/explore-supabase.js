#!/usr/bin/env node

/**
 * Script para explorar o banco de dados Supabase
 * 
 * Uso:
 * 1. Certifique-se de ter o Node.js instalado
 * 2. Execute: node scripts/explore-supabase.js
 */

// Importar e executar o explorador
import('../src/supabase-explorer.js').catch(error => {
  console.error('Erro ao importar o explorador:', error);
  process.exit(1);
}); 