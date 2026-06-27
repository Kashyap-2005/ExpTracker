const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
  getStats,
  getRecent,
} = require('../controllers/expenseController');

// All expense routes are protected — user must be logged in
router.get('/stats',  protect, getStats);    // must come before /:id
router.get('/recent', protect, getRecent);   // must come before /:id
router.get('/',       protect, getExpenses);
router.post('/',      protect, addExpense);
router.put('/:id',   protect, updateExpense);
router.delete('/:id',protect, deleteExpense);

module.exports = router;
