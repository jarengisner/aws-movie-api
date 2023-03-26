//Variable Declarations for importing HTTP, URL, and File System Modules//

const http = require('http'),
  fs = require('fs'),
  url = require('url');

http
  .createServer((request, response) => {
    let addr = request.url;
    let filePath = '';
    q = url.parse(addr, true);

    fs.appendFile(
      __dirname + '/activity-log.txt',
      'URL: ' + addr + '\nTimestamp: ' + new Date() + '\n\n',
      (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Added to log.');
        }
      }
    );

    if (q.pathname.includes('documentation')) {
      filePath = __dirname + '/documentation.html';
    } else {
      filePath = __dirname + '/index.html';
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        throw err;
      }

      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write(data);
      response.end();
    });
  })
  .listen(8080);
console.log('Server is being hosted on local host 8080');
