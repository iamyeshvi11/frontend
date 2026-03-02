import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const AdminHome = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Welcome back, {user?.name}! 👋</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Users</h3>
            <p className="stat-number">248</p>
            <span className="stat-change positive">+12% from last month</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Active Projects</h3>
            <p className="stat-number">32</p>
            <span className="stat-change positive">+5 new projects</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>Completed Tasks</h3>
            <p className="stat-number">1,247</p>
            <span className="stat-change positive">+18% completion</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>Revenue</h3>
            <p className="stat-number">$45.2K</p>
            <span className="stat-change positive">+23% increase</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-content">
                <p className="activity-title">New user registered</p>
                <p className="activity-time">2 minutes ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <p className="activity-title">Project updated</p>
                <p className="activity-time">15 minutes ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✓</div>
              <div className="activity-content">
                <p className="activity-title">Task completed</p>
                <p className="activity-time">1 hour ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">⚙️</div>
              <div className="activity-content">
                <p className="activity-title">Settings updated</p>
                <p className="activity-time">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h2>System Status</h2>
          <div className="status-list">
            <div className="status-item">
              <span>Server Status</span>
              <span className="status-badge success">Online</span>
            </div>
            <div className="status-item">
              <span>Database</span>
              <span className="status-badge success">Connected</span>
            </div>
            <div className="status-item">
              <span>API Status</span>
              <span className="status-badge success">Operational</span>
            </div>
            <div className="status-item">
              <span>Backup</span>
              <span className="status-badge warning">Pending</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageUsers = () => (
  <div className="dashboard">
    <h1>Manage Users</h1>
    <div className="content-card">
      <p>User management interface coming soon...</p>
    </div>
  </div>
);

const Reports = () => (
  <div className="dashboard">
    <h1>Reports</h1>
    <div className="content-card">
      <p>Reports and analytics coming soon...</p>
    </div>
  </div>
);

const Settings = () => (
  <div className="dashboard">
    <h1>Settings</h1>
    <div className="content-card">
      <p>System settings coming soon...</p>
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<AdminHome />} />
        <Route path="users" element={<ManageUsers />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;
