import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiArrowRight, FiX } from 'react-icons/fi';
import axios from 'axios';

const Home = () => {
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
        setText(''); // Clear text input when PDF is uploaded
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
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let content = '';
      
      if (file) {
        content = await readFileAsText(file);
      } else if (text.trim()) {
        content = text;
      } else {
        setError('Please provide either text or upload a PDF file');
        setIsLoading(false);
        return;
      }

      const prompt = `Please analyze the following ${callType} transcript and provide a comprehensive summary in the following structured format:

1. Executive Overview:
   First, provide a 2-3 sentence overview paragraph that captures the essence of the discussion.
   Then, list key points:
   - Include company name and event context
   - Highlight 2-3 most significant announcements or outcomes
   - Note any immediate impact or implications

2. Key Highlights:
   Start with a brief paragraph summarizing the main achievements and metrics.
   Follow with specific points:
   - List 3-4 most important metrics or achievements
   - Include specific numbers, percentages, and growth figures
   - Highlight year-over-year or quarter-over-quarter comparisons
   - Note any records or milestones reached

3. Critical Analysis:
   Begin with a paragraph analyzing overall performance and trends.
   Then detail specific observations:
   - Analyze key performance indicators and their implications
   - Identify major challenges or opportunities
   - Compare with industry benchmarks or previous periods
   - Note any significant market factors or external influences

4. Forward-Looking Insights:
   Provide a paragraph outlining the future direction and strategy.
   Follow with specific plans:
   - List concrete goals and targets
   - Include specific timelines and milestones
   - Note any strategic initiatives or changes
   - Highlight potential opportunities and challenges ahead

5. Action Items:
   Start with a brief paragraph summarizing key next steps.
   Then list specific actions:
   - Identify 2-3 immediate action items
   - Include specific deadlines or timeframes
   - Note any required follow-ups or dependencies
   - Highlight priority items

Please format each section clearly with both paragraph and bullet point components. Keep the language professional and concise, focusing on the most impactful information.

Transcript:
${content}`;

      const response = await axios.post('/api/summarize', {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      const summary = response.data.content[0].text;
      localStorage.setItem('summary', summary);
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
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
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
            <span>Processing...</span>
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

export default Home;
