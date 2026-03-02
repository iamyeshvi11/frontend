import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const EmployeeHome = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <p>Hello, {user?.name}! Ready to be productive? 🚀</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h3>My Tasks</h3>
            <p className="stat-number">12</p>
            <span className="stat-change">8 completed this week</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Upcoming</h3>
            <p className="stat-number">5</p>
            <span className="stat-change">Due this week</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h3>Hours Logged</h3>
            <p className="stat-number">38.5</p>
            <span className="stat-change">This week</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Projects</h3>
            <p className="stat-number">4</p>
            <span className="stat-change">Active projects</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h2>Recent Tasks</h2>
          <div className="task-list">
            <div className="task-item">
              <input type="checkbox" id="task1" />
              <label htmlFor="task1">
                <span className="task-title">Complete project documentation</span>
                <span className="task-priority high">High Priority</span>
              </label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task2" />
              <label htmlFor="task2">
                <span className="task-title">Review code changes</span>
                <span className="task-priority medium">Medium</span>
              </label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task3" defaultChecked />
              <label htmlFor="task3">
                <span className="task-title">Team meeting attendance</span>
                <span className="task-priority low">Low</span>
              </label>
            </div>
            <div className="task-item">
              <input type="checkbox" id="task4" />
              <label htmlFor="task4">
                <span className="task-title">Update project timeline</span>
                <span className="task-priority medium">Medium</span>
              </label>
            </div>
          </div>
        </div>

        <div className="content-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <button className="action-btn">📝 New Request</button>
            <button className="action-btn">⏰ Log Time</button>
            <button className="action-btn">📊 View Reports</button>
            <button className="action-btn">💬 Message Team</button>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2>Announcements</h2>
        <div className="announcement-list">
          <div className="announcement-item">
            <h4>🎉 New Feature Launch</h4>
            <p>Check out our new task management features!</p>
            <span className="announcement-date">2 days ago</span>
          </div>
          <div className="announcement-item">
            <h4>📅 Company Holiday</h4>
            <p>Office will be closed next Friday for the holiday.</p>
            <span className="announcement-date">5 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyTasks = () => (
  <div className="dashboard">
    <h1>My Tasks</h1>
    <div className="content-card">
      <p>Full task management interface coming soon...</p>
    </div>
  </div>
);

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>My Profile</h1>
      <div className="content-card">
        <div className="profile-info">
          <div className="profile-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-details">
            <h2>{user?.name}</h2>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Department:</strong> {user?.department}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Requests = () => (
  <div className="dashboard">
    <h1>My Requests</h1>
    <div className="content-card">
      <p>Request management interface coming soon...</p>
    </div>
  </div>
);

const EmployeeDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<EmployeeHome />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="profile" element={<Profile />} />
        <Route path="requests" element={<Requests />} />
      </Routes>
    </Layout>
  );
};

export default EmployeeDashboard;
