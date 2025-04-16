import { useNavigate } from 'react-router-dom';

const Home = ({ questions }) => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="card">
        <h1>Sentence Construction</h1>
        <p>User have to construct a sentence with random words by placing them in the correct order.</p>
        
        <div style={{ margin: '2rem 0' }}>
          <p><strong>Time Per Question:</strong> 1 minute</p>
          <p><strong>Total Questions:</strong> {questions.length}</p>
          <p><strong>Coins:</strong> 20 coins</p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem' }}>
          <button className="btn" onClick={() => navigate('/')}>Back</button>
          <button className="btn" onClick={() => navigate('/quiz')}>Start</button>
        </div>
      </div>
    </div>
  );
};

export default Home;