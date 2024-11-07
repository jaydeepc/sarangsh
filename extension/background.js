chrome.webRequest.onHeadersReceived.addListener(
  function(details) {
    const headers = details.responseHeaders;
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].name.toLowerCase() === 'access-control-allow-origin') {
        headers[i].value = '*';
        break;
      }
    }
    headers.push({
      name: 'Access-Control-Allow-Origin',
      value: '*'
    });
    headers.push({
      name: 'Access-Control-Allow-Methods',
      value: 'GET, POST, OPTIONS'
    });
    headers.push({
      name: 'Access-Control-Allow-Headers',
      value: 'Content-Type, Authorization, x-api-key, anthropic-version'
    });
    return { responseHeaders: headers };
  },
  {
    urls: ['https://api.anthropic.com/*']
  },
  ['responseHeaders', 'extraHeaders']
);
