import { useLocation, useNavigate } from 'react-router-dom';

const Results = () => {
  const { state } = useLocation();
  const { score = 0, userAnswers = [] } = state || {};
  const navigate = useNavigate();

  const getFeedback = () => {
    if (score >= 8) return "Impressive! Your skills are shining through.";
    if (score >= 5) return "Good job! Keep practicing!";
    return "Keep trying! You can do better!";
  };

  return (
    <div className="container">
      <div className="card results-container">
        <h1>Overall Score</h1>
        <div className="score">{score}/10</div>
        <p className="feedback">{getFeedback()}</p>
        <p>Keep up the excellent work, you're doing great.</p>
        
        {userAnswers.map((answer, index) => (
          <div key={index} className={`result-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
            <p><strong>Question {index + 1}:</strong> {answer.question.sentence}</p>
            <p>Your answer: {answer.userAnswer.join(', ')}</p>
            {!answer.isCorrect && (
              <p className="correct-answer">
                Correct answer: {answer.question.correctAnswers.join(', ')}
              </p>
            )}
          </div>
        ))}
        
        <button 
          className="btn" 
          style={{ marginTop: '2rem' }}
          onClick={() => navigate('/home')}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default Results;