import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminCourseBuilder.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CourseEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [course, setCourse] = useState(null);

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
      alert('Failed to load course: ' + (error.response?.data?.message || error.message));
      navigate('/admin/courses');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!course.title || !course.description || !course.riskLevel) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/courses/${id}`,
        course,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert('Course updated successfully!');
      navigate('/admin/courses');
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course: ' + (error.response?.data?.message || error.message));
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setCourse(prev => ({ ...prev, [field]: value }));
  };

  const updateModule = (index, field, value) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[index] = { ...newModules[index], [field]: value };
      return { ...prev, modules: newModules };
    });
  };

  const addModule = () => {
    setCourse(prev => ({
      ...prev,
      modules: [
        ...prev.modules,
        {
          title: 'New Module',
          contentBlocks: ['Add content here'],
          quiz: []
        }
      ]
    }));
  };

  const removeModule = (index) => {
    if (window.confirm('Are you sure you want to remove this module?')) {
      setCourse(prev => ({
        ...prev,
        modules: prev.modules.filter((_, i) => i !== index)
      }));
    }
  };

  const addContentBlock = (moduleIndex) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].contentBlocks.push('New content block');
      return { ...prev, modules: newModules };
    });
  };

  const updateContentBlock = (moduleIndex, blockIndex, value) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].contentBlocks[blockIndex] = value;
      return { ...prev, modules: newModules };
    });
  };

  const removeContentBlock = (moduleIndex, blockIndex) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].contentBlocks = newModules[moduleIndex].contentBlocks.filter((_, i) => i !== blockIndex);
      return { ...prev, modules: newModules };
    });
  };

  const addQuizQuestion = (moduleIndex) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].quiz.push({
        question: 'New question?',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 0,
        explanation: 'Explanation here'
      });
      return { ...prev, modules: newModules };
    });
  };

  const updateQuizQuestion = (moduleIndex, quizIndex, field, value) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].quiz[quizIndex][field] = value;
      return { ...prev, modules: newModules };
    });
  };

  const removeQuizQuestion = (moduleIndex, quizIndex) => {
    setCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].quiz = newModules[moduleIndex].quiz.filter((_, i) => i !== quizIndex);
      return { ...prev, modules: newModules };
    });
  };

  if (loading) {
    return (
      <div className="admin-course-builder">
        <div className="loading">Loading course...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="admin-course-builder">
        <div className="error">Course not found</div>
      </div>
    );
  }

  return (
    <div className="admin-course-builder">
      <div className="page-header">
        <div>
          <button className="btn-back" onClick={() => navigate('/admin/courses')}>
            ← Back to Courses
          </button>
          <h1>Edit Course</h1>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => navigate('/admin/courses')}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Course Basic Info */}
      <div className="form-card">
        <h2>Course Information</h2>
        
        <div className="form-group">
          <label>Course Title *</label>
          <input
            type="text"
            value={course.title}
            onChange={(e) => updateField('title', e.target.value)}
            placeholder="e.g., Cybersecurity Awareness Training"
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={course.description}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Describe what this course covers..."
            rows="4"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Risk Level *</label>
            <select
              value={course.riskLevel}
              onChange={(e) => updateField('riskLevel', e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group">
            <label>Pass Threshold (%)</label>
            <input
              type="number"
              value={course.passThreshold}
              onChange={(e) => updateField('passThreshold', parseInt(e.target.value))}
              min="0"
              max="100"
            />
          </div>
        </div>
      </div>

      {/* Modules */}
      <div className="form-card">
        <div className="section-header">
          <h2>Course Modules ({course.modules.length})</h2>
          <button className="btn btn-secondary" onClick={addModule}>
            + Add Module
          </button>
        </div>

        {course.modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="module-editor">
            <div className="module-header">
              <h3>Module {moduleIndex + 1}</h3>
              <button
                className="btn-remove"
                onClick={() => removeModule(moduleIndex)}
              >
                Remove Module
              </button>
            </div>

            <div className="form-group">
              <label>Module Title</label>
              <input
                type="text"
                value={module.title}
                onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
              />
            </div>

            {/* Content Blocks */}
            <div className="subsection">
              <div className="subsection-header">
                <h4>Content Blocks ({module.contentBlocks.length})</h4>
                <button
                  className="btn-small"
                  onClick={() => addContentBlock(moduleIndex)}
                >
                  + Add Content
                </button>
              </div>

              {module.contentBlocks.map((block, blockIndex) => (
                <div key={blockIndex} className="content-block">
                  <textarea
                    value={block}
                    onChange={(e) => updateContentBlock(moduleIndex, blockIndex, e.target.value)}
                    rows="3"
                  />
                  <button
                    className="btn-remove-small"
                    onClick={() => removeContentBlock(moduleIndex, blockIndex)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Quiz */}
            <div className="subsection">
              <div className="subsection-header">
                <h4>Quiz Questions ({module.quiz.length})</h4>
                <button
                  className="btn-small"
                  onClick={() => addQuizQuestion(moduleIndex)}
                >
                  + Add Question
                </button>
              </div>

              {module.quiz.map((question, quizIndex) => (
                <div key={quizIndex} className="quiz-editor">
                  <div className="quiz-header">
                    <strong>Question {quizIndex + 1}</strong>
                    <button
                      className="btn-remove-small"
                      onClick={() => removeQuizQuestion(moduleIndex, quizIndex)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Question</label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuizQuestion(moduleIndex, quizIndex, 'question', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Options</label>
                    {question.options.map((option, optIndex) => (
                      <input
                        key={optIndex}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options];
                          newOptions[optIndex] = e.target.value;
                          updateQuizQuestion(moduleIndex, quizIndex, 'options', newOptions);
                        }}
                        placeholder={`Option ${optIndex + 1}`}
                      />
                    ))}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Correct Answer</label>
                      <select
                        value={question.correctAnswer}
                        onChange={(e) => updateQuizQuestion(moduleIndex, quizIndex, 'correctAnswer', parseInt(e.target.value))}
                      >
                        {question.options.map((_, optIndex) => (
                          <option key={optIndex} value={optIndex}>
                            Option {optIndex + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Explanation (optional)</label>
                    <textarea
                      value={question.explanation}
                      onChange={(e) => updateQuizQuestion(moduleIndex, quizIndex, 'explanation', e.target.value)}
                      rows="2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="form-actions">
        <button className="btn btn-secondary" onClick={() => navigate('/admin/courses')}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default CourseEdit;
