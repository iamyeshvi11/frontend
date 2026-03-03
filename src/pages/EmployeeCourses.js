import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeCourses.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const EmployeeCourses = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/courses/assignments/my`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignments(response.data.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (assignment) => {
    const now = new Date();
    const deadline = new Date(assignment.deadline);
    const isOverdue = now > deadline;

    if (assignment.status === 'Completed') {
      return <span className="badge badge-success">Completed</span>;
    } else if (isOverdue) {
      return <span className="badge badge-danger">Overdue</span>;
    } else if (assignment.status === 'In Progress') {
      return <span className="badge badge-warning">In Progress</span>;
    } else if (assignment.status === 'Failed') {
      return <span className="badge badge-danger">Failed</span>;
    } else {
      return <span className="badge badge-info">Assigned</span>;
    }
  };

  const getRiskBadge = (riskLevel) => {
    const colors = {
      Low: 'badge-success',
      Medium: 'badge-warning',
      High: 'badge-danger'
    };
    return <span className={`badge ${colors[riskLevel]}`}>{riskLevel} Risk</span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due Today';
    if (diffDays === 1) return '1 day left';
    return `${diffDays} days left`;
  };

  const handleStartCourse = (assignmentId) => {
    navigate(`/employee/courses/${assignmentId}`);
  };

  const filteredAssignments = assignments.filter(assignment => {
    if (filter === 'all') return true;
    if (filter === 'pending') return assignment.status === 'Assigned' || assignment.status === 'In Progress';
    if (filter === 'completed') return assignment.status === 'Completed';
    if (filter === 'failed') return assignment.status === 'Failed';
    return true;
  });

  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.status === 'Completed').length,
    inProgress: assignments.filter(a => a.status === 'In Progress').length,
    pending: assignments.filter(a => a.status === 'Assigned').length,
    overdue: assignments.filter(a => {
      const now = new Date();
      const deadline = new Date(a.deadline);
      return now > deadline && a.status !== 'Completed';
    }).length
  };

  if (loading) {
    return (
      <div className="employee-courses">
        <div className="loading">Loading your courses...</div>
      </div>
    );
  }

  return (
    <div className="employee-courses">
      <div className="courses-header">
        <h1>My Training Courses</h1>
        <p>Complete your assigned training courses on time</p>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Total Courses</h3>
            <p className="stat-number">{stats.total}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Completed</h3>
            <p className="stat-number">{stats.completed}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <p className="stat-number">{stats.inProgress}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>Overdue</h3>
            <p className="stat-number">{stats.overdue}</p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-section">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Courses
        </button>
        <button
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={`filter-btn ${filter === 'failed' ? 'active' : ''}`}
          onClick={() => setFilter('failed')}
        >
          Failed
        </button>
      </div>

      {/* Course List */}
      <div className="courses-list">
        {filteredAssignments.length === 0 ? (
          <div className="empty-state">
            <p>No courses found</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => (
            <div key={assignment._id} className="course-card">
              <div className="course-header">
                <div>
                  <h3>{assignment.courseId.title}</h3>
                  <p className="course-description">{assignment.courseId.description}</p>
                </div>
                <div className="course-badges">
                  {getStatusBadge(assignment)}
                  {getRiskBadge(assignment.courseId.riskLevel)}
                </div>
              </div>

              <div className="course-meta">
                <div className="meta-item">
                  <span className="meta-label">Assigned:</span>
                  <span className="meta-value">{formatDate(assignment.assignedAt)}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Deadline:</span>
                  <span className="meta-value">
                    {formatDate(assignment.deadline)}
                    <span className={`days-remaining ${assignment.isOverdue ? 'overdue' : ''}`}>
                      ({getDaysRemaining(assignment.deadline)})
                    </span>
                  </span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Pass Threshold:</span>
                  <span className="meta-value">{assignment.courseId.passThreshold}%</span>
                </div>
              </div>

              {assignment.status === 'Completed' && (
                <div className="course-result">
                  <div className="result-score">
                    <span className="score-label">Your Score:</span>
                    <span className={`score-value ${assignment.score >= assignment.courseId.passThreshold ? 'pass' : 'fail'}`}>
                      {assignment.score}%
                    </span>
                  </div>
                  <div className="result-date">
                    Completed on {formatDate(assignment.completionDate)}
                  </div>
                </div>
              )}

              {assignment.status === 'Failed' && (
                <div className="course-result failed">
                  <div className="result-score">
                    <span className="score-label">Your Score:</span>
                    <span className="score-value fail">{assignment.score}%</span>
                  </div>
                  <p className="retry-message">
                    You can retry this course. Pass threshold: {assignment.courseId.passThreshold}%
                  </p>
                </div>
              )}

              {assignment.status === 'In Progress' && assignment.currentModuleIndex !== undefined && (
                <div className="course-progress">
                  <span>Module {assignment.currentModuleIndex + 1} of {assignment.courseId.modules?.length || 0}</span>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${((assignment.currentModuleIndex + 1) / (assignment.courseId.modules?.length || 1)) * 100}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {assignment.attemptCount > 0 && (
                <div className="attempts-info">
                  <span>Attempts: {assignment.attemptCount}</span>
                  {assignment.bestScore !== null && (
                    <span>Best Score: {assignment.bestScore}%</span>
                  )}
                </div>
              )}

              <div className="course-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => handleStartCourse(assignment._id)}
                >
                  {assignment.status === 'Assigned' ? 'Start Course' :
                   assignment.status === 'Completed' ? 'Review Course' :
                   assignment.status === 'Failed' ? 'Retry Course' :
                   'Continue Course'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeCourses;
