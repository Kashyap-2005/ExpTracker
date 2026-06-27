const mongoose = require('mongoose');
const Expense = require('../models/Expense');

// ── GET /api/expenses ─────────────────────────────────────────────────────────
// Returns all expenses for the logged-in user.
// Optional query params: ?month=2024-06  ?category=Food
const getExpenses = async (req, res) => {
  try {
    const filter = { user: req.user.id };

    // Filter by month (e.g. ?month=2024-06)
    if (req.query.month) {
      const [year, month] = req.query.month.split('-').map(Number);
      filter.date = {
        $gte: new Date(year, month - 1, 1),
        $lt:  new Date(year, month, 1),
      };
    }

    // Filter by category (e.g. ?category=Food)
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const expenses = await Expense.find(filter).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('getExpenses error:', error.message);
    res.status(500).json({ message: 'Failed to fetch expenses' });
  }
};

// ── POST /api/expenses ────────────────────────────────────────────────────────
const addExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({ message: 'Title, amount, and category are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const expense = await Expense.create({
      user: req.user.id,
      title: title.trim(),
      amount,
      category,
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json(expense);
  } catch (error) {
    console.error('addExpense error:', error.message);
    // Mongoose validation errors (e.g. bad category enum)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(error.errors)[0].message });
    }
    res.status(500).json({ message: 'Failed to add expense' });
  }
};

// ── PUT /api/expenses/:id ─────────────────────────────────────────────────────
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure the expense belongs to the requesting user
    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this expense' });
    }

    const { title, amount, category, date } = req.body;

    expense.title    = title?.trim()    ?? expense.title;
    expense.amount   = amount           ?? expense.amount;
    expense.category = category         ?? expense.category;
    expense.date     = date ? new Date(date) : expense.date;

    const updated = await expense.save();
    res.json(updated);
  } catch (error) {
    console.error('updateExpense error:', error.message);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(error.errors)[0].message });
    }
    res.status(500).json({ message: 'Failed to update expense' });
  }
};

// ── DELETE /api/expenses/:id ──────────────────────────────────────────────────
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this expense' });
    }

    await expense.deleteOne();
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    console.error('deleteExpense error:', error.message);
    res.status(500).json({ message: 'Failed to delete expense' });
  }
};

// ── GET /api/expenses/stats ───────────────────────────────────────────────────
// Aggregated data for the dashboard — total this month + per-category breakdown
const getStats = async (req, res) => {
  try {
    const now   = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end   = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const stats = await Expense.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user.id),
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalThisMonth = stats.reduce((sum, s) => sum + s.total, 0);

    res.json({ totalThisMonth, breakdown: stats });
  } catch (error) {
    console.error('getStats error:', error.message);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
};

// ── GET /api/expenses/recent ─────────────────────────────────────────────────
// Returns the 5 most recent expenses — used by the Dashboard preview
const getRecent = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id })
      .sort({ date: -1 })
      .limit(5);
    res.json(expenses);
  } catch (error) {
    console.error('getRecent error:', error.message);
    res.status(500).json({ message: 'Failed to fetch recent expenses' });
  }
};

module.exports = { getExpenses, addExpense, updateExpense, deleteExpense, getStats, getRecent };
