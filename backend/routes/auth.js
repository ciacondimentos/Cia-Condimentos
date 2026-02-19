const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function genToken(user){
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}

router.post('/register', async (req, res) => {
  const { name, cpf, phone, email, password } = req.body || {};
  if(!name || !cpf || !phone || !email || !password) return res.status(400).json({ error: 'Missing fields' });
  try{
    const exists = await db.query('select id from users where email=$1', [email]);
    if(exists.rowCount) return res.status(400).json({ error: 'Email already in use' });
    
    const cpfExists = await db.query('select id from users where cpf=$1', [cpf]);
    if(cpfExists.rowCount) return res.status(400).json({ error: 'CPF already registered' });
    
    const hash = await bcrypt.hash(password, 10);
    const result = await db.query('insert into users(name,cpf,phone,email,password_hash) values($1,$2,$3,$4,$5) returning id,name,cpf,phone,email,created_at', [name, cpf, phone, email, hash]);
    const user = result.rows[0];
    const token = genToken(user);
    res.json({ token, user });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if(!email || !password) return res.status(400).json({ error: 'Missing fields' });
  try{
    const result = await db.query('select id,name,email,password_hash from users where email=$1', [email]);
    if(result.rowCount === 0) return res.status(400).json({ error: 'Invalid credentials' });
    const u = result.rows[0];
    const ok = await bcrypt.compare(password, u.password_hash);
    if(!ok) return res.status(400).json({ error: 'Invalid credentials' });
    const token = genToken(u);
    res.json({ token, user: { id: u.id, name: u.name, email: u.email } });
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/me', async (req, res) => {
  const auth = req.headers.authorization || '';
  const token = auth.split(' ')[1];
  if(!token) return res.status(401).json({ error: 'No token' });
  try{
    const payload = jwt.verify(token, JWT_SECRET);
    const result = await db.query('select id,name,email,created_at from users where id=$1', [payload.id]);
    if(result.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: result.rows[0] });
  }catch(err){
    console.error(err);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Listar todos os usuários/clientes
router.get('/users', async (req, res) => {
  try{
    const result = await db.query('select id,name,cpf,phone,email,created_at from users order by created_at desc');
    const customers = result.rows.map(u => ({
      id: u.id,
      name: u.name,
      cpf: u.cpf,
      phone: u.phone,
      email: u.email,
      createdAt: u.created_at
    }));
    res.json(customers);
  }catch(err){
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
