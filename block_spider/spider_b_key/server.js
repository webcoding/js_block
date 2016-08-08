#! /usr/bin/env node

const http = require('http');


// == 1 ==
var accepturl = '/price';
// var accepturl = '/pricea';

var regKey = /[?]key=(.*)?/;
var getKey = function(input){
  var result = regKey.exec(input);
  return result && result[1];
}

// == 2 ==
//此处可用 key，可以写入数据库(随时在线上更新，而不像更改 url一样，需要发布)
var acceptKey = "3";


const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  var key = getKey(req.url);
  if(key == acceptKey){
    res.end('rel price\n');
  }else{
    res.end('fake price\n');
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
})
