// Script para remover os dados mockados do banco de dados
const dotenv = require('dotenv');
dotenv.config();

const db = require('./db');

async function cleanMockData() {
  try {
    console.log('🧹 Iniciando limpeza de dados mockados...\n');
    
    // Listar todos os produtos atuais
    const productsResult = await db.query('SELECT id, name FROM products ORDER BY id');
    console.log('Produtos no banco de dados:');
    productsResult.rows.forEach(p => {
      console.log(`  - ID ${p.id}: ${p.name}`);
    });
    console.log('');
    
    // IDs dos produtos mockados a remover (assumindo que são os primeiros 3)
    // Se os IDs são diferentes, ajuste aqui
    const mockProductNames = ['Pimenta Malagueta', 'Cominho em Pó', 'Sal Marítimo'];
    const productsToDelete = productsResult.rows
      .filter(p => mockProductNames.includes(p.name))
      .map(p => p.id);
    
    if (productsToDelete.length > 0) {
      console.log(`Removendo ${productsToDelete.length} produtos mockados...`);
      for (const id of productsToDelete) {
        await db.query('DELETE FROM products WHERE id = $1', [id]);
        console.log(`  ✓ Produto ID ${id} removido`);
      }
    } else {
      console.log('Nenhum produto mockado encontrado para remover');
    }
    console.log('');
    
    // Listar usuários/clientes
    const usersResult = await db.query('SELECT id, name, email FROM users ORDER BY id');
    console.log('Usuários/Clientes no banco de dados:');
    usersResult.rows.forEach(u => {
      console.log(`  - ID ${u.id}: ${u.name} (${u.email})`);
    });
    console.log('');
    
    // IDs dos clientes mockados a remover
    const mockCustomerEmails = ['joao@email.com', 'maria@email.com', 'pedro@email.com'];
    const customersToDelete = usersResult.rows
      .filter(u => mockCustomerEmails.includes(u.email))
      .map(u => u.id);
    
    if (customersToDelete.length > 0) {
      console.log(`Removendo ${customersToDelete.length} clientes mockados...`);
      for (const id of customersToDelete) {
        await db.query('DELETE FROM users WHERE id = $1', [id]);
        console.log(`  ✓ Cliente ID ${id} removido`);
      }
    } else {
      console.log('Nenhum cliente mockado encontrado para remover');
    }
    console.log('');
    
    // Listar pedidos
    const ordersResult = await db.query('SELECT id, customer_name FROM orders ORDER BY id');
    console.log('Pedidos no banco de dados:');
    ordersResult.rows.forEach(o => {
      console.log(`  - ID ${o.id}: ${o.customer_name}`);
    });
    console.log('');
    
    // IDs dos pedidos mockados a remover
    const mockCustomerNames = ['João Silva', 'Maria Santos', 'Pedro Costa'];
    const ordersToDelete = ordersResult.rows
      .filter(o => mockCustomerNames.includes(o.customer_name))
      .map(o => o.id);
    
    if (ordersToDelete.length > 0) {
      console.log(`Removendo ${ordersToDelete.length} pedidos mockados...`);
      for (const id of ordersToDelete) {
        await db.query('DELETE FROM orders WHERE id = $1', [id]);
        console.log(`  ✓ Pedido ID ${id} removido`);
      }
    } else {
      console.log('Nenhum pedido mockado encontrado para remover');
    }
    console.log('');
    
    console.log('✅ Limpeza concluída!\n');
    
    // Listar dados restantes
    const finalProducts = await db.query('SELECT id, name FROM products ORDER BY id');
    console.log('Produtos restantes:');
    if (finalProducts.rows.length === 0) {
      console.log('  Nenhum produto no banco de dados');
    } else {
      finalProducts.rows.forEach(p => {
        console.log(`  - ID ${p.id}: ${p.name}`);
      });
    }
    console.log('');
    
    const finalUsers = await db.query('SELECT id, name FROM users ORDER BY id');
    console.log('Usuários restantes:');
    if (finalUsers.rows.length === 0) {
      console.log('  Nenhum usuário no banco de dados');
    } else {
      finalUsers.rows.forEach(u => {
        console.log(`  - ID ${u.id}: ${u.name}`);
      });
    }
    console.log('');
    
    const finalOrders = await db.query('SELECT id, customer_name FROM orders ORDER BY id');
    console.log('Pedidos restantes:');
    if (finalOrders.rows.length === 0) {
      console.log('  Nenhum pedido no banco de dados');
    } else {
      finalOrders.rows.forEach(o => {
        console.log(`  - ID ${o.id}: ${o.customer_name}`);
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro durante limpeza:', error);
    process.exit(1);
  }
}

cleanMockData();
