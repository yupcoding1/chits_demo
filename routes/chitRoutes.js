const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// Get all chits for a user
router.get('/', async (req, res) => {
 nst query = `
        SELECT chit_id, sender_id, recipient_id, message, delivered_via, status, timestamp
        FROM chits
        WHERE sender_id = $1 OR recipient_id = $1
        ORDER BY timestamp DESC;   const userId = req.user.userId; // Get user ID from JWT token
    co
    `;
    const { rows } = await pool.query(query, [userId]);
    res.json(rows);
});

// Send a chit
router.post('/', async (req, res) => {
    const { recipientId, message, deliveredVia } = req.body;
    const senderId = req.user.userId; // Get sender ID from JWT token

    const query = `
        INSERT INTO chits (sender_id, recipient_id, message, delivered_via, status)
        VALUES ($1, $2, $3, $4, 'Pending')
        RETURNING chit_id;
    `;
    const values = [senderId, recipientId, message, deliveredVia];

    try {
        const { rows } = await pool.query(query, values);
        res.status(201).json({ chitId: rows[0].chit_id, status: 'Chit sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send chit' });
    }
});

module.exports = router;
