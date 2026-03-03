import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import AdminCourseBuilder from './AdminCourseBuilder';
import AdminReports from './AdminReports';
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
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Total Courses</h3>
            <p className="stat-number">25</p>
            <span className="stat-change positive">+3 this month</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Employees</h3>
            <p className="stat-number">150</p>
            <span className="stat-change positive">+12 new users</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>Completed Courses</h3>
            <p className="stat-number">350</p>
            <span className="stat-change positive">70% completion</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Overdue</h3>
            <p className="stat-number">15</p>
            <span className="stat-change negative">Needs attention</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <a href="/admin/course-builder" className="action-btn">
              📝 Create New Course
            </a>
            <a href="/admin/reports" className="action-btn">
              📊 View Reports
            </a>
            <a href="/admin/users" className="action-btn">
              👥 Manage Users
            </a>
            <a href="/admin/assignments" className="action-btn">
              📚 Assign Courses
            </a>
          </div>
        </div>

        <div className="content-card">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📚</div>
              <div className="activity-content">
                <p className="activity-title">New course created</p>
                <p className="activity-time">2 minutes ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">✓</div>
              <div className="activity-content">
                <p className="activity-title">Course completed by employee</p>
                <p className="activity-time">15 minutes ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📝</div>
              <div className="activity-content">
                <p className="activity-title">Assignment created</p>
                <p className="activity-time">1 hour ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">👤</div>
              <div className="activity-content">
                <p className="activity-title">New employee registered</p>
                <p className="activity-time">3 hours ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2>System Status</h2>
        <div className="status-list">
          <div className="status-item">
            <span>Training System</span>
            <span className="status-badge success">Operational</span>
          </div>
          <div className="status-item">
            <span>Database</span>
            <span className="status-badge success">Connected</span>
          </div>
          <div className="status-item">
            <span>API Status</span>
            <span className="status-badge success">Online</span>
          </div>
          <div className="status-item">
            <span>Course Generation</span>
            <span className="status-badge success">Active</span>
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

const ManageAssignments = () => (
  <div className="dashboard">
    <h1>Manage Assignments</h1>
    <div className="content-card">
      <p>Assignment management interface coming soon...</p>
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
        <Route path="course-builder" element={<AdminCourseBuilder />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="assignments" element={<ManageAssignments />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;
