const livereload = require('livereload');
const minimist = require('minimist');
const options = minimist(process.argv.slice(2));

livereload
  .createServer()
  .watch(options.dir + 'dist');
