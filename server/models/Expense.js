const mongoose = require('mongoose');

/**
 * Expense schema.
 *
 * Each expense belongs to exactly one user (via ObjectId ref).
 * This lets us query "all expenses for this user" efficiently.
 * The category enum is enforced here at the schema level — if anything
 * outside the list is sent, Mongoose rejects it before hitting the DB.
 */
const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['Food', 'Transport', 'Bills', 'Shopping', 'Other'],
        message: '{VALUE} is not a valid category',
      },
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
