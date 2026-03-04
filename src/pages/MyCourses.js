import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MyCourses.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRisk, setFilterRisk] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCourses(response.data.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to fetch courses: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Course deleted successfully');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesRisk = filterRisk === 'all' || course.riskLevel === filterRisk;
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const getRiskBadgeClass = (riskLevel) => {
    switch(riskLevel) {
      case 'High': return 'badge-danger';
      case 'Medium': return 'badge-warning';
      case 'Low': return 'badge-success';
      default: return 'badge-secondary';
    }
  };

  if (loading) {
    return (
      <div className="my-courses">
        <div className="loading">Loading courses...</div>
      </div>
    );
  }

  return (
    <div className="my-courses">
      <div className="page-header">
        <div>
          <h1>📚 My Courses</h1>
          <p>View and manage all courses you've created</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/admin/course-builder')}
        >
          + Create New Course
        </button>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card blue">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>Total Courses</h3>
            <p className="stat-number">{courses.length}</p>
          </div>
        </div>
        <div className="stat-card red">
          <div className="stat-icon">🔴</div>
          <div className="stat-content">
            <h3>High Risk</h3>
            <p className="stat-number">{courses.filter(c => c.riskLevel === 'High').length}</p>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">🟠</div>
          <div className="stat-content">
            <h3>Medium Risk</h3>
            <p className="stat-number">{courses.filter(c => c.riskLevel === 'Medium').length}</p>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">🟢</div>
          <div className="stat-content">
            <h3>Low Risk</h3>
            <p className="stat-number">{courses.filter(c => c.riskLevel === 'Low').length}</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <label>Risk Level:</label>
          <select value={filterRisk} onChange={(e) => setFilterRisk(e.target.value)}>
            <option value="all">All Levels</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
        <button className="btn btn-secondary" onClick={() => {
          setFilterRisk('all');
          setSearchTerm('');
        }}>
          Clear Filters
        </button>
      </div>

      {/* Courses List */}
      <div className="courses-container">
        {filteredCourses.length === 0 ? (
          <div className="empty-state">
            <h3>No courses found</h3>
            <p>
              {courses.length === 0 
                ? "You haven't created any courses yet. Click 'Create New Course' to get started!"
                : "No courses match your filters. Try adjusting your search criteria."}
            </p>
            {courses.length === 0 && (
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/admin/course-builder')}
              >
                Create Your First Course
              </button>
            )}
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map(course => (
              <div key={course._id} className="course-card">
                <div className="course-card-header">
                  <h3>{course.title}</h3>
                  <span className={`badge ${getRiskBadgeClass(course.riskLevel)}`}>
                    {course.riskLevel} Risk
                  </span>
                </div>
                
                <p className="course-description">{course.description}</p>
                
                <div className="course-meta">
                  <div className="meta-item">
                    <span className="meta-label">📖 Modules:</span>
                    <span className="meta-value">{course.modules?.length || 0}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">❓ Questions:</span>
                    <span className="meta-value">{course.totalQuestions || 0}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">🎯 Pass:</span>
                    <span className="meta-value">{course.passThreshold}%</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">📅 Created:</span>
                    <span className="meta-value">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="course-actions">
                  <button 
                    className="btn btn-sm btn-info"
                    onClick={() => navigate(`/admin/courses/${course._id}`)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-sm btn-secondary"
                    onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => navigate(`/admin/assignments?course=${course._id}`)}
                  >
                    Assign
                  </button>
                  <button 
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteCourse(course._id, course.title)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
