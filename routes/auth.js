const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post('/login', async (req, res) => {
    const { country, committee, password } = req.body;
    const userQuery = `
        SELECT u.user_id, u.password, u.role
        FROM users u
        JOIN countries c ON u.country_id = c.country_id
        JOIN committees cm ON u.committee_id = cm.committee_id
        WHERE c.name = $1 AND cm.name = $2;
    `;
    const values = [country, committee];

    const { rows } = await pool.query(userQuery, values);
    if (!rows.length) return res.status(401).send('User not found');

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).send('Incorrect password');

    const token = jwt.sign({ userId: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role });
});

module.exports = router;
