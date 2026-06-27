import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/dashboard" className="navbar-logo">
          <span className="logo-icon">💸</span>
          ExpTracker
        </NavLink>

        <div className="navbar-links">
          {user ? (
            // Logged-in state
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/expenses">Expenses</NavLink>
              <span className="navbar-greeting">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn btn-ghost navbar-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            // Logged-out state
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="btn btn-primary navbar-register">
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
