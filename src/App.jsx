import { useState, useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Home from './pages/Home';
import Summary from './pages/Summary';
import ApiKeyInput from './components/ApiKeyInput';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sarangsh-orange"></div>
  </div>
);

function App() {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for API key in localStorage
    const storedKey = localStorage.getItem('CLAUDE_API_KEY');
    if (storedKey) {
      setApiKey(storedKey);
    }
    setIsLoading(false);
  }, []);

  const handleApiKeySubmit = (key) => {
    setApiKey(key);
  };

  // Remove API key from localStorage when it becomes invalid
  useEffect(() => {
    if (!apiKey && localStorage.getItem('CLAUDE_API_KEY')) {
      localStorage.removeItem('CLAUDE_API_KEY');
    }
  }, [apiKey]);

  // Check if summary exists for the Summary route
  const hasSummary = Boolean(localStorage.getItem('summary'));

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!apiKey) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ApiKeyInput onSubmit={handleApiKeySubmit} />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-gray-50"
        >
          <Header onLogout={() => setApiKey('')} />
          <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Home apiKey={apiKey} />} />
                <Route 
                  path="/summary" 
                  element={hasSummary ? <Summary /> : <Navigate to="/" replace />} 
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </main>
        </motion.div>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
