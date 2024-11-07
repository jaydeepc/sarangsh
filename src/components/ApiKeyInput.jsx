import { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const ApiKeyInput = ({ onSubmit }) => {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!apiKey.trim()) {
      setError('Please enter your Claude API key');
      return;
    }
    if (!apiKey.startsWith('sk-ant-')) {
      setError('Invalid API key format. Claude API keys start with "sk-ant-"');
      return;
    }
    
    // Store in localStorage and notify parent
    localStorage.setItem('CLAUDE_API_KEY', apiKey);
    onSubmit(apiKey);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-8"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold bg-gradient-orange text-transparent bg-clip-text mb-6">
          Welcome to सारांश
        </h2>
        <p className="text-gray-600 mb-8">
          To get started, please enter your Claude API key. Your key will be stored locally and used only for making API calls to generate summaries.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 mb-2">Claude API Key</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError('');
              }}
              placeholder="sk-ant-..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sarangsh-orange focus:border-transparent"
            />
            {error && (
              <p className="mt-2 text-red-600 text-sm">{error}</p>
            )}
          </div>

          <div className="text-sm text-gray-500">
            <p>Your API key:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Is stored only in your browser</li>
              <li>Never sent to any server except Claude API</li>
              <li>Can be removed by clearing browser data</li>
              <li>Is required to use the summarization feature</li>
            </ul>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-6 bg-gradient-orange text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get Started
          </button>
        </form>
      </div>
    </motion.div>
  );
};

ApiKeyInput.propTypes = {
  onSubmit: PropTypes.func.isRequired
};

export default ApiKeyInput;
