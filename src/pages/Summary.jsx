import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';

const Summary = () => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedSummary = localStorage.getItem('summary');
    if (!savedSummary) {
      setError('No summary found');
      setLoading(false);
      return;
    }

    try {
      setSummary(savedSummary);
      setLoading(false);
    } catch (err) {
      console.error('Error loading summary:', err);
      setError('Failed to load summary');
      setLoading(false);
    }
  }, [navigate]);

  const formatSummary = (text) => {
    if (!text) return null;

    // Split into sections by double newlines
    const sections = text.split('\n\n').filter(Boolean);
    
    // First section is always the overview
    const [overview, ...restSections] = sections;

    return (
      <>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-gradient-sarangsh rounded-3xl p-10 relative overflow-hidden shadow-glow">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-bl-full" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-tr-full" />
            <div className="relative">
              <p className="text-xl text-white leading-relaxed">
                {overview}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {restSections.map((section, index) => {
            const titleMatch = section.match(/^([^:]+):(.*)/s);
            
            if (!titleMatch) return null;

            const [, title, content] = titleMatch;
            
            // Split content into overview and bullet points
            const parts = content.split('\n-');
            const overview = parts[0].trim();
            const bullets = parts.slice(1).map(point => point.trim()).filter(Boolean);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 relative overflow-hidden shadow-xl hover:shadow-glow transition-all duration-500 border border-white/20"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-sarangsh opacity-10 rounded-bl-full" />
                <div className="relative">
                  <h2 className="text-2xl font-bold bg-gradient-sarangsh text-transparent bg-clip-text mb-6">
                    {title.trim()}
                  </h2>
                  
                  {/* Section Overview */}
                  {overview && (
                    <div className="overview-text">
                      {overview}
                    </div>
                  )}
                  
                  {/* Bullet Points */}
                  {bullets.length > 0 && (
                    <ul className="space-y-4">
                      {bullets.map((point, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: (index * 0.1) + (i * 0.05) }}
                          className="flex items-start space-x-3 group"
                        >
                          <span className="w-2 h-2 bg-gradient-sarangsh rounded-sm mt-2 flex-shrink-0 transform rotate-45 group-hover:scale-125 transition-transform duration-300" />
                          <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                            {point}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-white to-gray-50">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-sarangsh opacity-20 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-sarangsh/20" />
            <div className="absolute inset-0 rounded-full border-4 border-sarangsh border-t-transparent animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-50">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-xl border border-red-100">
          <div className="text-red-600 font-medium text-lg">{error}</div>
        </div>
        <Link to="/" className="mt-8 text-gray-600 hover:text-sarangsh transition-colors">
          <FiArrowLeft className="inline-block mr-2" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-sarangsh-light opacity-20 rounded-bl-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-sarangsh opacity-10 rounded-tr-full blur-3xl" />
      </div>

      <Link to="/" className="fixed top-6 left-6 z-50 flex items-center space-x-2 text-gray-600 hover:text-sarangsh transition-colors">
        <FiArrowLeft className="w-5 h-5" />
        <span>Back</span>
      </Link>

      <div className="max-w-7xl mx-auto px-6 py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-5xl font-bold bg-gradient-sarangsh text-transparent bg-clip-text mb-4">
            Executive Summary
          </h1>
          <div className="h-1 w-32 bg-gradient-sarangsh rounded-full opacity-50" />
        </motion.div>

        {formatSummary(summary)}
      </div>
    </div>
  );
};

export default Summary;
