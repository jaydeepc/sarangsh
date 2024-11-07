import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Summary from './pages/Summary';
import ApiKeyInput from './components/ApiKeyInput';

function App() {
  const [apiKey, setApiKey] = useState(localStorage.getItem('CLAUDE_API_KEY') || '');

  const handleApiKeySubmit = (key) => {
    setApiKey(key);
  };

  // Remove API key from localStorage when it becomes invalid
  useEffect(() => {
    if (!apiKey && localStorage.getItem('CLAUDE_API_KEY')) {
      localStorage.removeItem('CLAUDE_API_KEY');
    }
  }, [apiKey]);

  if (!apiKey) {
    return <ApiKeyInput onSubmit={handleApiKeySubmit} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header onLogout={() => setApiKey('')} />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home apiKey={apiKey} />} />
            <Route path="/summary" element={<Summary />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
