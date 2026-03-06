import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Quiz from '../components/Quiz';
import './CourseView.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CourseViewWithQuiz = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  useEffect(() => {
    if (assignment && !startTime) {
      setStartTime(new Date());
    }
  }, [assignment]);

  const fetchAssignment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/courses/assignments/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAssignment(response.data.data);
      setCurrentModuleIndex(response.data.data.currentModuleIndex || 0);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      alert('Failed to load course');
      navigate('/employee/courses');
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (moduleIndex) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/courses/assignments/${assignmentId}/progress`,
        { moduleIndex },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleNextModule = async () => {
    const nextIndex = currentModuleIndex + 1;
    if (nextIndex < assignment.courseId.modules.length) {
      setCurrentModuleIndex(nextIndex);
      await updateProgress(nextIndex);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // All modules completed, prepare and show quiz
      prepareQuiz();
      setShowQuiz(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousModule = () => {
    if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prepareQuiz = () => {
    // Collect all quiz questions from all modules
    const allQuestions = [];
    assignment.courseId.modules.forEach((module, moduleIndex) => {
      if (module.quiz && module.quiz.length > 0) {
        module.quiz.forEach((question, questionIndex) => {
          allQuestions.push({
            ...question,
            moduleIndex,
            questionIndex
          });
        });
      }
    });
    setQuizQuestions(allQuestions);
  };

  const handleQuizSubmit = async (answers, results) => {
    setSubmitting(true);
    try {
      // Calculate time taken
      const endTime = new Date();
      const timeTaken = Math.round((endTime - startTime) / 60000); // in minutes

      // Format answers for API
      const formattedAnswers = Object.entries(answers).map(([questionIndex, selectedAnswer]) => {
        const question = quizQuestions[questionIndex];
        return {
          moduleIndex: question.moduleIndex,
          questionIndex: question.questionIndex,
          selectedAnswer
        };
      });

      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/courses/assignments/${assignmentId}/submit`,
        {
          answers: formattedAnswers,
          timeTaken
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Show result message
      alert(response.data.message);
      
      // If passed, navigate back to courses
      if (response.data.data.status === 'Completed') {
        setTimeout(() => {
          navigate('/employee/courses');
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert(error.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuizRetake = () => {
    // Refresh assignment data to get updated attempts
    fetchAssignment();
    setShowQuiz(false);
    setCurrentModuleIndex(0);
    setStartTime(new Date());
  };

  if (loading) {
    return (
      <div className="course-view">
        <div className="loading">Loading course...</div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="course-view">
        <div className="error">Course not found</div>
      </div>
    );
  }

  const course = assignment.courseId;
  const currentModule = course.modules[currentModuleIndex];

  return (
    <div className="course-view">
      {/* Course Header */}
      <div className="course-view-header">
        <button className="back-btn" onClick={() => navigate('/employee/courses')}>
          ← Back to Courses
        </button>
        <div className="header-content">
          <h1>{course.title}</h1>
          <p>{course.description}</p>
          <div className="course-info">
            <span className="info-badge">Risk Level: {course.riskLevel}</span>
            <span className="info-badge">Pass Threshold: {course.passThreshold}%</span>
            <span className="info-badge">
              Deadline: {new Date(assignment.deadline).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Show Quiz or Module Content */}
      {showQuiz ? (
        <Quiz
          questions={quizQuestions}
          onSubmit={handleQuizSubmit}
          onRetake={handleQuizRetake}
          passThreshold={course.passThreshold}
          previousAttempts={assignment.attempts || []}
          courseTitle={course.title}
          loading={submitting}
        />
      ) : (
        <>
          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-info">
              <span>Module {currentModuleIndex + 1} of {course.modules.length}</span>
              <span>{Math.round(((currentModuleIndex + 1) / course.modules.length) * 100)}% Complete</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentModuleIndex + 1) / course.modules.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Module Navigation */}
          <div className="module-navigation">
            {course.modules.map((module, index) => (
              <button
                key={index}
                className={`module-nav-btn ${index === currentModuleIndex ? 'active' : ''} ${index < currentModuleIndex ? 'completed' : ''}`}
                onClick={() => setCurrentModuleIndex(index)}
                disabled={index > currentModuleIndex}
              >
                <span className="module-number">{index + 1}</span>
                <span className="module-name">{module.title}</span>
              </button>
            ))}
          </div>

          {/* Module Content */}
          {currentModule && (
            <div className="module-content">
              <div className="module-header">
                <h2>{currentModule.title}</h2>
              </div>

              <div className="content-blocks">
                {currentModule.contentBlocks.map((block, index) => {
                  const isObject = typeof block === 'object';
                  const blockType = isObject ? block.type : 'text';
                  const blockContent = isObject ? block.content : block;
                  const blockTitle = isObject ? block.title : '';
                  const fileUrl = isObject ? block.fileUrl : '';
                  
                  return (
                    <div key={index} className="content-block">
                      {blockTitle && <h4>{blockTitle}</h4>}
                      
                      {blockType === 'text' && <p>{blockContent}</p>}
                      
                      {blockType === 'video' && fileUrl && (
                        <div className="video-container">
                          <video controls width="100%" style={{ maxWidth: '800px' }}>
                            <source src={`${API_URL.replace('/api', '')}${fileUrl}`} />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                      
                      {blockType === 'pdf' && fileUrl && (
                        <div className="pdf-container">
                          <a
                            href={`${API_URL.replace('/api', '')}${fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                          >
                            📄 Open PDF Document
                          </a>
                        </div>
                      )}
                      
                      {blockType === 'image' && fileUrl && (
                        <div className="image-container">
                          <img
                            src={`${API_URL.replace('/api', '')}${fileUrl}`}
                            alt={blockTitle || 'Course image'}
                            style={{ maxWidth: '100%', height: 'auto' }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="module-actions">
                <button
                  className="btn btn-secondary"
                  onClick={handlePreviousModule}
                  disabled={currentModuleIndex === 0}
                >
                  ← Previous Module
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleNextModule}
                >
                  {currentModuleIndex === course.modules.length - 1
                    ? 'Start Quiz →'
                    : 'Next Module →'}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CourseViewWithQuiz;
