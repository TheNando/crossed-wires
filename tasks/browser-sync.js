'use strict';

const bs = require('browser-sync').create(),
      fs = require('fs'),
      stylus = require('stylus'),
      styleMap = {};

buildStyleMap();

bs.watch(['./client/**/*.html', './client/**/*.js'], bs.reload);
bs.watch('./client/**/*.styl', restyle);

bs.init({
  server: './client',
  middleware: rewriteUrl,
  socket: {
    namespace: '/browser-sync'
  }
});

function buildStyleMap (err, files) {
  const spawn = require('child_process').spawn,
        find = spawn('find', ['./client', '-name', '*.styl']);
  find.stdout.setEncoding('utf8');
  find.stdout.on('data', files => {
    files
      .trim()
      .split('\n')
      .forEach(
        file => fs.readFile(file, 'utf8', writeToStyleMap(file))
      );
  });
}

function renderStyles () {
  const styleStr = Object.keys(styleMap)
    .reduce((prev, style) => prev + styleMap[style] + '\n', '');

  stylus(styleStr).render((err, css) => {
    var newFile = 'client/app.css';
    fs.writeFileSync(newFile, css);
    bs.reload(newFile);
  });
}

function restyle (event, file) {
  fs.readFile(file, 'utf8', writeToStyleMap(file, renderStyles));
}

function rewriteUrl (req, res, next) {
  let fileName = require('url').parse(req.url);
  fileName = fileName.href.split(fileName.search).join('');

  // If not loading an asset file, load index so Angular HTML5 mode works
  if (!fileName.includes('.')) {
    req.url = '/index.html';
  }

  return next();
}

function writeToStyleMap (file, callback) {
  return (err, data) => {
    styleMap[file.replace('./', '')] = data;
    callback && callback();
  };
}
