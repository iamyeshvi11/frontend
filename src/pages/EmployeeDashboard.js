import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import EmployeeCourses from './EmployeeCourses';
import CourseViewWithQuiz from './CourseViewWithQuiz';
import './Dashboard.css';

const EmployeeHome = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Employee Dashboard</h1>
        <p>Hello, {user?.name}! Ready to learn? 🚀</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>My Courses</h3>
            <p className="stat-number">8</p>
            <span className="stat-change">Assigned to you</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">5</p>
            <span className="stat-change">62.5% complete</span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">2</p>
            <span className="stat-change">Keep going!</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Avg Score</h3>
            <p className="stat-number">85%</p>
            <span className="stat-change">Great performance!</span>
          </div>
        </div>
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <a href="/employee/courses" className="action-btn">📚 View My Courses</a>
            <a href="/employee/profile" className="action-btn">👤 My Profile</a>
            <a href="/employee/certificates" className="action-btn">🏆 Certificates</a>
          </div>
        </div>

        <div className="content-card">
          <h2>Upcoming Deadlines</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">📚</div>
              <div className="activity-content">
                <p className="activity-title">Cybersecurity Awareness</p>
                <p className="activity-time">Due in 3 days</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-icon">📚</div>
              <div className="activity-content">
                <p className="activity-title">Data Privacy Training</p>
                <p className="activity-time">Due in 5 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="content-card">
        <h2>Recent Activity</h2>
        <div className="announcement-list">
          <div className="announcement-item">
            <h4>🎉 Course Completed!</h4>
            <p>You completed "Workplace Safety" with a score of 92%</p>
            <span className="announcement-date">2 days ago</span>
          </div>
          <div className="announcement-item">
            <h4>📚 New Course Assigned</h4>
            <p>A new training course has been assigned to you.</p>
            <span className="announcement-date">5 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyProfile = () => {
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

const Certificates = () => (
  <div className="dashboard">
    <h1>My Certificates</h1>
    <div className="content-card">
      <p>Your training certificates will appear here.</p>
    </div>
  </div>
);

const EmployeeDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<EmployeeHome />} />
        <Route path="courses" element={<EmployeeCourses />} />
        <Route path="courses/:assignmentId" element={<CourseViewWithQuiz />} />
        <Route path="profile" element={<MyProfile />} />
        <Route path="certificates" element={<Certificates />} />
      </Routes>
    </Layout>
  );
};

export default EmployeeDashboard;
