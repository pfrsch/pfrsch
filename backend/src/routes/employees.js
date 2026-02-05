import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Get all employees (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { company_id, tag_id } = req.query;
    
    let sql = `
      SELECT e.*, c.name as company_name,
             array_agg(DISTINCT t.name) as tags
      FROM employees e
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN employee_tags et ON e.id = et.employee_id
      LEFT JOIN tags t ON et.tag_id = t.id
    `;
    
    const conditions = [];
    const params = [];
    
    if (company_id) {
      params.push(company_id);
      conditions.push(`e.company_id = $${params.length}`);
    }
    
    if (tag_id) {
      params.push(tag_id);
      conditions.push(`EXISTS (
        SELECT 1 FROM employee_tags 
        WHERE employee_id = e.id AND tag_id = $${params.length}
      )`);
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    
    sql += ' GROUP BY e.id, c.name ORDER BY e.created_at DESC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employee by ID with availability
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get employee info
    const employeeResult = await query(`
      SELECT e.*, c.name as company_name,
             array_agg(DISTINCT t.name) as tags,
             array_agg(DISTINCT t.id) as tag_ids
      FROM employees e
      LEFT JOIN companies c ON e.company_id = c.id
      LEFT JOIN employee_tags et ON e.id = et.employee_id
      LEFT JOIN tags t ON et.tag_id = t.id
      WHERE e.id = $1
      GROUP BY e.id, c.name
    `, [id]);
    
    if (employeeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    
    // Get availability
    const availabilityResult = await query(
      'SELECT * FROM employee_availability WHERE employee_id = $1 ORDER BY weekday, start_time',
      [id]
    );
    
    const employee = employeeResult.rows[0];
    employee.availability = availabilityResult.rows;
    
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create employee application
router.post('/applications', async (req, res) => {
  try {
    const { company_id, name, email, phone, photo_url, bio, tag_ids } = req.body;
    
    const result = await query(
      `INSERT INTO employee_applications 
       (company_id, name, email, phone, photo_url, bio, tag_ids)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [company_id, name, email, phone, photo_url, bio, tag_ids]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get pending applications for a company
router.get('/applications/company/:company_id', async (req, res) => {
  try {
    const { company_id } = req.params;
    const { status } = req.query;
    
    const result = await query(
      `SELECT * FROM employee_applications 
       WHERE company_id = $1 AND status = $2
       ORDER BY submitted_at DESC`,
      [company_id, status || 'pending']
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve employee application
router.post('/applications/:id/approve', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get application
    const appResult = await query(
      'SELECT * FROM employee_applications WHERE id = $1',
      [id]
    );
    
    if (appResult.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    const app = appResult.rows[0];
    
    // Create employee
    const employeeResult = await query(
      `INSERT INTO employees (company_id, name, photo_url, bio)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [app.company_id, app.name, app.photo_url, app.bio]
    );
    
    const employee = employeeResult.rows[0];
    
    // Add tags
    if (app.tag_ids && app.tag_ids.length > 0) {
      for (const tagId of app.tag_ids) {
        await query(
          'INSERT INTO employee_tags (employee_id, tag_id) VALUES ($1, $2)',
          [employee.id, tagId]
        );
      }
    }
    
    // Update application status
    await query(
      'UPDATE employee_applications SET status = $1, reviewed_at = NOW() WHERE id = $2',
      ['approved', id]
    );
    
    res.json({ employee, message: 'Application approved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject employee application
router.post('/applications/:id/reject', async (req, res) => {
  try {
    const { id } = req.params;
    
    await query(
      'UPDATE employee_applications SET status = $1, reviewed_at = NOW() WHERE id = $2',
      ['rejected', id]
    );
    
    res.json({ message: 'Application rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get employee availability
router.get('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM employee_availability WHERE employee_id = $1 ORDER BY weekday, start_time',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Set employee availability
router.post('/:id/availability', async (req, res) => {
  try {
    const { id } = req.params;
    const { weekday, start_time, end_time } = req.body;
    
    const result = await query(
      `INSERT INTO employee_availability (employee_id, weekday, start_time, end_time)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, weekday, start_time, end_time]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update employee availability
router.delete('/availability/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM employee_availability WHERE id = $1', [id]);
    res.json({ message: 'Availability deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
