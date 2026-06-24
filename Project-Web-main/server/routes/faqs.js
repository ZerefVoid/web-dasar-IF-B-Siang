import express from 'express';
import pool from '../config/db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all FAQs (public)
router.get('/', async (req, res) => {
  try {
    const [faqs] = await pool.query('SELECT * FROM faqs ORDER BY id');
    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create FAQ (admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({ message: 'Question and answer are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO faqs (question, answer) VALUES (?, ?)',
      [question, answer]
    );

    await pool.query(
      'INSERT INTO activity_logs (admin_id, activity) VALUES (?, ?)',
      [req.user.id, 'Created new FAQ']
    );

    res.status(201).json({
      message: 'FAQ created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update FAQ (admin)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { question, answer } = req.body;

    const [faqs] = await pool.query('SELECT * FROM faqs WHERE id = ?', [req.params.id]);
    if (faqs.length === 0) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await pool.query(
      'UPDATE faqs SET question = ?, answer = ? WHERE id = ?',
      [
        question || faqs[0].question,
        answer || faqs[0].answer,
        req.params.id
      ]
    );

    await pool.query(
      'INSERT INTO activity_logs (admin_id, activity) VALUES (?, ?)',
      [req.user.id, `Updated FAQ ID ${req.params.id}`]
    );

    res.json({ message: 'FAQ updated successfully' });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete FAQ (admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM faqs WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'FAQ not found' });
    }

    await pool.query(
      'INSERT INTO activity_logs (admin_id, activity) VALUES (?, ?)',
      [req.user.id, `Deleted FAQ ID ${req.params.id}`]
    );

    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Error deleting FAQ:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
