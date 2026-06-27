require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// ── Middleware ───────────────────────────────────────────────────────────────
// Allow requests from the React dev server (port 5173)
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Parse incoming JSON bodies
app.use(express.json());

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Health check — useful for quickly verifying the server is alive
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'ExpTracker API is running' });
});

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler ─────────────────────────────────────────────────────
// Any error passed via next(err) lands here instead of crashing the server
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
  });
});

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
