import express from 'express';
import pool from '../config/db.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard statistics (admin only)
router.get('/dashboard', authenticateAdmin, async (req, res) => {
  try {
    // Total orangutans
    const [orangutanCount] = await pool.query('SELECT COUNT(*) as count FROM orangutans');

    // Total users
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');

    // Total donations and amount
    const [donationStats] = await pool.query(
      'SELECT COUNT(*) as count, COALESCE(SUM(amount), 0) as total FROM donations'
    );

    // Total articles
    const [articleCount] = await pool.query('SELECT COUNT(*) as count FROM articles');

    // Total unique donors
    const [donorCount] = await pool.query('SELECT COUNT(DISTINCT user_id) as count FROM donations');

    // Monthly donations for current year
    const [monthlyDonations] = await pool.query(`
      SELECT
        DATE_FORMAT(donated_at, '%Y-%m') as month,
        SUM(amount) as total
      FROM donations
      WHERE YEAR(donated_at) = YEAR(CURDATE())
      GROUP BY DATE_FORMAT(donated_at, '%Y-%m')
      ORDER BY month
    `);

    // Yearly donations
    const [yearlyDonations] = await pool.query(`
      SELECT
        YEAR(donated_at) as year,
        SUM(amount) as total
      FROM donations
      GROUP BY YEAR(donated_at)
      ORDER BY year DESC
      LIMIT 5
    `);

    // Recent donations
    const [recentDonations] = await pool.query(`
      SELECT d.id, d.amount, d.payment_method, d.donated_at, u.full_name
      FROM donations d
      JOIN users u ON d.user_id = u.id
      ORDER BY d.donated_at DESC
      LIMIT 5
    `);

    // Recent users
    const [recentUsers] = await pool.query(`
      SELECT id, full_name, email, badge, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT 5
    `);

    res.json({
      statistics: {
        totalOrangutans: orangutanCount[0].count,
        totalUsers: userCount[0].count,
        totalDonations: donationStats[0].count,
        totalDonationAmount: parseFloat(donationStats[0].total),
        totalArticles: articleCount[0].count,
        totalDonors: donorCount[0].count
      },
      monthlyDonations,
      yearlyDonations,
      recentDonations,
      recentUsers
    });
  } catch (error) {
    console.error('Error fetching admin dashboard:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get activity logs
router.get('/activity-logs', authenticateAdmin, async (req, res) => {
  try {
    const [logs] = await pool.query(`
      SELECT al.*, a.username as admin_name
      FROM activity_logs al
      LEFT JOIN admins a ON al.admin_id = a.id
      ORDER BY al.created_at DESC
      LIMIT 50
    `);

    res.json(logs);
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
