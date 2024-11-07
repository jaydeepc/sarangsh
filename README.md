# Sarangsh - AI-Powered Call Summarizer

Sarangsh (सारांश) is an AI-powered call summarizer that uses Claude to generate comprehensive summaries of transcripts, with a focus on earnings calls and other business communications.

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
- Local API key management

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

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Visit the application at `http://localhost:5173`
2. Enter your Claude API key when prompted
   - Get your API key from [Anthropic Console](https://console.anthropic.com/)
   - The key is stored only in your browser's localStorage
   - Never sent to any server except Claude API
   - Can be removed using the "Remove API Key" button
3. Upload a PDF transcript or paste text directly
4. Select the type of call/meeting
5. Click "Generate Summary"
6. View the structured summary
7. Download the summary as PDF if needed

## API Key Security

Your Claude API key:
- Is stored only in your browser's localStorage
- Never sent to any server except Claude API
- Can be removed at any time using the "Remove API Key" button
- Is required to use the summarization feature

## CORS Handling

The application uses a reliable CORS proxy (api.allorigins.win) to handle API requests:
- No additional setup required
- Secure and reliable
- Handles all CORS headers automatically
- Free to use with reasonable rate limits

## Project Structure

```
sarangsh/
├── src/
│   ├── components/        # React components
│   │   ├── ApiKeyInput   # API key management
│   │   └── Header        # App header with logout
│   ├── pages/            # Page components
│   │   ├── Home         # Main upload page
│   │   └── Summary      # Summary display
│   └── config.js        # Configuration
├── public/              # Static assets
└── package.json         # Dependencies
```

## Technical Details

- Uses allorigins.win as CORS proxy
- Handles API requests securely
- Manages API keys locally
- Processes PDFs in browser
- Generates downloadable summaries

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
