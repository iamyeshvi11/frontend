import React, { useState } from 'react';
import axios from 'axios';
import './AdminCourseBuilder.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const AdminCourseBuilder = () => {
  const [courseTopic, setCourseTopic] = useState('');
  const [generatedCourse, setGeneratedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Handle course generation
  const handleGenerate = async () => {
    if (!courseTopic.trim()) {
      alert('Please enter a course topic');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/courses/generate`,
        { topic: courseTopic },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setGeneratedCourse(response.data.data);
      setEditMode(true);
    } catch (error) {
      console.error('Error generating course:', error);
      alert(error.response?.data?.message || 'Failed to generate course');
    } finally {
      setLoading(false);
    }
  };

  // Handle course save
  const handleSave = async () => {
    if (!generatedCourse) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_URL}/courses`,
        generatedCourse,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Course saved successfully!');
      // Reset form
      setCourseTopic('');
      setGeneratedCourse(null);
      setEditMode(false);
    } catch (error) {
      console.error('Error saving course:', error);
      alert(error.response?.data?.message || 'Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  // Handle field updates
  const updateField = (field, value) => {
    setGeneratedCourse(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle module updates
  const updateModule = (moduleIndex, field, value) => {
    setGeneratedCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex] = {
        ...newModules[moduleIndex],
        [field]: value
      };
      return { ...prev, modules: newModules };
    });
  };

  // Add new module
  const addModule = () => {
    setGeneratedCourse(prev => ({
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

  // Delete module
  const deleteModule = (moduleIndex) => {
    if (window.confirm('Are you sure you want to delete this module?')) {
      setGeneratedCourse(prev => ({
        ...prev,
        modules: prev.modules.filter((_, idx) => idx !== moduleIndex)
      }));
    }
  };

  // Add content block to module
  const addContentBlock = (moduleIndex) => {
    setGeneratedCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].contentBlocks.push('New content block');
      return { ...prev, modules: newModules };
    });
  };

  // Update content block
  const updateContentBlock = (moduleIndex, blockIndex, value) => {
    setGeneratedCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].contentBlocks[blockIndex] = value;
      return { ...prev, modules: newModules };
    });
  };

  // Delete content block
  const deleteContentBlock = (moduleIndex, blockIndex) => {
    setGeneratedCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].contentBlocks = newModules[moduleIndex].contentBlocks.filter(
        (_, idx) => idx !== blockIndex
      );
      return { ...prev, modules: newModules };
    });
  };

  // Add question to quiz
  const addQuestion = (moduleIndex) => {
    setGeneratedCourse(prev => {
      const newModules = [...prev.modules];
      if (!newModules[moduleIndex].quiz) {
        newModules[moduleIndex].quiz = [];
      }
      newModules[moduleIndex].quiz.push({
        question: 'New question',
        options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
        correctAnswer: 0,
        explanation: ''
      });
      return { ...prev, modules: newModules };
    });
  };

  // Update question
  const updateQuestion = (moduleIndex, questionIndex, field, value) => {
    setGeneratedCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].quiz[questionIndex] = {
        ...newModules[moduleIndex].quiz[questionIndex],
        [field]: value
      };
      return { ...prev, modules: newModules };
    });
  };

  // Update question option
  const updateQuestionOption = (moduleIndex, questionIndex, optionIndex, value) => {
    setGeneratedCourse(prev => {
      const newModules = [...prev.modules];
      newModules[moduleIndex].quiz[questionIndex].options[optionIndex] = value;
      return { ...prev, modules: newModules };
    });
  };

  // Delete question
  const deleteQuestion = (moduleIndex, questionIndex) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setGeneratedCourse(prev => {
        const newModules = [...prev.modules];
        newModules[moduleIndex].quiz = newModules[moduleIndex].quiz.filter(
          (_, idx) => idx !== questionIndex
        );
        return { ...prev, modules: newModules };
      });
    }
  };

  return (
    <div className="admin-course-builder">
      <div className="builder-header">
        <h1>Course Builder</h1>
        <p>Create engaging training courses with AI assistance</p>
      </div>

      {/* Course Topic Input */}
      <div className="topic-input-section">
        <div className="input-group">
          <label htmlFor="courseTopic">Course Topic</label>
          <input
            type="text"
            id="courseTopic"
            value={courseTopic}
            onChange={(e) => setCourseTopic(e.target.value)}
            placeholder="e.g., Cybersecurity Awareness, Data Privacy, Workplace Safety"
            disabled={loading || editMode}
          />
        </div>
        <button
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={loading || editMode || !courseTopic.trim()}
        >
          {loading ? 'Generating...' : 'Generate Course Structure'}
        </button>
      </div>

      {/* Generated Course Editor */}
      {generatedCourse && (
        <div className="course-editor">
          <div className="editor-header">
            <h2>Edit Course Details</h2>
            <div className="editor-actions">
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setGeneratedCourse(null);
                  setEditMode(false);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-success"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Course'}
              </button>
            </div>
          </div>

          {/* Basic Course Info */}
          <div className="course-basic-info">
            <div className="form-group">
              <label>Course Title</label>
              <input
                type="text"
                value={generatedCourse.title}
                onChange={(e) => updateField('title', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={generatedCourse.description}
                onChange={(e) => updateField('description', e.target.value)}
                rows="3"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Risk Level</label>
                <select
                  value={generatedCourse.riskLevel}
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
                  min="0"
                  max="100"
                  value={generatedCourse.passThreshold}
                  onChange={(e) => updateField('passThreshold', parseInt(e.target.value))}
                />
              </div>
            </div>
          </div>

          {/* Modules */}
          <div className="modules-section">
            <div className="section-header">
              <h3>Course Modules</h3>
              <button className="btn btn-sm btn-primary" onClick={addModule}>
                + Add Module
              </button>
            </div>

            {generatedCourse.modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="module-card">
                <div className="module-header">
                  <input
                    type="text"
                    value={module.title}
                    onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                    className="module-title-input"
                  />
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteModule(moduleIndex)}
                  >
                    Delete Module
                  </button>
                </div>

                {/* Content Blocks */}
                <div className="content-blocks">
                  <h4>Content</h4>
                  {module.contentBlocks.map((block, blockIndex) => (
                    <div key={blockIndex} className="content-block">
                      <textarea
                        value={block}
                        onChange={(e) => updateContentBlock(moduleIndex, blockIndex, e.target.value)}
                        rows="3"
                      />
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => deleteContentBlock(moduleIndex, blockIndex)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => addContentBlock(moduleIndex)}
                  >
                    + Add Content Block
                  </button>
                </div>

                {/* Quiz Questions */}
                <div className="quiz-section">
                  <div className="quiz-header">
                    <h4>Quiz Questions</h4>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => addQuestion(moduleIndex)}
                    >
                      + Add Question
                    </button>
                  </div>

                  {module.quiz && module.quiz.map((question, questionIndex) => (
                    <div key={questionIndex} className="question-card">
                      <div className="question-header">
                        <span>Question {questionIndex + 1}</span>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteQuestion(moduleIndex, questionIndex)}
                        >
                          Delete
                        </button>
                      </div>

                      <div className="form-group">
                        <label>Question</label>
                        <input
                          type="text"
                          value={question.question}
                          onChange={(e) => updateQuestion(moduleIndex, questionIndex, 'question', e.target.value)}
                        />
                      </div>

                      <div className="options-group">
                        <label>Options</label>
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="option-row">
                            <input
                              type="radio"
                              name={`correct-${moduleIndex}-${questionIndex}`}
                              checked={question.correctAnswer === optionIndex}
                              onChange={() => updateQuestion(moduleIndex, questionIndex, 'correctAnswer', optionIndex)}
                            />
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => updateQuestionOption(moduleIndex, questionIndex, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                          </div>
                        ))}
                      </div>

                      <div className="form-group">
                        <label>Explanation (Optional)</label>
                        <textarea
                          value={question.explanation}
                          onChange={(e) => updateQuestion(moduleIndex, questionIndex, 'explanation', e.target.value)}
                          rows="2"
                          placeholder="Explain why this is the correct answer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCourseBuilder;
