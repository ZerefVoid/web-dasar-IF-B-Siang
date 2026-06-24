import express from 'express';
import pool from '../config/db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all published articles (public)
router.get('/', async (req, res) => {
  try {
    const [articles] = await pool.query(
      "SELECT * FROM articles WHERE status = 'Published' ORDER BY created_at DESC"
    );
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all articles (admin)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const [articles] = await pool.query('SELECT * FROM articles ORDER BY created_at DESC');
    res.json(articles);
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single article
router.get('/:id', async (req, res) => {
  try {
    const [articles] = await pool.query('SELECT * FROM articles WHERE id = ?', [req.params.id]);

    if (articles.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.json(articles[0]);
  } catch (error) {
    console.error('Error fetching article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create article (admin)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { title, category, thumbnail, content, status } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO articles (title, category, thumbnail, content, status) VALUES (?, ?, ?, ?, ?)',
      [title, category || null, thumbnail || null, content, status || 'Published']
    );

    await pool.query(
      'INSERT INTO activity_logs (admin_id, activity) VALUES (?, ?)',
      [req.user.id, `Created article: ${title}`]
    );

    res.status(201).json({
      message: 'Article created successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update article (admin)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { title, category, thumbnail, content, status } = req.body;

    const [articles] = await pool.query('SELECT * FROM articles WHERE id = ?', [req.params.id]);
    if (articles.length === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await pool.query(
      'UPDATE articles SET title = ?, category = ?, thumbnail = ?, content = ?, status = ? WHERE id = ?',
      [
        title || articles[0].title,
        category !== undefined ? category : articles[0].category,
        thumbnail !== undefined ? thumbnail : articles[0].thumbnail,
        content || articles[0].content,
        status || articles[0].status,
        req.params.id
      ]
    );

    await pool.query(
      'INSERT INTO activity_logs (admin_id, activity) VALUES (?, ?)',
      [req.user.id, `Updated article: ${title || articles[0].title}`]
    );

    res.json({ message: 'Article updated successfully' });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete article (admin)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const [articles] = await pool.query('SELECT title FROM articles WHERE id = ?', [req.params.id]);

    const [result] = await pool.query('DELETE FROM articles WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Article not found' });
    }

    await pool.query(
      'INSERT INTO activity_logs (admin_id, activity) VALUES (?, ?)',
      [req.user.id, `Deleted article: ${articles[0]?.title || req.params.id}`]
    );

    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
