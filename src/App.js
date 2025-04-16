import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import Quiz from './components/Quiz';
import Results from './components/Results';

function App() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/questions.json')
      .then(response => response.json())
      .then(data => {
        setQuestions(data.questions);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error loading questions:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading questions...</p>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home questions={questions} />} />
        <Route path="/quiz" element={<Quiz questions={questions} />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
}

export default App;