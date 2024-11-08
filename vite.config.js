import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fetch from 'node-fetch';
import https from 'https';

const agent = new https.Agent({
  rejectUnauthorized: false
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-response-headers',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url === '/api/claude') {
            if (req.method === 'OPTIONS') {
              res.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, x-api-key, anthropic-version',
                'Access-Control-Max-Age': '86400'
              });
              res.end();
              return;
            }

            if (req.method === 'POST') {
              try {
                const bodyText = await new Promise((resolve, reject) => {
                  let body = '';
                  req.on('data', chunk => {
                    body += chunk.toString();
                  });
                  req.on('end', () => resolve(body));
                  req.on('error', reject);
                });

                const body = JSON.parse(bodyText);
                const apiKey = req.headers['x-api-key'];

                if (!apiKey) {
                  res.writeHead(400, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                  });
                  res.end(JSON.stringify({ error: 'API key is required' }));
                  return;
                }

                try {
                  console.log('Making request to Anthropic API...');
                  console.log('Request headers:', {
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                  });

                  const response = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-Api-Key': apiKey,
                      'anthropic-version': '2023-06-01'
                    },
                    body: JSON.stringify({
                      model: body.model,
                      max_tokens: body.max_tokens,
                      messages: body.messages
                    }),
                    agent,
                    timeout: 60000 // 60 second timeout
                  });

                  console.log('Anthropic API response status:', response.status);
                  const data = await response.json();
                  
                  if (!response.ok) {
                    console.error('API error response:', data);
                    throw new Error(data.error?.message || 'API request failed');
                  }

                  console.log('Anthropic API response:', JSON.stringify(data, null, 2));

                  res.writeHead(response.status, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                  });
                  res.end(JSON.stringify(data));
                } catch (error) {
                  console.error('API Error:', error);
                  const status = error.status || 500;
                  const message = error.message || 'Failed to process request';
                  
                  res.writeHead(status, { 
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                  });
                  res.end(JSON.stringify({ 
                    error: 'API request failed',
                    details: message
                  }));
                }
              } catch (error) {
                console.error('Request processing error:', error);
                res.writeHead(500, { 
                  'Content-Type': 'application/json',
                  'Access-Control-Allow-Origin': '*'
                });
                res.end(JSON.stringify({ 
                  error: 'Failed to process request',
                  details: error.message 
                }));
              }
              return;
            }

            res.writeHead(405, { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(JSON.stringify({ error: 'Method not allowed' }));
            return;
          }
          next();
        });
      }
    }
  ],
  build: {
    sourcemap: true,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: {
          pdfjsLib: ['pdfjs-dist/legacy/build/pdf']
        }
      }
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist/legacy/build/pdf']
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true
  }
});
