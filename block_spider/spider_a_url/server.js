#! /usr/bin/env node

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;


// == 1 ==
var accepturl = '/price';
// var accepturl = '/pricea';

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  if(req.url === accepturl){
    res.end('rel price\n');
  }else{
    res.end('fake price\n');
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
})
