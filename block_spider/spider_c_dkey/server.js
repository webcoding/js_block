#! /usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;


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
// var acceptKey = "3";

// == 3 ==
// 以上方法，要不断调整，手工处理，还是不够好，可以使用动态 key
var createKey = function(){
  return "" + (Math.floor((+new Date)/10000));
};

const server = http.createServer((req, res) => {
  res.statusCode = 200;

  var url = req.url === '/' ? '/index.html' : req.url;
  res.setHeader('Content-Type', 'text/html');
  var filename = path.resolve(__dirname, 'content' + url);

  console.log(filename)
  console.log(fs.existsSync(filename))
  if(fs.existsSync(filename)){
    fs.readFile(filename, (err, data) => {
      res.end(data);
    });
    return;
  }
  else{
    console.log(1111)
    if(req.url.startsWith('/key')){
      res.end(createKey());
      return;
    }
    if(req.url.startsWith('/price')){
      var key = getKey(req.url);
      var acceptKey = createKey();
      if(key === acceptKey || key === acceptKey -1){
        res.end('rel price\n');
      }else{
        res.end('fake price\n');
      }
    }
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
})
