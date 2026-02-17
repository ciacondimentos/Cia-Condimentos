const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const { pool } = require('./db');

async function runMigrations() {
  try {
    console.log('🔄 Rodando migrations...');
    
    const migrationPath = path.join(__dirname, 'migrations', 'create_products.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    await pool.query(sql);
    console.log('✅ Migration executada com sucesso!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao executar migration:', error.message);
    process.exit(1);
  }
}

runMigrations();
