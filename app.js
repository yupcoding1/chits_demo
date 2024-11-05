const express = require('express');
const authRoutes = require('./routes/auth');
const chitRoutes = require('./routes/chitRoutes');
const ebRoutes = require('./routes/ebRoutes');
const delegateRoutes = require('./routes/delegateRoutes');
const { authenticateToken, requireRole } = require('./middleware/authMiddleware');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/chits', authenticateToken, chitRoutes);
app.use('/api/eb', authenticateToken, requireRole('EB'), ebRoutes);
app.use('/api/delegate', authenticateToken, requireRole('Delegate'), delegateRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
