import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM companies ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM companies WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new company
router.post('/', async (req, res) => {
  try {
    const { name, cnpj, description, logo_url, banner_url, about_html, theme } = req.body;
    
    const result = await query(
      `INSERT INTO companies (name, cnpj, description, logo_url, banner_url, about_html, theme)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [name, cnpj, description, logo_url, banner_url, about_html, JSON.stringify(theme)]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update company
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, cnpj, description, logo_url, banner_url, about_html, theme, custom_domain } = req.body;
    
    const result = await query(
      `UPDATE companies 
       SET name = COALESCE($1, name),
           cnpj = COALESCE($2, cnpj),
           description = COALESCE($3, description),
           logo_url = COALESCE($4, logo_url),
           banner_url = COALESCE($5, banner_url),
           about_html = COALESCE($6, about_html),
           theme = COALESCE($7, theme),
           custom_domain = COALESCE($8, custom_domain),
           updated_at = NOW()
       WHERE id = $9
       RETURNING *`,
      [name, cnpj, description, logo_url, banner_url, about_html, 
       theme ? JSON.stringify(theme) : null, custom_domain, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get company theme/customization
router.get('/:id/theme', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT theme, logo_url, banner_url, custom_domain FROM companies WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
