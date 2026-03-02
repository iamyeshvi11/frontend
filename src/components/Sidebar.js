import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const adminRoutes = [
    { path: '/admin', name: 'Dashboard', icon: '📊' },
    { path: '/admin/users', name: 'Manage Users', icon: '👥' },
    { path: '/admin/reports', name: 'Reports', icon: '📈' },
    { path: '/admin/settings', name: 'Settings', icon: '⚙️' },
  ];

  const employeeRoutes = [
    { path: '/employee', name: 'Dashboard', icon: '📊' },
    { path: '/employee/tasks', name: 'My Tasks', icon: '✓' },
    { path: '/employee/profile', name: 'Profile', icon: '👤' },
    { path: '/employee/requests', name: 'Requests', icon: '📝' },
  ];

  const routes = isAdmin() ? adminRoutes : employeeRoutes;

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🏢 Company Portal</h2>
        <div className="user-info">
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="user-details">
            <p className="user-name">{user?.name}</p>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {routes.map((route) => (
            <li key={route.path}>
              <Link
                to={route.path}
                className={location.pathname === route.path ? 'active' : ''}
              >
                <span className="icon">{route.icon}</span>
                <span className="text">{route.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={logout} className="logout-btn">
          <span className="icon">🚪</span>
          <span className="text">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
