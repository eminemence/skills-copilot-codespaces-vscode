// create web server
// 1. load modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
// 2. create server
var server = http.createServer(function (request, response) {
    // request: client -> server
    // response: server -> client

    // 3. parsing url
    var parsedUrl = url.parse(request.url, true);
    var query = parsedUrl.query;
    var pathname = parsedUrl.pathname;

    if (pathname === '/') {
        // 4. read html file
        fs.readFile('index.html', 'utf-8', function (error, data) {
            // 5. response html
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        });
    } else if (pathname === '/create') {
        fs.readFile('create.html', 'utf-8', function (error, data) {
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        });
    } else if (pathname === '/create_process') {
        var body = '';
        request.on('data', function (data) {
            body += data;
        }
        );
}

});
// 6. listen port
server.listen(3000);

