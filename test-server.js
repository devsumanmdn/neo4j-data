const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  // set response content
  res.write('<html><body><p>This is home Page.</p></body></html>');
  res.end();

});

server.listen(4000);
