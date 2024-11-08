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
      if (!config.validation.isValidFileType(selectedFile.type)) {
        setError(config.ERRORS.INVALID_FILE_TYPE);
        return;
      }
      if (!config.validation.isValidFileSize(selectedFile.size)) {
        setError(config.ERRORS.FILE_TOO_LARGE);
        return;
      }
      setFile(selectedFile);
      setText(''); // Clear text input when PDF is uploaded
      setError('');
    }
  };

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    handleFileSelection(uploadedFile);
  };

  const handleTextInput = (e) => {
    setText(e.target.value);
    setFile(null); // Clear file when text is entered
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
      reader.onerror = () => reject(new Error(config.ERRORS.READ_FILE_ERROR));
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate input
      if (!text.trim() && !file) {
        throw new Error(config.ERRORS.NO_CONTENT);
      }

      // Validate API key
      if (!config.validation.isValidApiKey(apiKey)) {
        throw new Error(config.ERRORS.INVALID_API_KEY);
      }

      let content = '';
      
      if (file) {
        try {
          content = await readFileAsText(file);
        } catch {
          throw new Error(config.ERRORS.READ_FILE_ERROR);
        }
      } else {
        content = text.trim();
      }

      // Validate content length
      if (!config.validation.isValidContentLength(content.length)) {
        throw new Error(
          content.length < config.SETTINGS.MIN_CONTENT_LENGTH 
            ? config.ERRORS.CONTENT_TOO_SHORT 
            : config.ERRORS.CONTENT_TOO_LONG
        );
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), config.SETTINGS.API_TIMEOUT);

      try {
        const response = await fetch(config.API_CONFIG.ENDPOINT, {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': config.API_CONFIG.API_VERSION
          },
          body: JSON.stringify({
            model: config.API_CONFIG.MODEL,
            max_tokens: config.API_CONFIG.MAX_TOKENS,
            temperature: config.API_CONFIG.TEMPERATURE,
            messages: [
              {
                role: 'user',
                content: `Please analyze this ${callType} transcript and provide a comprehensive summary with the following EXACT structure. Include ALL numbers, quotes, and specific details mentioned:

1. EXECUTIVE OVERVIEW
   A. Event Information
      • Event type and purpose
      • Date and time
      • Duration
      • Platform/venue
   
   B. Participants
      • List all speakers with full names and titles
      • Key attendees mentioned
      • Host/moderator details

   C. Key Announcements
      • Major decisions announced
      • Significant changes
      • Important updates
      • Critical numbers shared

2. DETAILED METRICS
   A. Financial Data
      • Revenue figures (with % changes)
      • Profit/margins
      • Growth rates
      • Market share
      • Stock performance

   B. Operational Numbers
      • Customer metrics
      • Production/efficiency data
      • Market penetration
      • Geographic presence

3. IMPORTANT QUOTES
   Format: "Quote text" - Speaker Name, Title
   Include 4-5 most significant quotes about:
   • Strategic decisions
   • Financial results
   • Future plans
   • Market position

4. STRATEGIC UPDATES
   A. Current Initiatives
      • Ongoing projects
      • Recent launches
      • Market expansion
      • Partnerships

   B. Future Plans
      • Upcoming launches
      • Growth targets
      • Investment plans
      • Market strategies

5. ANALYSIS
   A. Performance Review
      • Strengths highlighted
      • Challenges faced
      • Market position
      • Competitive analysis

   B. Risk Factors
      • Market challenges
      • Competitive threats
      • Operational risks
      • Regulatory concerns

6. ACTION ITEMS
   A. Short-term (Next 90 Days)
      • Immediate priorities
      • Specific deadlines
      • Assigned responsibilities
      • Expected outcomes

   B. Long-term
      • Strategic goals
      • Development plans
      • Growth targets
      • Vision alignment

IMPORTANT GUIDELINES:
1. Use bullet points consistently
2. Include ALL numerical data
3. Quote speakers directly for important statements
4. Maintain exact section structure
5. Don't skip any section
6. Provide context for industry terms

Transcript to analyze:

${content}`
              }
            ]
          })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error?.message || config.ERRORS.API_ERROR);
        }

        const data = await response.json();
        
        if (!data.content?.[0]?.text?.trim()) {
          throw new Error(config.ERRORS.SUMMARY_EMPTY);
        }

        localStorage.setItem('summary', data.content[0].text);
        navigate('/summary');
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timed out. Please try again.');
        }
        throw error;
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || config.ERRORS.API_ERROR);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      {...config.ANIMATIONS.PAGE_TRANSITION}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Transform Your Calls into Clear Summaries
        </h2>
        
        {error && (
          <motion.div 
            {...config.ANIMATIONS.ERROR_ANIMATION}
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
