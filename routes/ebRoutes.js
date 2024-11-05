const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// Get all chits that need EB approval
router.get('/pending', async (req, res) => {
    const query = `
        SELECT chit_id, sender_id, recipient_id, message, delivered_via, status, timestamp
        FROM chits
        WHERE delivered_via = 'EB' AND status = 'Pending'
        ORDER BY timestamp DESC;
    `;
    const { rows } = await pool.query(query);
    res.json(rows);
});

// Approve a chit
router.post('/approve/:id', async (req, res) => {
    const chitId = req.params.id;

    const query = `
        UPDATE chits
        SET status = 'Approved'
        WHERE chit_id = $1;
    `;
    const values = [chitId];

    try {
        await pool.query(query, values);
        res.json({ message: 'Chit approved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to approve chit' });
    }
});

// Deny a chit
router.post('/deny/:id', async (req, res) => {
    const chitId = req.params.id;

    const query = `
        UPDATE chits
        SET status = 'Denied'
        WHERE chit_id = $1;
    `;
    const values = [chitId];

    try {
        await pool.query(query, values);
        res.json({ message: 'Chit denied successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to deny chit' });
    }
});

module.exports = router;
