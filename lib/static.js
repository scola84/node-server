const express = require('express');
const minimist = require('minimist');

const server = express();
const options = minimist(process.argv.slice(2));

server
  .use(express.static(options.dir + 'dist/icon'))
  .use(express.static(options.dir + 'dist', {
    index: 'browser.html'
  }))
  .listen(options.port);
