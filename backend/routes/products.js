const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products (public - for client site)
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products WHERE active = true ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET all products including inactive (admin only)
router.get('/admin/all', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// POST create product (admin)
router.post('/', async (req, res) => {
  try {
    const { name, category, price, stock, description, image, barcode, sku, weight, origin, brand, expiry, active } = req.body;

    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await db.query(
      `INSERT INTO products (name, category, price, stock, description, image, barcode, sku, weight, origin, brand, expiry, active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [name, category || null, price, stock, description || '', image || '', barcode || '', sku || '', weight || '', origin || '', brand || 'Cia. Condimentos e Especiarias', expiry || '', active !== false]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT update product (admin)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, description, image, barcode, sku, weight, origin, brand, expiry, active } = req.body;

    const result = await db.query(
      `UPDATE products 
       SET name = COALESCE($1, name),
           category = COALESCE($2, category),
           price = COALESCE($3, price),
           stock = COALESCE($4, stock),
           description = COALESCE($5, description),
           image = COALESCE($6, image),
           barcode = COALESCE($7, barcode),
           sku = COALESCE($8, sku),
           weight = COALESCE($9, weight),
           origin = COALESCE($10, origin),
           brand = COALESCE($11, brand),
           expiry = COALESCE($12, expiry),
           active = COALESCE($13, active)
       WHERE id = $14
       RETURNING *`,
      [name, category, price, stock, description, image, barcode, sku, weight, origin, brand, expiry, active, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE product (admin)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ message: 'Product deleted', product: result.rows[0] });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;
