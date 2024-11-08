import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUpload, FiArrowRight, FiX } from 'react-icons/fi';
import PropTypes from 'prop-types';

const getPromptForCallType = (type, content) => {
  const basePrompt = `You are a highly skilled analyst tasked with creating a detailed, structured summary of the following ${type} transcript. Extract and organize ALL important information, ensuring no key details are missed. Present the information in the following consistent format:

1. EXECUTIVE OVERVIEW
   A. Event Details:
      • Full event name and type
      • Date and time
      • Host organization/company
      • Platform/venue used
      • Duration of event

   B. Key Participants:
      • List all speakers with their full names and titles
      • Moderator/host details
      • Notable attendees mentioned

   C. Main Highlights (3-4 bullet points):
      • Most significant announcements
      • Key decisions made
      • Major changes announced
      • Critical updates shared

2. DETAILED METRICS AND NUMBERS
   A. Financial Figures:
      • Revenue numbers (with % changes)
      • Profit/loss figures
      • Margins and ratios
      • Market share data
      • Stock/share related figures

   B. Operational Metrics:
      • Customer/user numbers
      • Growth statistics
      • Market penetration data
      • Efficiency metrics
      • Performance indicators

   C. Industry Benchmarks:
      • Competitive comparisons
      • Market position data
      • Industry-specific metrics

3. KEY ANNOUNCEMENTS AND UPDATES
   A. Strategic Initiatives:
      • New projects launched
      • Strategic partnerships
      • Market expansion plans
      • Product/service launches

   B. Organizational Changes:
      • Leadership changes
      • Structural modifications
      • Team updates
      • Policy changes

   C. Market and Competition:
      • Competitive landscape changes
      • Market trends discussed
      • Industry challenges mentioned
      • Regulatory updates

4. FINANCIAL ANALYSIS
   A. Performance Review:
      • Detailed breakdown of financial results
      • Segment-wise performance
      • Regional performance
      • Cost structure analysis

   B. Future Projections:
      • Guidance provided
      • Growth targets
      • Investment plans
      • Expected challenges

5. STAKEHOLDER IMPACT
   A. For Investors:
      • Return projections
      • Risk factors
      • Investment opportunities
      • Capital allocation plans

   B. For Customers:
      • Product/service changes
      • Pricing updates
      • Service improvements
      • Support initiatives

   C. For Employees:
      • Organizational changes
      • Policy updates
      • Growth opportunities
      • Cultural initiatives

6. NOTABLE QUOTES AND STATEMENTS
   Format each quote as: "Quote text" - Speaker Name, Title
   Include 4-5 most significant quotes that:
   • Announce major changes
   • Provide strategic insight
   • Address key concerns
   • Share future vision

7. RISK FACTORS AND CHALLENGES
   A. Current Challenges:
      • Operational issues
      • Market challenges
      • Competition
      • Resource constraints

   B. Future Risks:
      • Potential threats
      • Market uncertainties
      • Regulatory concerns
      • Technology risks

8. ACTION ITEMS AND NEXT STEPS
   A. Immediate Actions (Next 30 Days):
      • List specific tasks
      • Assigned responsibilities
      • Expected outcomes
      • Deadlines

   B. Short-term Plans (1-6 Months):
      • Strategic initiatives
      • Project milestones
      • Expected developments
      • Follow-up events

   C. Long-term Objectives:
      • Strategic goals
      • Growth targets
      • Development plans
      • Vision alignment

IMPORTANT GUIDELINES:
1. Maintain consistent formatting throughout
2. Use bullet points for lists and key points
3. Include specific numbers and percentages wherever mentioned
4. Quote speakers directly when sharing important information
5. Provide context for industry-specific terms
6. Highlight year-over-year or quarter-over-quarter comparisons
7. Include ALL numerical data mentioned
8. Specify exact dates and timeframes when mentioned

Transcript to analyze:
${content}`;

  // Add type-specific analysis requirements
  switch (type) {
    case 'earnings':
      return basePrompt + `

ADDITIONAL EARNINGS CALL REQUIREMENTS:
1. Detailed financial metrics:
   • EPS figures and changes
   • Revenue breakdown by segment
   • Gross and operating margins
   • Cash flow details
   • Balance sheet highlights

2. Analyst Questions:
   • List key questions asked
   • Management responses
   • Follow-up clarifications
   • Unaddressed concerns

3. Market Response:
   • Stock price impact
   • Trading volume
   • Analyst reactions
   • Market sentiment changes`;

    case 'interview':
      return basePrompt + `

ADDITIONAL INTERVIEW REQUIREMENTS:
1. Personal Background:
   • Career history
   • Key achievements
   • Educational background
   • Personal philosophy

2. Leadership Insights:
   • Management style
   • Decision-making approach
   • Team building strategies
   • Crisis management experience

3. Industry Perspective:
   • Market trends analysis
   • Future predictions
   • Technology impact
   • Innovation views`;

    case 'meeting':
      return basePrompt + `

ADDITIONAL MEETING REQUIREMENTS:
1. Meeting Dynamics:
   • Discussion flow
   • Participation levels
   • Decision-making process
   • Conflict resolution

2. Project Updates:
   • Status reports
   • Timeline changes
   • Resource allocation
   • Risk assessments

3. Team Interaction:
   • Collaboration points
   • Task assignments
   • Communication patterns
   • Follow-up responsibilities`;

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
