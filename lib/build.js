const fs = require('fs');
const browserify = require('browserify');
const minimist = require('minimist');

const options = minimist(process.argv.slice(2));
const libDir = options.dir + 'lib/';
const distDir = options.dir + 'dist/script/';
const commonFile = distDir + 'common.js';

const files = fs.readdirSync(libDir);
const entries = [];
const outputs = [];

files.forEach((file) => {
  entries.push(libDir + file);
  outputs.push(distDir + file);
});

if (options.reload) {
  entries.push('./helper/reload.js');
}

const bundler = browserify({
  entries,
  cache: {},
  packageCache: {},
  debug: options.debug || false
});

bundler.transform('babelify', {
  presets: ['es2015']
});

bundler.plugin('minifyify', {
  map: false,
  minify: options.minify || false
});

bundler.plugin('factor-bundle', {
  outputs,
  threshold: function threshold(row, groups) {
    if (row.file.match(/helper\/reload.js/)) {
      return true;
    }

    return this._defaultThreshold(row, groups);
  }
});

if (options.watch) {
  bundler.plugin('watchify');
}

bundler.on('update', () => {
  bundler
    .bundle()
    .on('error', (error) => {
      console.log(error.message);
    })
    .pipe(fs.createWriteStream(commonFile));
});

bundler.on('log', (message) => {
  console.log(message);
});

bundler.emit('update');
