import express from 'express';
import pool from '../config/db.js';
import { authenticateToken, authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Create donation (simulated payment)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { amount, payment_method } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Valid amount is required' });
    }

    if (!payment_method) {
      return res.status(400).json({ message: 'Payment method is required' });
    }

    const validMethods = ['BCA', 'BNI', 'BRI', 'Mandiri', 'Dana', 'OVO', 'GoPay', 'QRIS'];
    if (!validMethods.includes(payment_method)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    // Simulate payment - always success
    const [result] = await pool.query(
      'INSERT INTO donations (user_id, amount, payment_method, status) VALUES (?, ?, ?, ?)',
      [userId, amount, payment_method, 'Success']
    );

    // Update user badge based on total donations
    const [totalResult] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM donations WHERE user_id = ?',
      [userId]
    );

    const totalDonations = parseFloat(totalResult[0].total) || 0;
    let newBadge = 'Friend of Orangutans';

    if (totalDonations >= 1000000) {
      newBadge = 'Rainforest Guardian';
    } else if (totalDonations >= 500000) {
      newBadge = 'Orangutan Protector';
    }

    await pool.query('UPDATE users SET badge = ? WHERE id = ?', [newBadge, userId]);

    res.status(201).json({
      message: 'Donation successful',
      donation: {
        id: result.insertId,
        amount,
        payment_method,
        status: 'Success'
      },
      newBadge: newBadge !== req.user.badge ? newBadge : null
    });
  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's donation history
router.get('/my-donations', authenticateToken, async (req, res) => {
  try {
    const [donations] = await pool.query(
      'SELECT * FROM donations WHERE user_id = ? ORDER BY donated_at DESC',
      [req.user.id]
    );

    res.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's donation statistics
router.get('/my-stats', authenticateToken, async (req, res) => {
  try {
    const [stats] = await pool.query(
      `SELECT
        COUNT(*) as total_donations,
        COALESCE(SUM(amount), 0) as total_amount,
        MIN(donated_at) as first_donation,
        MAX(donated_at) as last_donation
      FROM donations WHERE user_id = ?`,
      [req.user.id]
    );

    const [monthlyStats] = await pool.query(
      `SELECT
        DATE_FORMAT(donated_at, '%Y-%m') as month,
        SUM(amount) as total
      FROM donations
      WHERE user_id = ?
      GROUP BY DATE_FORMAT(donated_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12`,
      [req.user.id]
    );

    res.json({
      ...stats[0],
      monthly: monthlyStats
    });
  } catch (error) {
    console.error('Error fetching donation stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all donations (admin only)
router.get('/all', authenticateAdmin, async (req, res) => {
  try {
    const [donations] = await pool.query(`
      SELECT d.*, u.full_name, u.email
      FROM donations d
      JOIN users u ON d.user_id = u.id
      ORDER BY d.donated_at DESC
    `);

    res.json(donations);
  } catch (error) {
    console.error('Error fetching all donations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get donation statistics (public)
router.get('/statistics', async (req, res) => {
  try {
    const [totalResult] = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total, COUNT(*) as count FROM donations'
    );

    const [monthlyStats] = await pool.query(`
      SELECT
        DATE_FORMAT(donated_at, '%Y-%m') as month,
        SUM(amount) as total,
        COUNT(*) as count
      FROM donations
      GROUP BY DATE_FORMAT(donated_at, '%Y-%m')
      ORDER BY month DESC
      LIMIT 12
    `);

    const [yearlyStats] = await pool.query(`
      SELECT
        YEAR(donated_at) as year,
        SUM(amount) as total,
        COUNT(*) as count
      FROM donations
      GROUP BY YEAR(donated_at)
      ORDER BY year DESC
    `);

    const [paymentMethodStats] = await pool.query(`
      SELECT
        payment_method,
        COUNT(*) as count,
        SUM(amount) as total
      FROM donations
      GROUP BY payment_method
      ORDER BY total DESC
    `);

    res.json({
      total: totalResult[0],
      monthly: monthlyStats,
      yearly: yearlyStats,
      byPaymentMethod: paymentMethodStats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
