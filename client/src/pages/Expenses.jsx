import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import './Expenses.css';

// ── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ['Food', 'Transport', 'Bills', 'Shopping', 'Other'];

const CAT_ICONS = {
  Food:      '🍔',
  Transport: '🚗',
  Bills:     '💡',
  Shopping:  '🛍️',
  Other:     '📦',
};

const CAT_BG = {
  Food:      'rgba(0,212,170,0.12)',
  Transport: 'rgba(108,99,255,0.12)',
  Bills:     'rgba(255,179,71,0.12)',
  Shopping:  'rgba(255,92,122,0.12)',
  Other:     'rgba(139,146,169,0.12)',
};

const EMPTY_FORM = { title: '', amount: '', category: 'Food', date: '' };

// ── Helper — format currency ─────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

// ── Helper — format date display ─────────────────────────────────────────────
const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

// ── Helper — today's date in yyyy-mm-dd for the date input default ───────────
const todayStr = () => new Date().toISOString().split('T')[0];

// ── Main component ───────────────────────────────────────────────────────────
function Expenses() {
  const [expenses, setExpenses]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');

  // Filters
  const [filterMonth, setFilterMonth]     = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Modal state
  const [modalOpen, setModalOpen]     = useState(false);
  const [editTarget, setEditTarget]   = useState(null);   // null = adding new
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formError, setFormError]     = useState('');
  const [submitting, setSubmitting]   = useState(false);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting]         = useState(false);

  // ── Fetch expenses ─────────────────────────────────────────────────────────
  const fetchExpenses = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filterMonth)    params.month    = filterMonth;
      if (filterCategory) params.category = filterCategory;

      const { data } = await api.get('/expenses', { params });
      setExpenses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExpenses(); }, [filterMonth, filterCategory]);

  // ── Open add modal ─────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditTarget(null);
    setForm({ ...EMPTY_FORM, date: todayStr() });
    setFormError('');
    setModalOpen(true);
  };

  // ── Open edit modal ────────────────────────────────────────────────────────
  const openEdit = (exp) => {
    setEditTarget(exp);
    setForm({
      title:    exp.title,
      amount:   exp.amount,
      category: exp.category,
      date:     exp.date.split('T')[0],
    });
    setFormError('');
    setModalOpen(true);
  };

  // ── Submit add / edit ──────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.title.trim())  return setFormError('Title is required');
    if (!form.amount || Number(form.amount) <= 0)
      return setFormError('Enter a valid amount greater than 0');

    setSubmitting(true);
    try {
      const payload = { ...form, amount: Number(form.amount) };

      if (editTarget) {
        const { data } = await api.put(`/expenses/${editTarget._id}`, payload);
        setExpenses((prev) => prev.map((e) => (e._id === data._id ? data : e)));
        toast.success('Expense updated!');
      } else {
        const { data } = await api.post('/expenses', payload);
        setExpenses((prev) => [data, ...prev]);
        toast.success('Expense added!');
      }

      setModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Something went wrong');
      toast.error('Failed to save expense');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/expenses/${deleteTarget._id}`);
      setExpenses((prev) => prev.filter((e) => e._id !== deleteTarget._id));
      setDeleteTarget(null);
      toast.success('Expense deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  // ── Total of current view ──────────────────────────────────────────────────
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Page header */}
      <div className="expenses-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Expenses</h1>
          <p>Track every rupee you spend.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} id="add-expense-btn">
          + Add Expense
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <span className="filter-label">Filter by:</span>

        <input
          type="month"
          id="filter-month"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          title="Filter by month"
        />

        <select
          id="filter-category"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>
          ))}
        </select>

        {(filterMonth || filterCategory) && (
          <button
            className="btn btn-ghost btn-clear-filters"
            onClick={() => { setFilterMonth(''); setFilterCategory(''); }}
          >
            ✕ Clear
          </button>
        )}
      </div>

      {/* Summary bar */}
      {expenses.length > 0 && (
        <div className="expense-summary">
          <span>{expenses.length} expense{expenses.length !== 1 ? 's' : ''}</span>
          <span className="summary-total">{fmt(total)}</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="empty-state">
          <span className="empty-icon">⏳</span>
          <p>Loading your expenses…</p>
        </div>
      ) : error ? (
        <div className="empty-state">
          <span className="empty-icon">⚠️</span>
          <h3>Could not load expenses</h3>
          <p>{error}</p>
        </div>
      ) : expenses.length === 0 ? (
        <div className="empty-state card">
          <span className="empty-icon">🧾</span>
          <h3>No expenses yet</h3>
          <p>
            {filterMonth || filterCategory
              ? 'No expenses match your current filters.'
              : 'Hit "+ Add Expense" to log your first one.'}
          </p>
        </div>
      ) : (
        <div className="expense-list">
          {expenses.map((exp) => (
            <div className="expense-item" key={exp._id}>
              {/* Category icon */}
              <div
                className="expense-cat-icon"
                style={{ background: CAT_BG[exp.category] }}
              >
                {CAT_ICONS[exp.category]}
              </div>

              {/* Info */}
              <div className="expense-info">
                <div className="expense-title">{exp.title}</div>
                <div className="expense-meta">
                  <span className="expense-date">{fmtDate(exp.date)}</span>
                  <span className={`category-badge cat-${exp.category}`}>
                    {exp.category}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="expense-amount">{fmt(exp.amount)}</div>

              {/* Actions */}
              <div className="expense-actions">
                <button
                  className="btn-icon edit"
                  title="Edit"
                  onClick={() => openEdit(exp)}
                >
                  ✏️
                </button>
                <button
                  className="btn-icon delete"
                  title="Delete"
                  onClick={() => setDeleteTarget(exp)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ────────────────────────────────────────────────── */}
      {modalOpen && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="modal">
            <div className="modal-header">
              <h2>{editTarget ? 'Edit Expense' : 'Add Expense'}</h2>
              <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            {formError && (
              <div className="auth-error" style={{ marginBottom: '1rem' }}>
                <span>⚠️</span> {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label htmlFor="exp-title">Title</label>
                <input
                  id="exp-title"
                  type="text"
                  placeholder="e.g. Grocery run"
                  value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="exp-amount">Amount (₹)</label>
                <input
                  id="exp-amount"
                  type="number"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="exp-category">Category</label>
                <select
                  id="exp-category"
                  value={form.category}
                  onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{CAT_ICONS[c]} {c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="exp-date">Date</label>
                <input
                  id="exp-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                >
                  {submitting ? 'Saving…' : editTarget ? 'Save Changes' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ─────────────────────────────────────────────── */}
      {deleteTarget && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setDeleteTarget(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Delete Expense</h2>
              <button className="modal-close" onClick={() => setDeleteTarget(null)}>✕</button>
            </div>

            <div className="delete-confirm">
              <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.75rem' }}>🗑️</span>
              <p>
                Are you sure you want to delete{' '}
                <span className="expense-name">"{deleteTarget.title}"</span>?
                <br />
                This cannot be undone.
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Expenses;
