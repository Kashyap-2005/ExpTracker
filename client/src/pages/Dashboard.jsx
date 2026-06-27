import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

// ── Constants ────────────────────────────────────────────────────────────────
const CAT_ICONS = {
  Food:      '🍔',
  Transport: '🚗',
  Bills:     '💡',
  Shopping:  '🛍️',
  Other:     '📦',
};

const CAT_COLORS = {
  Food:      '#00d4aa',
  Transport: '#6c63ff',
  Bills:     '#ffb347',
  Shopping:  '#ff5c7a',
  Other:     '#8b92a9',
};

const CAT_BG = {
  Food:      'rgba(0,212,170,0.15)',
  Transport: 'rgba(108,99,255,0.15)',
  Bills:     'rgba(255,179,71,0.15)',
  Shopping:  'rgba(255,92,122,0.15)',
  Other:     'rgba(139,146,169,0.15)',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats]     = useState({ totalThisMonth: 0, breakdown: [] });
  const [recent, setRecent]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Current month label e.g. "June 2026"
  const monthLabel = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([
          api.get('/expenses/stats'),
          api.get('/expenses/recent'),
        ]);
        setStats(statsRes.data);
        setRecent(recentRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="empty-state">
        <span className="empty-icon">⏳</span>
        <p>Crunching numbers…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <span className="empty-icon">⚠️</span>
        <h3>Oops</h3>
        <p>{error}</p>
      </div>
    );
  }

  const { totalThisMonth, breakdown } = stats;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Hey {user?.name?.split(' ')[0]} — here's your spending snapshot for {monthLabel}.</p>
      </div>

      {breakdown.length === 0 ? (
        <div className="dashboard-empty">
          <span className="dashboard-empty-icon">🌱</span>
          <h2>A fresh start</h2>
          <p>You haven't logged any expenses this month yet.</p>
          <Link to="/expenses" className="btn btn-primary">
            + Add your first expense
          </Link>
        </div>
      ) : (
        <>
          {/* Top grid: summary + breakdown */}
          <div className="dashboard-grid">
            {/* Main Summary Card */}
            <div className="summary-card">
              <div className="summary-label">Total Spent in {monthLabel}</div>
              <div className="summary-amount">{fmt(totalThisMonth)}</div>
              <div className="summary-footer">
                Across {breakdown.reduce((sum, b) => sum + b.count, 0)} transactions
              </div>
              <Link to="/expenses" className="btn btn-ghost" style={{ marginTop: '1.5rem', fontSize: '0.85rem' }}>
                View all →
              </Link>
            </div>

            {/* Category Breakdown */}
            <div className="breakdown-card">
              <div className="breakdown-header">
                <h2>Category Breakdown</h2>
              </div>
              <div className="breakdown-list">
                {breakdown.map((cat) => {
                  const percentage = Math.round((cat.total / totalThisMonth) * 100);
                  return (
                    <div className="breakdown-item" key={cat._id}>
                      <div className="breakdown-item-info">
                        <div className="breakdown-cat">
                          <div
                            className="breakdown-cat-icon"
                            style={{ background: CAT_BG[cat._id], color: CAT_COLORS[cat._id] }}
                          >
                            {CAT_ICONS[cat._id]}
                          </div>
                          {cat._id}
                        </div>
                        <div className="breakdown-amount">
                          {fmt(cat.total)}{' '}
                          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginLeft: '0.4rem' }}>
                            ({percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="breakdown-bar-bg">
                        <div
                          className="breakdown-bar-fill"
                          style={{ width: `${percentage}%`, background: CAT_COLORS[cat._id] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Recent Expenses */}
          {recent.length > 0 && (
            <div className="recent-section">
              <div className="recent-header">
                <h2>Recent Expenses</h2>
                <Link to="/expenses" className="recent-view-all">View all →</Link>
              </div>
              <div className="recent-list">
                {recent.map((exp) => (
                  <div className="recent-item" key={exp._id}>
                    <div
                      className="recent-icon"
                      style={{ background: CAT_BG[exp.category], color: CAT_COLORS[exp.category] }}
                    >
                      {CAT_ICONS[exp.category]}
                    </div>
                    <div className="recent-info">
                      <span className="recent-title">{exp.title}</span>
                      <span className="recent-date">{fmtDate(exp.date)}</span>
                    </div>
                    <div className="recent-amount" style={{ color: CAT_COLORS[exp.category] }}>
                      {fmt(exp.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
