# Sarangsh - AI-Powered Call Summarizer

Sarangsh (सारांश) is an AI-powered call summarizer that uses Claude to generate comprehensive summaries of transcripts, with a focus on earnings calls and other business communications.

## ⚠️ Important Security Note

Never commit your actual API keys to the repository. The `.env.example` file contains only placeholder values. Always:
1. Keep your actual API keys in `.env` (which is gitignored)
2. Use environment variables in Vercel for deployment
3. Never share or expose your API keys in public repositories

## Features

- PDF transcript upload support
- Direct text input option
- Structured summaries with:
  - Executive Overview
  - Key Highlights
  - Critical Analysis
  - Forward-Looking Insights
  - Action Items
- Clean, modern UI with orange gradient theme
- PDF download functionality
- Responsive design
- Serverless architecture with Edge Functions

## Tech Stack

- React + Vite
- Tailwind CSS
- Claude AI API
- Vercel Edge Functions
- Framer Motion
- PDF generation

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sarangsh.git
cd sarangsh
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Then edit `.env` with your actual Claude API key. Never commit this file!

4. Start the development server:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file with the following variable:

```env
VITE_CLAUDE_API_KEY=your-claude-api-key-here
```

⚠️ Remember:
- Never commit the `.env` file
- Keep your API keys secret
- Use environment variables in production
- Don't expose keys in client-side code

## Usage

1. Access the application at `http://localhost:5173`
2. Upload a PDF transcript or paste text directly
3. Select the type of call/meeting
4. Click "Generate Summary"
5. View the structured summary with key insights
6. Download the summary as PDF if needed

## Project Structure

```
sarangsh/
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── api/                  # Vercel Edge Functions
├── public/              # Static assets
└── package.json         # Dependencies and scripts
```

## Deployment to Vercel

1. Fork or clone this repository
2. Create a new project on Vercel
3. Connect your repository
4. Set up environment variables:
   - Go to Project Settings > Environment Variables
   - Add `CLAUDE_API_KEY` with your API key
   - Never expose this key in your code or repository
5. Deploy!

The application uses Vercel Edge Functions to handle API requests securely. The Edge Function:
- Proxies requests to Claude API
- Handles CORS
- Protects your API key
- Provides low-latency responses

## Security Best Practices

1. API Key Protection:
   - Never commit API keys to the repository
   - Use environment variables
   - Keep `.env` in .gitignore
   - Use secure key management in production

2. Edge Function Security:
   - API keys stored securely in Vercel
   - Requests proxied through Edge Function
   - CORS handled properly
   - Rate limiting implemented

## API Routes

- `/api/summarize` - POST endpoint for generating summaries
  - Accepts JSON payload with transcript content
  - Returns structured summary from Claude API
  - Handles both PDF and text input

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
