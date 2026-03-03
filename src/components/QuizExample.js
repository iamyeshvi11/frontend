import React, { useState } from 'react';
import Quiz from './Quiz';

/**
 * Example usage of the Quiz component
 * This demonstrates how to integrate the quiz into your application
 */

const QuizExample = () => {
  const [showResults, setShowResults] = useState(false);
  const [quizKey, setQuizKey] = useState(0);

  // Sample quiz questions
  const sampleQuestions = [
    {
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
      explanation: "Paris is the capital and largest city of France."
    },
    {
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      explanation: "Mars is called the Red Planet because of its reddish appearance caused by iron oxide on its surface."
    },
    {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswer: 1,
      explanation: "Basic arithmetic: 2 + 2 = 4"
    },
    {
      question: "Which programming language is known for web development?",
      options: ["Python", "JavaScript", "C++", "Swift"],
      correctAnswer: 1,
      explanation: "JavaScript is the primary language for web development, running in browsers."
    },
    {
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: 3,
      explanation: "The Pacific Ocean is the largest and deepest ocean on Earth."
    }
  ];

  // Sample previous attempts (for demonstration)
  const previousAttempts = [
    {
      attemptNumber: 1,
      score: 60,
      completedAt: new Date('2026-03-01T10:00:00')
    },
    {
      attemptNumber: 2,
      score: 75,
      completedAt: new Date('2026-03-02T14:30:00')
    }
  ];

  const handleSubmit = (answers, results) => {
    console.log('Quiz submitted!');
    console.log('Answers:', answers);
    console.log('Results:', results);
    
    setShowResults(true);
    
    // Here you would typically send the results to your backend
    // Example:
    // axios.post('/api/courses/assignments/:id/submit', {
    //   answers: formatAnswersForAPI(answers),
    //   timeTaken: calculateTimeTaken()
    // });
  };

  const handleRetake = () => {
    console.log('Retaking quiz...');
    setShowResults(false);
    setQuizKey(prev => prev + 1); // Force re-render with new key
    
    // Here you would reset any backend state if needed
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Quiz Component Example</h1>
      
      <Quiz
        key={quizKey}
        questions={sampleQuestions}
        onSubmit={handleSubmit}
        onRetake={handleRetake}
        passThreshold={70}
        showResults={showResults}
        previousAttempts={previousAttempts}
        courseTitle="Sample Course"
        loading={false}
      />

      {/* Usage Instructions */}
      <div style={{
        marginTop: '3rem',
        padding: '2rem',
        background: '#f8f9fa',
        borderRadius: '12px'
      }}>
        <h2>How to Use This Component</h2>
        <pre style={{
          background: '#2c3e50',
          color: '#ecf0f1',
          padding: '1rem',
          borderRadius: '8px',
          overflow: 'auto'
        }}>
{`import Quiz from './components/Quiz';

<Quiz
  questions={questions}           // Array of question objects
  onSubmit={handleSubmit}         // Callback when quiz is submitted
  onRetake={handleRetake}         // Callback when retake is clicked
  passThreshold={70}              // Pass percentage (default: 70)
  showResults={false}             // Show results immediately
  previousAttempts={[]}           // Array of previous attempt objects
  courseTitle="Course Name"       // Title to display
  loading={false}                 // Show loading state
/>

// Question object format:
{
  question: "Question text",
  options: ["Option A", "Option B", "Option C", "Option D"],
  correctAnswer: 2,  // Index of correct option (0-based)
  explanation: "Explanation text (optional)"
}

// Previous attempt object format:
{
  attemptNumber: 1,
  score: 75,
  completedAt: "2026-03-02T10:00:00Z"
}`}
        </pre>
      </div>
    </div>
  );
};

export default QuizExample;
