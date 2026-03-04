import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseDetails.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCourse(response.data.data);
    } catch (error) {
      console.error('Error fetching course:', error);
      alert('Failed to fetch course details');
    } finally {
      setLoading(false);
    }
  };

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
      <div className="course-details">
        <div className="loading">Loading course details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="course-details">
        <div className="error-state">
          <h3>Course not found</h3>
          <button className="btn btn-primary" onClick={() => navigate('/admin/courses')}>
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="course-details">
      <div className="page-header">
        <div>
          <button className="btn-back" onClick={() => navigate('/admin/courses')}>
            ← Back to Courses
          </button>
          <h1>{course.title}</h1>
          <span className={`badge ${getRiskBadgeClass(course.riskLevel)}`}>
            {course.riskLevel} Risk
          </span>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(`/admin/course-builder?edit=${course._id}`)}
          >
            ✏️ Edit Course
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/admin/assignments?course=${course._id}`)}
          >
            📋 Assign to Employees
          </button>
        </div>
      </div>

      <div className="course-info-card">
        <h2>Course Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <label>Description:</label>
            <p>{course.description}</p>
          </div>
          <div className="info-item">
            <label>Pass Threshold:</label>
            <p>{course.passThreshold}%</p>
          </div>
          <div className="info-item">
            <label>Total Modules:</label>
            <p>{course.modules?.length || 0}</p>
          </div>
          <div className="info-item">
            <label>Total Questions:</label>
            <p>{course.totalQuestions || 0}</p>
          </div>
          <div className="info-item">
            <label>Created:</label>
            <p>{new Date(course.createdAt).toLocaleString()}</p>
          </div>
          <div className="info-item">
            <label>Last Updated:</label>
            <p>{new Date(course.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="modules-section">
        <h2>Course Modules ({course.modules?.length || 0})</h2>
        {course.modules && course.modules.length > 0 ? (
          <div className="modules-list">
            {course.modules.map((module, index) => (
              <div key={index} className="module-card">
                <div className="module-header">
                  <h3>Module {index + 1}: {module.title}</h3>
                  <span className="badge badge-info">
                    {module.quiz?.length || 0} Questions
                  </span>
                </div>
                
                <div className="module-content">
                  <h4>Content Blocks:</h4>
                  <ul className="content-blocks">
                    {module.contentBlocks?.map((block, blockIndex) => (
                      <li key={blockIndex}>{block}</li>
                    ))}
                  </ul>
                </div>

                {module.quiz && module.quiz.length > 0 && (
                  <div className="module-quiz">
                    <h4>Quiz Questions:</h4>
                    {module.quiz.map((question, qIndex) => (
                      <div key={qIndex} className="quiz-question">
                        <p className="question-text">
                          <strong>Q{qIndex + 1}:</strong> {question.question}
                        </p>
                        <ul className="options-list">
                          {question.options?.map((option, oIndex) => (
                            <li 
                              key={oIndex}
                              className={oIndex === question.correctAnswer ? 'correct-answer' : ''}
                            >
                              {option}
                              {oIndex === question.correctAnswer && ' ✓'}
                            </li>
                          ))}
                        </ul>
                        {question.explanation && (
                          <p className="explanation">
                            <strong>Explanation:</strong> {question.explanation}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No modules added yet.</p>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
