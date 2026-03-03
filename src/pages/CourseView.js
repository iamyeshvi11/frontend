import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CourseView.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CourseView = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  
  const [assignment, setAssignment] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchAssignment();
  }, [assignmentId]);

  useEffect(() => {
    // Track time when starting
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
      // All modules completed, show quiz
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

  const handleQuizAnswer = (moduleIndex, questionIndex, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [`${moduleIndex}-${questionIndex}`]: answerIndex
    }));
  };

  const handleSubmitQuiz = async () => {
    // Validate all questions are answered
    const totalQuestions = assignment.courseId.modules.reduce((total, module) => {
      return total + (module.quiz ? module.quiz.length : 0);
    }, 0);

    if (Object.keys(quizAnswers).length < totalQuestions) {
      alert('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);
    try {
      // Calculate time taken
      const endTime = new Date();
      const timeTaken = Math.round((endTime - startTime) / 60000); // in minutes

      // Format answers for API
      const formattedAnswers = Object.entries(quizAnswers).map(([key, value]) => {
        const [moduleIndex, questionIndex] = key.split('-').map(Number);
        return {
          moduleIndex,
          questionIndex,
          selectedAnswer: value
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

      // Show result
      alert(response.data.message);
      navigate('/employee/courses');
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert(error.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
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

      {/* Progress Bar */}
      {!showQuiz && (
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
      )}

      {/* Module Navigation */}
      {!showQuiz && (
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
      )}

      {/* Module Content */}
      {!showQuiz && currentModule && (
        <div className="module-content">
          <div className="module-header">
            <h2>{currentModule.title}</h2>
          </div>

          <div className="content-blocks">
            {currentModule.contentBlocks.map((block, index) => (
              <div key={index} className="content-block">
                <p>{block}</p>
              </div>
            ))}
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

      {/* Quiz Section */}
      {showQuiz && (
        <div className="quiz-section">
          <div className="quiz-header">
            <h2>Final Quiz</h2>
            <p>Answer all questions to complete the course. Pass threshold: {course.passThreshold}%</p>
          </div>

          {course.modules.map((module, moduleIndex) => (
            module.quiz && module.quiz.length > 0 && (
              <div key={moduleIndex} className="quiz-module">
                <h3>{module.title} - Questions</h3>
                {module.quiz.map((question, questionIndex) => {
                  const questionKey = `${moduleIndex}-${questionIndex}`;
                  return (
                    <div key={questionIndex} className="quiz-question">
                      <div className="question-header">
                        <span className="question-number">
                          Question {questionIndex + 1}
                        </span>
                      </div>
                      <p className="question-text">{question.question}</p>
                      <div className="question-options">
                        {question.options.map((option, optionIndex) => (
                          <label
                            key={optionIndex}
                            className={`option-label ${quizAnswers[questionKey] === optionIndex ? 'selected' : ''}`}
                          >
                            <input
                              type="radio"
                              name={questionKey}
                              value={optionIndex}
                              checked={quizAnswers[questionKey] === optionIndex}
                              onChange={() => handleQuizAnswer(moduleIndex, questionIndex, optionIndex)}
                            />
                            <span className="option-text">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ))}

          <div className="quiz-actions">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowQuiz(false);
                setCurrentModuleIndex(course.modules.length - 1);
              }}
            >
              ← Review Modules
            </button>
            <button
              className="btn btn-success"
              onClick={handleSubmitQuiz}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseView;
