import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiArrowRight, FiX } from 'react-icons/fi';
import PropTypes from 'prop-types';

const getPromptForCallType = (type, content) => {
  const basePrompt = `Please provide a comprehensive summary of the following ${type} transcript. Focus on extracting and analyzing all key information, ensuring no important details are missed.

1. Executive Overview:
   Begin with a thorough 3-4 sentence overview that captures:
   - Main purpose and context of the discussion
   - Key participants and their roles
   - Primary topics covered
   - Overall tone and significance
   Then, list key points:
   - Company/Organization name and specific event details
   - Date, time, and context of the discussion
   - Major announcements or decisions made
   - Immediate implications for stakeholders

2. Key Metrics and Financial Details:
   Start with a detailed analysis of all numerical data:
   - Revenue figures and growth rates
   - Profit margins and cost analysis
   - Market share and competitive positioning
   - Year-over-year and quarter-over-quarter comparisons
   - Customer metrics and user statistics
   - Investment amounts and funding details
   - Any other quantitative data mentioned
   
3. Operational Highlights:
   Analyze operational aspects including:
   - Product launches and updates
   - Market expansion efforts
   - Technological advancements
   - Partnerships and collaborations
   - Organizational changes
   - Customer success stories
   - Operational challenges faced

4. Risk Analysis and Challenges:
   Identify and analyze:
   - Current challenges and obstacles
   - Market risks and threats
   - Competitive pressures
   - Regulatory concerns
   - Economic factors
   - Internal challenges
   - Mitigation strategies discussed

5. Strategic Initiatives:
   Detail all strategic elements:
   - Short-term objectives (0-12 months)
   - Long-term goals (1-5 years)
   - Market positioning strategy
   - Innovation and R&D plans
   - Geographic expansion plans
   - Product roadmap
   - Investment priorities

6. Financial Outlook:
   Summarize all forward-looking financial information:
   - Revenue projections
   - Profit expectations
   - Investment plans
   - Cost optimization strategies
   - Market growth expectations
   - Funding requirements
   - Capital allocation plans

7. Stakeholder Impact:
   Analyze implications for:
   - Investors and shareholders
   - Customers and users
   - Employees and workforce
   - Partners and suppliers
   - Industry ecosystem
   - Local communities
   - Regulatory bodies

8. Action Items and Next Steps:
   List concrete actions:
   - Immediate priorities (next 30 days)
   - Short-term actions (1-3 months)
   - Long-term initiatives (3+ months)
   - Follow-up meetings planned
   - Deadlines and milestones
   - Responsibility assignments
   - Success metrics

Please ensure:
- All numerical data is accurately captured
- Quotes from key speakers are included where significant
- Technical terms are explained clearly
- Context is provided for industry-specific information
- Relationships between different points are clearly shown
- Both positive and challenging aspects are balanced
- Future implications are thoroughly analyzed

Format the summary with clear headings, bullet points, and paragraphs for readability. Include any specific terminology used in the transcript while ensuring it's understandable to a general business audience.

Transcript:
${content}`;

  // Add type-specific prompting
  switch (type) {
    case 'earnings':
      return basePrompt + `

Additional Focus Areas for Earnings Call:
- Detailed breakdown of revenue streams
- Segment-wise performance analysis
- Cash flow and balance sheet highlights
- Dividend and share buyback information
- Guidance and forecasts
- Analyst question themes and management responses
- Market reaction indicators`;

    case 'interview':
      return basePrompt + `

Additional Focus Areas for Interview:
- Personal insights and opinions expressed
- Experience-based learnings shared
- Career trajectory discussions
- Industry wisdom and advice
- Leadership philosophy
- Future predictions and trends
- Personal success stories and challenges`;

    case 'meeting':
      return basePrompt + `

Additional Focus Areas for Meeting:
- Decision-making processes discussed
- Team dynamics and interactions
- Project updates and timelines
- Resource allocation discussions
- Risk assessments and mitigation plans
- Team responsibilities and assignments
- Meeting efficiency and effectiveness`;

    default:
      return basePrompt;
  }
};

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

      const prompt = getPromptForCallType(callType, content);

      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey,
          prompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to generate summary');
      }

      const data = await response.json();
      const summary = data.content[0].text;
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

Home.propTypes = {
  apiKey: PropTypes.string.isRequired
};

export default Home;
