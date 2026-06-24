import express from 'express';
import pool from '../config/db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all orangutans (public)
router.get('/', async (req, res) => {
  try {
    const [orangutans] = await pool.query('SELECT * FROM orangutans ORDER BY name');

    const orangutansWithPhotos = await Promise.all(
      orangutans.map(async (orangutan) => {
        const [photos] = await pool.query(
          'SELECT * FROM orangutan_photos WHERE orangutan_id = ?',
          [orangutan.id]
        );
        return { ...orangutan, photos };
      })
    );

    res.json(orangutansWithPhotos);
  } catch (error) {
    console.error('Error fetching orangutans:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single orangutan
router.get('/:id', async (req, res) => {
  try {
    const [orangutans] = await pool.query('SELECT * FROM orangutans WHERE id = ?', [req.params.id]);

    if (orangutans.length === 0) {
      return res.status(404).json({ message: 'Orangutan not found' });
    }

    const [photos] = await pool.query(
      'SELECT * FROM orangutan_photos WHERE orangutan_id = ?',
      [req.params.id]
    );

    res.json({ ...orangutans[0], photos });
  } catch (error) {
    console.error('Error fetching orangutan:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create orangutan (admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { name, gender, birth_year, age, description } = req.body;

    if (!name || !gender) {
      return res.status(400).json({ message: 'Name and gender are required' });
    }

    const [result] = await pool.query(
      'INSERT INTO orangutans (name, gender, birth_year, age, description) VALUES (?, ?, ?, ?, ?)',
      [name, gender, birth_year || null, age || null, description || null]
    );

    await pool.query(
      'INSERT INTO activity_logs (admin_id, activity) VALUES (?, ?)',
      [req.user.id, `Added new orangutan: ${name}`]
    );

    res.status(201).json({
      message: 'Orangutan added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error creating orangutan:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update orangutan (admin only)
router.put('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { name, gender, birth_year, age, description } = req.body;

    const [orangutans] = await pool.query('SELECT * FROM orangutans WHERE id = ?', [req.params.id]);
    if (orangutans.length === 0) {
      return res.status(404).json({ message: 'Orangutan not found' });
    }

    await pool.query(
      'UPDATE orangutans SET name = ?, gender = ?, birth_year = ?, age = ?, description = ? WHERE id = ?',
      [
        name || orangutans[0].name,
        gender || orangutans[0].gender,
        birth_year !== undefined ? birth_year : orangutans[0].birth_year,
        age !== undefined ? age : orangutans[0].age,
        description !== undefined ? description : orangutans[0].description,
        req.params.id
      ]
    );

    await pool.query(
      'INSERT INTO activity_logs (admin_id, activity) VALUES (?, ?)',
      [req.user.id, `Updated orangutan: ${name || orangutans[0].name}`]
    );

    res.json({ message: 'Orangutan updated successfully' });
  } catch (error) {
    console.error('Error updating orangutan:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete orangutan (admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const [orangutans] = await pool.query('SELECT name FROM orangutans WHERE id = ?', [req.params.id]);

    const [result] = await pool.query('DELETE FROM orangutans WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Orangutan not found' });
    }

    await pool.query(
      'INSERT INTO activity_logs (admin_id, activity) VALUES (?, ?)',
      [req.user.id, `Deleted orangutan: ${orangutans[0]?.name || req.params.id}`]
    );

    res.json({ message: 'Orangutan deleted successfully' });
  } catch (error) {
    console.error('Error deleting orangutan:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add photo to orangutan
router.post('/:id/photos', authenticateAdmin, async (req, res) => {
  try {
    const { image_url } = req.body;

    if (!image_url) {
      return res.status(400).json({ message: 'Image URL is required' });
    }

    const [orangutans] = await pool.query('SELECT * FROM orangutans WHERE id = ?', [req.params.id]);
    if (orangutans.length === 0) {
      return res.status(404).json({ message: 'Orangutan not found' });
    }

    const [result] = await pool.query(
      'INSERT INTO orangutan_photos (orangutan_id, image_url) VALUES (?, ?)',
      [req.params.id, image_url]
    );

    res.status(201).json({
      message: 'Photo added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error('Error adding photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete photo
router.delete('/photos/:photoId', authenticateAdmin, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM orangutan_photos WHERE id = ?', [req.params.photoId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    res.json({ message: 'Photo deleted successfully' });
  } catch (error) {
    console.error('Error deleting photo:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
