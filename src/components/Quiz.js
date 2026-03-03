import React, { useState, useEffect } from 'react';
import './Quiz.css';

const Quiz = ({
  questions,
  onSubmit,
  onRetake,
  passThreshold = 70,
  showResults = false,
  previousAttempts = [],
  loading = false,
  courseTitle = ''
}) => {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [results, setResults] = useState(null);
  const [isRetake, setIsRetake] = useState(false);

  useEffect(() => {
    // If there are previous attempts, this is a retake
    if (previousAttempts && previousAttempts.length > 0) {
      setIsRetake(true);
    }
  }, [previousAttempts]);

  // Reset state when questions change (for retakes)
  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setResults(null);
  }, [questions]);

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    if (submitted) return; // Don't allow changes after submission

    setAnswers(prev => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    const totalQuestions = questions.length;

    const detailedResults = questions.map((question, index) => {
      const selectedAnswer = answers[index];
      const isCorrect = selectedAnswer === question.correctAnswer;
      
      if (isCorrect) correct++;

      return {
        questionIndex: index,
        question: question.question,
        options: question.options,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    const percentage = Math.round((correct / totalQuestions) * 100);
    
    return {
      score: percentage,
      correct,
      total: totalQuestions,
      passed: percentage >= passThreshold,
      details: detailedResults
    };
  };

  const handleSubmit = () => {
    // Validate all questions are answered
    const unansweredQuestions = questions.filter((_, index) => 
      answers[index] === undefined || answers[index] === null
    );

    if (unansweredQuestions.length > 0) {
      alert(`Please answer all questions. ${unansweredQuestions.length} question(s) remaining.`);
      return;
    }

    // Calculate results
    const calculatedResults = calculateScore();
    setScore(calculatedResults.score);
    setResults(calculatedResults);
    setSubmitted(true);

    // Call parent's onSubmit callback
    if (onSubmit) {
      onSubmit(answers, calculatedResults);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(null);
    setResults(null);

    if (onRetake) {
      onRetake();
    }
  };

  const getQuestionStatus = (questionIndex) => {
    if (!submitted) return null;
    
    const result = results?.details[questionIndex];
    return result?.isCorrect ? 'correct' : 'incorrect';
  };

  const allQuestionsAnswered = questions.length > 0 && 
    Object.keys(answers).length === questions.length;

  return (
    <div className="quiz-container">
      {/* Quiz Header */}
      {courseTitle && (
        <div className="quiz-header">
          <h2>{courseTitle} - Final Quiz</h2>
          {passThreshold && (
            <p className="pass-threshold">
              Pass Threshold: <strong>{passThreshold}%</strong>
            </p>
          )}
          {isRetake && previousAttempts.length > 0 && (
            <div className="attempt-info">
              <span className="attempt-badge">
                Attempt #{previousAttempts.length + 1}
              </span>
              <span className="previous-score">
                Previous Best: {Math.max(...previousAttempts.map(a => a.score))}%
              </span>
            </div>
          )}
        </div>
      )}

      {/* Questions */}
      {!submitted ? (
        <div className="quiz-questions">
          {questions.map((question, questionIndex) => (
            <div 
              key={questionIndex} 
              className={`quiz-question ${answers[questionIndex] !== undefined ? 'answered' : ''}`}
            >
              <div className="question-header">
                <span className="question-number">Question {questionIndex + 1}</span>
                {answers[questionIndex] !== undefined && (
                  <span className="answered-indicator">✓ Answered</span>
                )}
              </div>

              <h3 className="question-text">{question.question}</h3>

              <div className="question-options">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`option-label ${
                      answers[questionIndex] === optionIndex ? 'selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      value={optionIndex}
                      checked={answers[questionIndex] === optionIndex}
                      onChange={() => handleAnswerSelect(questionIndex, optionIndex)}
                    />
                    <span className="option-letter">
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    <span className="option-text">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Results View */
        <div className="quiz-results">
          {questions.map((question, questionIndex) => {
            const result = results.details[questionIndex];
            const status = result.isCorrect ? 'correct' : 'incorrect';

            return (
              <div key={questionIndex} className={`quiz-question result ${status}`}>
                <div className="question-header">
                  <span className="question-number">Question {questionIndex + 1}</span>
                  <span className={`status-badge ${status}`}>
                    {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                  </span>
                </div>

                <h3 className="question-text">{question.question}</h3>

                <div className="question-options results-mode">
                  {question.options.map((option, optionIndex) => {
                    const isSelected = result.selectedAnswer === optionIndex;
                    const isCorrect = result.correctAnswer === optionIndex;
                    
                    let optionClass = 'option-label';
                    if (isSelected && isCorrect) optionClass += ' correct selected';
                    else if (isSelected && !isCorrect) optionClass += ' incorrect selected';
                    else if (isCorrect) optionClass += ' correct';

                    return (
                      <div key={optionIndex} className={optionClass}>
                        <span className="option-letter">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>
                        <span className="option-text">{option}</span>
                        {isCorrect && <span className="correct-indicator">✓</span>}
                        {isSelected && !isCorrect && <span className="incorrect-indicator">✗</span>}
                      </div>
                    );
                  })}
                </div>

                {result.explanation && (
                  <div className="explanation">
                    <strong>Explanation:</strong> {result.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Progress Indicator */}
      {!submitted && (
        <div className="quiz-progress">
          <div className="progress-text">
            {Object.keys(answers).length} of {questions.length} questions answered
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${(Object.keys(answers).length / questions.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
      )}

      {/* Score Display */}
      {submitted && score !== null && (
        <div className={`score-display ${results.passed ? 'passed' : 'failed'}`}>
          <div className="score-circle">
            <div className="score-value">{score}%</div>
            <div className="score-label">Your Score</div>
          </div>
          
          <div className="score-details">
            <div className="detail-row">
              <span className="detail-label">Questions Correct:</span>
              <span className="detail-value">
                {results.correct} / {results.total}
              </span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Pass Threshold:</span>
              <span className="detail-value">{passThreshold}%</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Status:</span>
              <span className={`detail-value status ${results.passed ? 'passed' : 'failed'}`}>
                {results.passed ? '✓ PASSED' : '✗ FAILED'}
              </span>
            </div>
          </div>

          <div className={`result-message ${results.passed ? 'success' : 'failure'}`}>
            {results.passed ? (
              <>
                <div className="result-icon">🎉</div>
                <h2>Congratulations!</h2>
                <p>You passed the quiz with {score}%</p>
                <p className="success-note">
                  Great job! You have successfully completed this course.
                </p>
              </>
            ) : (
              <>
                <div className="result-icon">📚</div>
                <h2>Keep Learning</h2>
                <p>You scored {score}%, which is below the pass threshold of {passThreshold}%</p>
                <p className="retry-note">
                  Don't worry! You can review the course materials and retake the quiz.
                </p>
              </>
            )}
          </div>

          {/* Attempt History */}
          {previousAttempts.length > 0 && (
            <div className="attempt-history">
              <h3>Attempt History</h3>
              <div className="attempts-list">
                {previousAttempts.map((attempt, index) => (
                  <div key={index} className="attempt-item">
                    <span className="attempt-number">Attempt #{attempt.attemptNumber}</span>
                    <span className="attempt-score">{attempt.score}%</span>
                    <span className="attempt-date">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
                <div className="attempt-item current">
                  <span className="attempt-number">Current Attempt</span>
                  <span className="attempt-score">{score}%</span>
                  <span className="attempt-date">Just now</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="quiz-actions">
        {!submitted ? (
          <button
            className={`btn btn-submit ${allQuestionsAnswered ? 'enabled' : 'disabled'}`}
            onClick={handleSubmit}
            disabled={!allQuestionsAnswered || loading}
          >
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <div className="result-actions">
            {!results.passed && (
              <button
                className="btn btn-retake"
                onClick={handleRetake}
                disabled={loading}
              >
                🔄 Retake Quiz
              </button>
            )}
            {results.passed && (
              <button
                className="btn btn-success"
                onClick={() => window.location.href = '/employee/courses'}
              >
                ✓ Back to Courses
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
