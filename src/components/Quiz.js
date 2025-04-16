import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Quiz = ({ questions }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [blankAssignments, setBlankAssignments] = useState({}); // {blankPos: word}
  const [availableWords, setAvailableWords] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const navigate = useNavigate();

  // Initialize question
  useEffect(() => {
    if (questions.length > 0) {
      setAvailableWords([...questions[currentQuestionIndex].options]);
      setBlankAssignments({});
    }
  }, [currentQuestionIndex, questions]);

  const handleNextQuestion = useCallback(() => {
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = Object.values(blankAssignments).sort((a, b) => 
      Object.keys(blankAssignments).findIndex(k => blankAssignments[k] === a) - 
      Object.keys(blankAssignments).findIndex(k => blankAssignments[k] === b)
    );
    
    const isCorrect = JSON.stringify(userAnswer) === 
      JSON.stringify(currentQuestion.correctAnswers);
    
    setUserAnswers(prev => [...prev, {
      question: currentQuestion,
      userAnswer,
      isCorrect
    }]);
    
    if (isCorrect) setScore(prev => prev + 1);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(60);
    } else {
      navigate('/results', { state: { score, userAnswers } });
    }
  }, [currentQuestionIndex, questions, blankAssignments, navigate, score, userAnswers]);

  useEffect(() => {
    const timer = timeLeft > 0 && setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    if (timeLeft === 0) handleNextQuestion();
    
    return () => clearInterval(timer);
  }, [timeLeft, handleNextQuestion]);

  const handleWordSelect = (word) => {
    // Find all blank positions in the sentence
    const blankPositions = [];
    questions[currentQuestionIndex].sentence.split(' ').forEach((word, index) => {
      if (word.includes('______')) {
        blankPositions.push(index);
      }
    });
    
    // Find first empty blank position
    const blankPos = blankPositions.find(pos => !blankAssignments[pos]);
    
    if (blankPos !== undefined) {
      setBlankAssignments(prev => ({ ...prev, [blankPos]: word }));
      setAvailableWords(prev => prev.filter(w => w !== word));
    }
  };

  const handleWordRemove = (blankPos) => {
    const wordToRemove = blankAssignments[blankPos];
    setBlankAssignments(prev => {
      const newAssignments = { ...prev };
      delete newAssignments[blankPos];
      return newAssignments;
    });
    setAvailableWords(prev => [...prev, wordToRemove]);
  };

  const currentQuestion = questions[currentQuestionIndex] || {};
  const allBlanksFilled = Object.keys(blankAssignments).length === 
    (currentQuestion.sentence?.match(/______/g) || []).length;

  return (
    <div className="container">
      <div className="card">
        <div className="quiz-header">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span className="timer">Time Left: {timeLeft}s</span>
        </div>
        
        <div className="sentence">
          {currentQuestion.sentence?.split(' ').map((word, i) => {
            if (word.includes('______')) {
              return (
                <span 
                  key={i} 
                  className={`word-blank ${blankAssignments[i] ? 'filled' : ''}`}
                  onClick={() => blankAssignments[i] && handleWordRemove(i)}
                >
                  {blankAssignments[i] || '______'}
                </span>
              );
            }
            return <span key={i}>{word} </span>;
          })}
        </div>
        
        <div className="options-container">
          {currentQuestion.options?.map((word, i) => (
            <button
              key={i}
              className={`word-option ${!availableWords.includes(word) ? 'used' : ''}`}
              onClick={() => handleWordSelect(word)}
              disabled={!availableWords.includes(word)}
            >
              {word}
            </button>
          ))}
        </div>
        
        <button
          className="btn"
          onClick={handleNextQuestion}
          disabled={!allBlanksFilled}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;