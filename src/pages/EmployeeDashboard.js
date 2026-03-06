import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import EmployeeCourses from './EmployeeCourses';
import CourseViewWithQuiz from './CourseViewWithQuiz';
import './Dashboard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EmployeeHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    assigned: 0,
    avgScore: 0
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/courses/assignments/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const assignments = response.data.data || [];
      
      // Calculate stats
      const completed = assignments.filter(a => a.status === 'Completed');
      const inProgress = assignments.filter(a => a.status === 'In Progress');
      const assigned = assignments.filter(a => a.status === 'Assigned');
      
      // Calculate average score
      const scoresArray = completed.map(a => a.score).filter(s => s != null);
      const avgScore = scoresArray.length > 0
        ? Math.round(scoresArray.reduce((sum, score) => sum + score, 0) / scoresArray.length)
        : 0;

      setStats({
        total: assignments.length,
        completed: completed.length,
        inProgress: inProgress.length,
        assigned: assigned.length,
        avgScore
      });

      // Get upcoming deadlines (not completed, sorted by deadline)
      const upcoming = assignments
        .filter(a => a.status !== 'Completed')
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);
      
      setUpcomingDeadlines(upcoming);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due in 1 day';
    return `Due in ${diffDays} days`;
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

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
            <p className="stat-number">{stats.total}</p>
            <span className="stat-change">Assigned to you</span>
          </div>
        </div>

        <div className="stat-card green">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">{stats.completed}</p>
            <span className="stat-change">
              {stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}% complete` : 'No courses yet'}
            </span>
          </div>
        </div>

        <div className="stat-card purple">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgress}</p>
            <span className="stat-change">Keep going!</span>
          </div>
        </div>

        <div className="stat-card orange">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Avg Score</h3>
            <p className="stat-number">{stats.avgScore}%</p>
            <span className="stat-change">
              {stats.avgScore >= 80 ? 'Great performance!' : 'Keep improving!'}
            </span>
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
            {upcomingDeadlines.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                No upcoming deadlines
              </p>
            ) : (
              upcomingDeadlines.map((assignment) => (
                <div key={assignment._id} className="activity-item">
                  <div className="activity-icon">📚</div>
                  <div className="activity-content">
                    <p className="activity-title">{assignment.courseId?.title || 'Unknown Course'}</p>
                    <p className="activity-time">{getDaysRemaining(assignment.deadline)}</p>
                  </div>
                </div>
              ))
            )}
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
