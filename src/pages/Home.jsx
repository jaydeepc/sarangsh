import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiArrowRight, FiX } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { config } from '../config';

const Home = ({ apiKey }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [callType, setCallType] = useState('earnings');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    handleFileSelection(droppedFile);
  };

  const handleFileSelection = (selectedFile) => {
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf') {
        if (selectedFile.size > 10 * 1024 * 1024) {
          setError('File size must be less than 10MB');
          return;
        }
        setFile(selectedFile);
        setText('');
        setError('');
      } else {
        setError('Please upload a PDF file');
      }
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    handleFileSelection(uploadedFile);
  };

  const handleTextInput = (e) => {
    setText(e.target.value);
    setFile(null);
    setError('');
  };

  const clearFile = () => {
    setFile(null);
    setError('');
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (!text.trim() && !file) {
        throw new Error('Please provide either text or upload a PDF file');
      }

      let content = '';
      
      if (file) {
        try {
          content = await readFileAsText(file);
        } catch {
          throw new Error('Failed to read PDF file');
        }
      } else {
        content = text.trim();
      }

      const response = await fetch(config.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': config.API_VERSION
        },
        body: JSON.stringify({
          model: config.MODEL,
          max_tokens: config.MAX_TOKENS,
          messages: [
            {
              role: 'user',
              content: `Analyze this ${callType} transcript and provide a detailed summary. Extract ALL important information including numbers, quotes, and specific details:

${content}`
            }
          ]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate summary');
      }

      const data = await response.json();
      
      if (!data.content?.[0]?.text) {
        throw new Error('Invalid response from API');
      }

      localStorage.setItem('summary', data.content[0].text);
      navigate('/summary');
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Transform Your Calls into Clear Summaries
        </h2>
        
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="text-red-600 font-medium">Error</div>
            <div className="text-red-500">{error}</div>
          </motion.div>
        )}

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Call Type</label>
          <select
            value={callType}
            onChange={(e) => setCallType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sarangsh-orange focus:border-transparent"
          >
            <option value="earnings">Earnings Call</option>
            <option value="interview">Interview</option>
            <option value="meeting">Meeting</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Upload PDF Transcript</label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative flex items-center justify-center w-full ${
              dragActive ? 'border-sarangsh-orange bg-orange-50' : 'border-gray-300'
            } ${
              file ? 'bg-orange-50' : 'bg-white'
            } border-2 border-dashed rounded-lg p-6 transition-colors`}
          >
            <label className="flex flex-col items-center cursor-pointer">
              <FiUpload className={`w-8 h-8 ${file ? 'text-sarangsh-orange' : 'text-gray-400'}`} />
              <span className="mt-2 text-sm text-gray-500">
                {file ? file.name : 'Click or drag to upload a PDF file'}
              </span>
              <input
                type="file"
                className="hidden"
                onChange={handleFileUpload}
                accept=".pdf"
              />
            </label>
            {file && (
              <button
                onClick={clearFile}
                className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-full"
              >
                <FiX className="w-5 h-5 text-red-500" />
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Or Paste Transcript</label>
          <textarea
            value={text}
            onChange={handleTextInput}
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sarangsh-orange focus:border-transparent"
            placeholder="Paste your transcript here..."
            disabled={file !== null}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={(!text.trim() && !file) || isLoading}
          className="w-full py-4 px-6 bg-gradient-orange text-white rounded-lg font-semibold flex items-center justify-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              <span>Generating Summary...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span>Generate Summary</span>
              <FiArrowRight />
            </div>
          )}
        </button>
      </div>
    </motion.div>
  );
};

Home.propTypes = {
  apiKey: PropTypes.string.isRequired
};

export default Home;
