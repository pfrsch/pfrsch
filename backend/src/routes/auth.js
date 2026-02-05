import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, company_id } = req.body;
    
    // Hash password
    const password_hash = await bcrypt.hash(password, 10);
    
    const result = await query(
      'INSERT INTO users (email, password_hash, role, company_id) VALUES ($1, $2, $3, $4) RETURNING id, email, role',
      [email, password_hash, role || 'employee', company_id]
    );
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: result.rows[0].id, role: result.rows[0].role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.status(201).json({
      user: result.rows[0],
      token
    });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        company_id: user.company_id
      },
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
