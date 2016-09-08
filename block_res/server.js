#! /usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = '127.0.0.1';
const port = 3000;


// var pageHtml = require('./test.html');

const server = http.createServer((req, res) => {
  res.statusCode = 200;

  var url = req.url === '/' ? '/test.html' : req.url;
  res.setHeader('Content-Type', 'text/html');
  var filename = path.resolve(__dirname, 'content' + url);

  //内容安全策略 CSP
  //参看 https://content-security-policy.com/
  res.setHeader('Content-Security-Policy', "default-src 'self' 'unsafe-inline' 'unsafe-eval' *.iqianggou.com hm.baidu.com *.baidustatic.com pos.baidu.com dn-growing.qbox.me data: api.growingio.com;font-src at.alicdn.com;");
  // 'unsafe-inline' 'unsafe-eval'
  // script-src hm.baidu.com dn-growing.qbox.me *.iqianggou.com;
  // img-src *;
  // connect-src *.iqianggou.com api.growingio.com;");
  if(fs.existsSync(filename)){
    fs.readFile(filename, (err, data) => {
      //这里测试，模拟各种广告注入（内联、外链等等）
      //这里 data 是 Buffer数据，要注入需要变更成文本，可在 test.html 中直接操作测试
      // console.log(data);
      res.end(data);
    });
    return;
  }else{
    res.end('err\n');
  }

});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}`);
})
