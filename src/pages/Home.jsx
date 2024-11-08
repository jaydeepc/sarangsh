import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiArrowRight } from 'react-icons/fi';
import PropTypes from 'prop-types';
import { config } from '../config';
import * as pdfjsLib from 'pdfjs-dist';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

  const readPdfFile = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map(item => item.str)
          .join(' ')
          .replace(/\s+/g, ' ');
        fullText += pageText + '\n\n';
      }
      
      if (!fullText.trim()) {
        throw new Error('No readable text found in PDF. Please try copying and pasting the text directly.');
      }
      
      return fullText;
    } catch (err) {
      console.error('Error reading PDF:', err);
      throw new Error('Failed to read PDF file. Please try copying and pasting the text directly.');
    }
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
        content = await readPdfFile(file);
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
              content: `Analyze this ${callType} transcript and provide a detailed summary. For each major section:

1. Start with a brief 1-2 sentence overview that captures the key message
2. Then provide detailed bullet points with specific information, numbers, and quotes

Make sure to organize the information into clear sections like:
- Financial Performance
- Business Highlights
- Strategic Updates
- Market Outlook
- Key Metrics

Here's the transcript:

${content}`
            }
          ]
        })
      });

      let data;
      try {
        const responseText = await response.text();
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Response parsing error:', parseError);
        throw new Error('Invalid response from server');
      }

      if (!response.ok) {
        console.error('API error response:', data);
        throw new Error(data.error?.details || data.error?.message || 'Failed to generate summary');
      }
      
      if (!data.content?.[0]?.text) {
        console.error('Invalid API response structure:', data);
        throw new Error('Invalid response format from API');
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
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50">
      <div className="relative">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-sarangsh-light opacity-20 rounded-bl-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-sarangsh opacity-10 rounded-tr-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-20 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-sarangsh text-transparent bg-clip-text mb-4">
            Transform Your Documents
          </h1>
          <p className="text-gray-600 text-xl">
            Upload your transcript and get a detailed summary in seconds
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 relative overflow-hidden"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 rounded-xl border border-red-100"
            >
              <div className="text-red-600">
                {error}
              </div>
            </motion.div>
          )}

          <div className="mb-8">
            <label className="block text-gray-700 mb-2 font-medium">Document Type</label>
            <select
              value={callType}
              onChange={(e) => setCallType(e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sarangsh/20 focus:border-sarangsh transition-all duration-300"
            >
              <option value="earnings">Earnings Call</option>
              <option value="interview">Interview</option>
              <option value="meeting">Meeting</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 mb-2 font-medium">Upload PDF Transcript</label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative flex items-center justify-center w-full h-48 ${
                dragActive ? 'border-sarangsh bg-sarangsh/5' : 'border-gray-200'
              } ${
                file ? 'bg-sarangsh/5' : 'bg-white'
              } border-2 border-dashed rounded-xl transition-colors duration-300 group hover:border-sarangsh hover:bg-sarangsh/5`}
            >
              <label className="flex flex-col items-center cursor-pointer">
                <FiUpload className={`w-10 h-10 ${file ? 'text-sarangsh' : 'text-gray-400'} group-hover:text-sarangsh transition-colors duration-300`} />
                <span className="mt-4 text-sm text-gray-500">
                  {file ? file.name : 'Click or drag to upload a PDF file'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".pdf"
                />
              </label>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-gray-700 mb-2 font-medium">Or Paste Transcript</label>
            <textarea
              value={text}
              onChange={handleTextInput}
              className="w-full h-64 p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-sarangsh/20 focus:border-sarangsh transition-all duration-300"
              placeholder="Paste your transcript here..."
              disabled={file !== null}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={(!text.trim() && !file) || isLoading}
            className="w-full py-4 px-6 bg-gradient-sarangsh text-white rounded-xl font-semibold flex items-center justify-center space-x-2 hover:shadow-glow transition-all duration-300 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>Generating Summary...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span>Generate Summary</span>
                <FiArrowRight />
              </div>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

Home.propTypes = {
  apiKey: PropTypes.string.isRequired
};

export default Home;
