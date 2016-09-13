#! /usr/bin/env node

'use strict'
// const config = require('./web.config.js');
const useEval = true;  //config.useEval;
const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3000;
var accepturl = '/data';

var allEncodeList = [];
fs.readdir(path.resolve(__dirname, './encodes'), (err, files) =>{
  files.map((file)=>{
    allEncodeList.push(require(path.resolve(__dirname, './encodes/'+ file)));
  });
})

//生成随机差值
function GetRandomNum(Min,Max){
  var Range = Max - Min;
  var Rand = Math.random();
  return(Min + Math.round(Rand * Range));
}
var diffDate = GetRandomNum(2, 13) * 37000;

var createKey = function(callback, justkey){
  //这里是时间戳，但如果仅仅用这个，那么可以被傻瓜破解了，因为时间戳服务器端是固定的，与客户端差值是股东的，所以可以推算出来，这就傻瓜式破解了
  //为了避免出现这种情况，使用随机差值方式，这里面要确认一件事，就是什么时机变值，这种方法可行吗？
  //key 和 data 接口会成对出现么；貌似实现不了，
  var tempDate = +new Date + diffDate;//Math.floor(Math.random()*10);
  var key = (Math.floor(tempDate/10000)); //后面要对数字进行操作，所以这里用数字，不是字符串
  if(justkey){
    // console.log(key);
    return key;
  }
  var encodeDecodeList = allEncodeList.slice().sort((a,b)=>Math.random() > 0.5);
  key = encodeDecodeList[1].encode(encodeDecodeList[0].encode(key));
  var source = `
      (function(){
        // debugger;
        var decode1 = ${encodeDecodeList[1].decode.toString()};
        var decode2 = ${encodeDecodeList[0].decode.toString()};
        var key = ${JSON.stringify( key.toString().split('').map((item) => { return item.charCodeAt() }) )};
        // console.log(key);
        var result = key.map( (item)=>String.fromCharCode(item) ).join('');
        key=+result;
        key=decode1(key);
        key=decode2(key);
        ${callback}(key);
      })();
  `;
  if(useEval){
    var code = JSON.stringify( source.split('').map((item) =>{ return item.charCodeAt() }) );
    return `
        eval(${code}.map(item=>String.fromCharCode(item)).join(''));
    `;
  }
  return source;
}

var regKey = /[?]key=(.*)?/;
var getKey = function(input){
  var result = regKey.exec(input);
  return result && result[1];
};

var regCallback = /[?]callback=([^&]*)?/;
var getCallback = function(input){
  var result = regCallback.exec(input);
  return result && result[1];
};

const server = http.createServer((req, res) => {
  res.statusCode = 200;

  var url = req.url === '/' ? '/index.html' : req.url;
  res.setHeader('Content-Type', 'text/html');
  var filename = path.resolve(__dirname, 'content' + url);

  // console.log(filename)
  // console.log(fs.existsSync(filename))
  if(fs.existsSync(filename)){
    fs.readFile(filename, (err, data) => {
      res.end(data);
    });
    return;
  }
  else{
    //demo 要求两个请求之间 最大时间间隔20s
    if(req.url.startsWith('/key')){
      res.setHeader('Content-Type', 'application/javascript');
      res.end(createKey(getCallback(req.url)));
      return;
    }
    if(req.url.startsWith('/data')){
      var key = getKey(req.url);
      var acceptKey = createKey('', true);
      if(key == acceptKey || key == acceptKey -1){
        res.end('1\n'); //real data
      }else{
        res.end('0\n');  //fake data
      }
    }
  }

});

// 使用 hostname 会导致被限制只能使用 hostname，打开 IP则无法用
// const hostname = '127.0.0.1';
// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}`);
// })
server.listen(port, () => {
  console.log(`Server running at http://127.0.0.1/:${port}`);
})
