import express from 'express';
import pool from '../config/db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Submit contact form (public)
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error submitting contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all contacts (admin)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const [contacts] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete contact (admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM contacts WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await pool.query(
      'INSERT INTO activity_logs (admin_id, activity) VALUES (?, ?)',
      [req.user.id, `Deleted contact message ID ${req.params.id}`]
    );

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
