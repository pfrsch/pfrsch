import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Get appointments (with filters)
router.get('/', async (req, res) => {
  try {
    const { employee_id, status, start_date, end_date } = req.query;
    
    let sql = `
      SELECT a.*, e.name as employee_name, c.name as company_name
      FROM appointments a
      LEFT JOIN employees e ON a.employee_id = e.id
      LEFT JOIN companies c ON e.company_id = c.id
      WHERE 1=1
    `;
    
    const params = [];
    
    if (employee_id) {
      params.push(employee_id);
      sql += ` AND a.employee_id = $${params.length}`;
    }
    
    if (status) {
      params.push(status);
      sql += ` AND a.status = $${params.length}`;
    }
    
    if (start_date) {
      params.push(start_date);
      sql += ` AND a.start_timestamp >= $${params.length}`;
    }
    
    if (end_date) {
      params.push(end_date);
      sql += ` AND a.start_timestamp <= $${params.length}`;
    }
    
    sql += ' ORDER BY a.start_timestamp ASC';
    
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get appointment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(`
      SELECT a.*, e.name as employee_name, c.name as company_name
      FROM appointments a
      LEFT JOIN employees e ON a.employee_id = e.id
      LEFT JOIN companies c ON e.company_id = c.id
      WHERE a.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create appointment
router.post('/', async (req, res) => {
  try {
    const {
      employee_id,
      client_name,
      client_email,
      client_phone,
      start_timestamp,
      end_timestamp,
      description
    } = req.body;
    
    // Check for conflicts
    const conflictCheck = await query(
      `SELECT id FROM appointments 
       WHERE employee_id = $1 
       AND status != 'cancelled'
       AND (
         (start_timestamp <= $2 AND end_timestamp > $2)
         OR (start_timestamp < $3 AND end_timestamp >= $3)
         OR (start_timestamp >= $2 AND end_timestamp <= $3)
       )`,
      [employee_id, start_timestamp, end_timestamp]
    );
    
    if (conflictCheck.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Time slot not available',
        conflicting_appointment_id: conflictCheck.rows[0].id
      });
    }
    
    const result = await query(
      `INSERT INTO appointments 
       (employee_id, client_name, client_email, client_phone, 
        start_timestamp, end_timestamp, description, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [employee_id, client_name, client_email, client_phone,
       start_timestamp, end_timestamp, description, 'pending']
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update appointment status
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    
    const result = await query(
      'UPDATE appointments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available slots for an employee on a specific date
router.get('/employee/:employee_id/available-slots', async (req, res) => {
  try {
    const { employee_id } = req.params;
    const { date } = req.query; // YYYY-MM-DD format
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter required' });
    }
    
    const dateObj = new Date(date);
    const weekday = dateObj.getDay();
    
    // Get availability for this weekday
    const availabilityResult = await query(
      'SELECT * FROM employee_availability WHERE employee_id = $1 AND weekday = $2',
      [employee_id, weekday]
    );
    
    if (availabilityResult.rows.length === 0) {
      return res.json({ available_slots: [] });
    }
    
    // Get existing appointments for this date
    const appointmentsResult = await query(
      `SELECT start_timestamp, end_timestamp FROM appointments
       WHERE employee_id = $1 
       AND DATE(start_timestamp) = $2
       AND status != 'cancelled'
       ORDER BY start_timestamp`,
      [employee_id, date]
    );
    
    res.json({
      availability: availabilityResult.rows,
      appointments: appointmentsResult.rows,
      date: date
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
