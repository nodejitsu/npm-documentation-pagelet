'use strict';

var fs = require('fs')
  , path = require('path')
  , renderme = require('renderme')
  , npmdir = path.join(require.resolve('npm'), '../..', 'doc')
  , jitsudir = path.join(require.resolve('nodejitsu-handbook'), '..', 'content/npm');

//
// Expose the items.
//
var items = Object.create(null);
items.private = Object.create(null);

//
// Find all the different categories from the directly and walk each sub file to
// populate the items object.
//
fs.readdirSync(npmdir).forEach(function each(folder) {
  items[folder] = Object.create(null);

  fs.readdirSync(path.join(npmdir, folder)).filter(function filter(file) {
    return '.md' === path.extname(file);
  }).forEach(function each(item) {
    var title = item.slice(0, -3).replace(/\-/g, ' ')
      , url = item.slice(0, -3);

    items[folder][url] = {
      url: url,
      html: '',
      title: title,
      filename: item,
      path: path.join(npmdir, folder, item),
      render: function render(fn) {
        renderme({
          readmeFilename: this.filename,
          readme: fs.readFileSync(this.path, 'utf-8'),
        }, {
          trimmed: Infinity,
          github: {
            user: 'npm',
            repo: 'npm'
          }
        }, fn);
      }
    };
  });
});

//
// Read the documentation from nodejitsu-handbook.
//
fs.readdirSync(jitsudir).filter(function filter(file) {
  return '.md' === path.extname(file);
}).forEach(function each(item) {
  var title = item.slice(0, -3).replace(/\-/g, ' ')
    , url = item.slice(0, -3);

  items.private[url] = {
    url: url,
    html: '',
    title: title,
    filename: item,
    path: path.join(jitsudir, item),
    render: function render(fn) {
      renderme({
        readmeFilename: this.filename,
        readme: fs.readFileSync(this.path, 'utf-8')
      }, {
        trimmed: Infinity,
        github: {
          user: 'nodejitsu',
          repo: 'handbook/content/npm'
        }
      }, fn);
    }
  };
});

//
// Expose the items.
//
module.exports = items;
