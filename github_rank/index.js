#!/usr/bin/env node

var argv = process.argv;
argv.shift();

console.log(argv);

var user = argv[1]

var Crawler = require("crawler");
var jsdom = require('jsdom');

var c = new Crawler({
    jQuery: jsdom,
    maxConnections : 100,
    forceUTF8: true,
    // incomingEncoding: 'gb2312',
    // This will be called for each crawled page
    callback : function (error, result, $) {
      var td = $("a[href='https://github.com/" + user + "']").closest('tr').find('td')
      for(var i = 0; i< td.length; i++) {
        var item = $(td).eq(i).text();
        console.log(item)
      }

      process.exit()
    }
});

c.queue('http://githubrank.com/');
