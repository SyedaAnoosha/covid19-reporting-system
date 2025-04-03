const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET all records
router.get('/cases', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM covid_cases');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET records by province
router.get('/cases/province/:province', async (req, res) => {
  const { province } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM covid_cases WHERE province = ?', [province]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET records by date range
router.get('/cases/date', async (req, res) => {
  const { start, end } = req.query;
  try {
    const [rows] = await db.query(
      'SELECT * FROM covid_cases WHERE date BETWEEN ? AND ?',
      [start, end]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET summary statistics by province
router.get('/summary/province', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT province,
             SUM(cases) as total_cases,
             SUM(deaths) as total_deaths,
             SUM(recovered) as total_recovered,
             SUM(active_cases) as total_active
      FROM covid_cases
      GROUP BY province
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;