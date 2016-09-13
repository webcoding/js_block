#! /usr/bin/env node

const request = require('request');

var crawler = function(){
  request('http://localhost:3000/key?callback=test&_=' + (+new Date), function(error, response, body){
    var key = null;
    var test = function(item){
      // console.log(item);
      key = item;
    }
    eval(body);
    request('http://localhost:3000/data?key=' + key, function(error, response, body){
      if(!error && response.statusCode == 200){
        console.log(body); // show the HTML for the test page
      }
    })
  })

}

setInterval(crawler, 1000);
