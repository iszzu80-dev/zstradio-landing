'use strict';
var http = require('http');
var fs = require('fs');
var path = require('path');

var PORT = process.env.PORT || 3000;
var HOST = process.env.HOST || '0.0.0.0';
var ROOT = __dirname;

function send(res, status, body, mime) {
  res.writeHead(status, {
    'Content-Type': mime || 'text/html; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  });
  res.end(body);
}

function readFile(filePath) {
  try { return fs.readFileSync(filePath, 'utf8'); } catch (e) { return null; }
}

http.createServer(function (req, res) {
  var u;
  try { u = new URL(req.url, 'http://localhost'); } catch (_) { send(res, 400, 'Bad Request'); return; }
  var pathname = u.pathname;

  if (req.method === 'GET') {
    if (pathname === '/' || pathname === '/index.html') {
      var lp = readFile(path.join(ROOT, 'index.html'));
      if (!lp) { send(res, 500, 'Landing page not found'); return; }
      send(res, 200, lp); return;
    }
    send(res, 404, '<h1>404</h1>'); return;
  }

  send(res, 405, 'Method Not Allowed');
}).listen(PORT, HOST, function () {
  console.log('ZST Radio landing: http://' + HOST + ':' + PORT);
});
