import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import multer from 'multer';
import PDFParser from 'pdf2json';

dotenv.config();

const app = express();
const PORT = 4000;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

const parsePDF = (pdfBuffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      try {
        const text = decodeURIComponent(pdfData.Pages.map(page => 
          page.Texts.map(text => text.R.map(r => r.T).join(' ')).join(' ')
        ).join('\n'));
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to parse PDF content: ' + error.message));
      }
    });

    pdfParser.on('pdfParser_dataError', (error) => {
      reject(new Error('PDF parsing error: ' + error.message));
    });

    try {
      pdfParser.parseBuffer(pdfBuffer);
    } catch (error) {
      reject(new Error('Failed to start PDF parsing: ' + error.message));
    }
  });
};

app.post('/api/summarize/pdf', upload.single('file'), async (req, res) => {
  console.log('PDF route hit');
  try {
    if (!req.file) {
      console.log('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const apiKey = req.headers.authorization?.split(' ')[1];
    if (!apiKey) {
      console.log('No API key provided');
      return res.status(401).json({ error: 'No API key provided' });
    }

    console.log('Parsing PDF content...');
    const text = await parsePDF(req.file.buffer);
    console.log('PDF parsed successfully, text length:', text.length);
    
    const callType = req.body.callType || 'general';
    console.log('Call type:', callType);

    const prompt = `Please analyze the following ${callType} transcript and provide a comprehensive summary in the following structured format. For each section, provide both a concise paragraph overview and key bullet points:

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

Format each section clearly with both paragraph and bullet point components. Keep the language professional and concise, focusing on the most impactful information. Ensure all numerical data and metrics are clearly presented.

Transcript:
${text}`;

    console.log('Making request to Claude API...');
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    console.log('Received response from Claude API');
    const summary = response.data.content[0].text;
    res.json({ summary });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to process PDF and generate summary',
      details: error.message 
    });
  }
});

app.post('/api/summarize/text', async (req, res) => {
  try {
    const { prompt: userPrompt } = req.body;
    const apiKey = req.headers.authorization?.split(' ')[1];

    if (!apiKey) {
      return res.status(401).json({ error: 'No API key provided' });
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    console.log('Received response from Claude API');
    const summary = response.data.content[0].text;
    res.json({ summary });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`CORS enabled for origin: http://localhost:5173`);
});
