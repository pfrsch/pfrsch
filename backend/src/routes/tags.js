import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Get all tags
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    let sql = 'SELECT * FROM tags';
    const params = [];
    
    if (category) {
      params.push(category);
      sql += ' WHERE category = $1';
    }
    
    sql += ' ORDER BY name';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create tag
router.post('/', async (req, res) => {
  try {
    const { name, category } = req.body;
    
    const result = await query(
      'INSERT INTO tags (name, category) VALUES ($1, $2) RETURNING *',
      [name, category]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Tag already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Search tags by name
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter required' });
    }
    
    const result = await query(
      'SELECT * FROM tags WHERE name ILIKE $1 ORDER BY name LIMIT 20',
      [`%${q}%`]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
