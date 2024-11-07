# Sarangsh CORS Helper Extension

This Chrome extension helps handle CORS for the Sarangsh application when making requests to the Claude API.

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select this directory
4. The extension will be installed and active

## What it does

This extension:
- Adds necessary CORS headers to responses from api.anthropic.com
- Allows the Sarangsh application to make direct API calls
- Only affects requests to the Claude API
- No data collection or modification of requests

## Configuration

No configuration needed. The extension automatically:
- Handles CORS headers for Claude API requests
- Works with the Sarangsh application
- Doesn't affect other websites

## Security

- Extension only has access to Claude API responses
- No access to API keys or request data
- Only modifies CORS headers
- Source code is available for review

## Development

To modify the extension:
1. Edit manifest.json for permissions
2. Edit background.js for CORS handling
3. Reload the extension in Chrome
4. Test with the Sarangsh application

## Troubleshooting

If you encounter issues:
1. Check extension is enabled
2. Reload the extension
3. Clear browser cache
4. Check Chrome console for errors

## Uninstallation

1. Go to `chrome://extensions/`
2. Find "Sarangsh CORS Helper"
3. Click "Remove"
4. Confirm removal

## Alternative Solutions

If you prefer not to use this extension:
1. Use a CORS proxy service
2. Set up a server-side proxy
3. Use Cloudflare Workers
4. Configure server-side CORS headers
