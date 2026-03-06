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
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchCourse();
    fetchCourseStats();
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

  const fetchCourseStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/courses/${id}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching course stats:', error);
      // Don't show error for stats - it's not critical
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

  const getContentBlockTypeIcon = (type) => {
    switch(type) {
      case 'video': return '🎥';
      case 'pdf': return '📄';
      case 'image': return '🖼️';
      case 'audio': return '🎵';
      case 'text': return '📝';
      default: return '📋';
    }
  };

  const renderContentBlock = (block, blockIndex) => {
    // Handle legacy string format
    if (typeof block === 'string') {
      return (
        <div key={blockIndex} className="content-block text-block">
          <div className="block-header">
            <span className="block-icon">📝</span>
            <span className="block-type">Text Content</span>
          </div>
          <div className="block-content">
            <p>{block}</p>
          </div>
        </div>
      );
    }

    // Handle object format with different types
    const blockType = block.type || 'text';
    const icon = getContentBlockTypeIcon(blockType);

    return (
      <div key={blockIndex} className={`content-block ${blockType}-block`}>
        <div className="block-header">
          <span className="block-icon">{icon}</span>
          <span className="block-type">{blockType.toUpperCase()}</span>
          {block.title && <span className="block-title">{block.title}</span>}
        </div>

        <div className="block-content">
          {blockType === 'text' && (
            <p className="text-content">{block.content}</p>
          )}

          {blockType === 'video' && (
            <div className="media-container">
              {block.fileUrl ? (
                <video controls className="video-player">
                  <source src={block.fileUrl} type={block.metadata?.mimeType || 'video/mp4'} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p className="no-file">No video file uploaded</p>
              )}
              {block.metadata && (
                <div className="media-info">
                  <small>Size: {formatFileSize(block.metadata.fileSize)}</small>
                  {block.duration && <small> • Duration: {formatDuration(block.duration)}</small>}
                </div>
              )}
            </div>
          )}

          {blockType === 'pdf' && (
            <div className="media-container">
              {block.fileUrl ? (
                <>
                  <div className="pdf-preview">
                    <iframe 
                      src={block.fileUrl} 
                      title={block.title || 'PDF Document'}
                      className="pdf-viewer"
                    />
                  </div>
                  <a 
                    href={block.fileUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn btn-primary btn-sm"
                  >
                    📥 Download PDF
                  </a>
                </>
              ) : (
                <p className="no-file">No PDF file uploaded</p>
              )}
              {block.metadata && (
                <div className="media-info">
                  <small>Size: {formatFileSize(block.metadata.fileSize)}</small>
                </div>
              )}
            </div>
          )}

          {blockType === 'image' && (
            <div className="media-container">
              {block.fileUrl ? (
                <img 
                  src={block.fileUrl} 
                  alt={block.title || 'Course image'}
                  className="image-viewer"
                />
              ) : (
                <p className="no-file">No image file uploaded</p>
              )}
              {block.metadata && (
                <div className="media-info">
                  <small>Size: {formatFileSize(block.metadata.fileSize)}</small>
                </div>
              )}
            </div>
          )}

          {blockType === 'audio' && (
            <div className="media-container">
              {block.fileUrl ? (
                <audio controls className="audio-player">
                  <source src={block.fileUrl} type={block.metadata?.mimeType || 'audio/mpeg'} />
                  Your browser does not support the audio tag.
                </audio>
              ) : (
                <p className="no-file">No audio file uploaded</p>
              )}
              {block.metadata && (
                <div className="media-info">
                  <small>Size: {formatFileSize(block.metadata.fileSize)}</small>
                  {block.duration && <small> • Duration: {formatDuration(block.duration)}</small>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/courses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert('Course deleted successfully!');
      navigate('/admin/courses');
    } catch (error) {
      console.error('Error deleting course:', error);
      alert(error.response?.data?.message || 'Failed to delete course');
    }
  };

  if (loading) {
    return (
      <div className="course-details">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading course details...</p>
        </div>
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
          <div className="title-row">
            <h1>{course.title}</h1>
            <span className={`badge ${getRiskBadgeClass(course.riskLevel)}`}>
              {course.riskLevel} Risk
            </span>
            {course.isMandatory && (
              <span className="badge badge-info">Mandatory</span>
            )}
            {course.aiGenerated && (
              <span className="badge badge-purple">AI Generated</span>
            )}
          </div>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
          >
            ✏️ Edit
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/admin/assignments?course=${course._id}`)}
          >
            📋 Assign
          </button>
          <button 
            className="btn btn-danger"
            onClick={handleDelete}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      {/* Course Statistics */}
      {stats && (
        <div className="stats-section">
          <div className="stat-box">
            <div className="stat-value">{stats.totalAssignments || 0}</div>
            <div className="stat-label">Total Assignments</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{stats.completionRate || 0}%</div>
            <div className="stat-label">Completion Rate</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{course.modules?.length || 0}</div>
            <div className="stat-label">Modules</div>
          </div>
          <div className="stat-box">
            <div className="stat-value">{course.totalQuestions || 0}</div>
            <div className="stat-label">Questions</div>
          </div>
        </div>
      )}

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
            <label>Estimated Duration:</label>
            <p>{course.estimatedDuration || 60} minutes</p>
          </div>
          <div className="info-item">
            <label>Category:</label>
            <p>{course.categoryCode || 'Not assigned'}</p>
          </div>
          <div className="info-item">
            <label>Created By:</label>
            <p>{course.createdBy?.name || 'Unknown'}</p>
          </div>
          <div className="info-item">
            <label>Created:</label>
            <p>{new Date(course.createdAt).toLocaleDateString()}</p>
          </div>
          {course.tags && course.tags.length > 0 && (
            <div className="info-item full-width">
              <label>Tags:</label>
              <div className="tags-list">
                {course.tags.map((tag, idx) => (
                  <span key={idx} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="modules-section">
        <h2>Course Modules ({course.modules?.length || 0})</h2>
        {course.modules && course.modules.length > 0 ? (
          <div className="modules-list">
            {course.modules.map((module, index) => (
              <div key={index} className="module-card">
                <div className="module-header">
                  <h3>
                    <span className="module-number">Module {index + 1}</span>
                    {module.title}
                  </h3>
                  <span className="badge badge-info">
                    {module.quiz?.length || 0} Question{module.quiz?.length !== 1 ? 's' : ''}
                  </span>
                </div>
                
                <div className="module-content-section">
                  <h4>📚 Content ({module.contentBlocks?.length || 0})</h4>
                  <div className="content-blocks-list">
                    {module.contentBlocks && module.contentBlocks.length > 0 ? (
                      module.contentBlocks.map((block, blockIndex) => 
                        renderContentBlock(block, blockIndex)
                      )
                    ) : (
                      <p className="empty-state">No content blocks added</p>
                    )}
                  </div>
                </div>

                {module.quiz && module.quiz.length > 0 && (
                  <div className="module-quiz">
                    <h4>❓ Quiz Questions ({module.quiz.length})</h4>
                    {module.quiz.map((question, qIndex) => (
                      <div key={qIndex} className="quiz-question">
                        <p className="question-text">
                          <strong>Question {qIndex + 1}:</strong> {question.question}
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
                            <strong>💡 Explanation:</strong> {question.explanation}
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
