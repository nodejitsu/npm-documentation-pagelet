'use strict';

var fs = require('fs')
  , path = require('path')
  , renderme = require('renderme')
  , npmdir = path.join(require.resolve('npm'), '../..', 'doc')
  , jitsudir = path.join(require.resolve('nodejitsu-handbook'), '..', 'content/npm');

/**
 * Representation of a single HELP document.
 *
 * @constructor
 * @param {String} filename The name of the help file.
 * @param {String} path The absolute location of the file.
 * @param {Object} github Github user/repo of the help files.
 * @param {Function} preprocess Optional content pre-processor.
 * @api public
 */
function Help(filename, path, github, preprocess) {
  if (!(this instanceof Help)) return new Help(filename, path, preprocess);

  this.path = path;
  this.github = github;
  this.filename = filename;
  this.preprocess = preprocess;
  this.url = filename.slice(0, -3);
  this.title = filename.slice(0, -3).replace(/\-/g, ' ');
}

/**
 * Parse the markdown files.
 *
 * @param {Function} fn Callback
 * @api public
 */
Help.prototype.render = function render(fn) {
  if (this.html) return fn(undefined, this.html);

  var content = fs.readFileSync(this.path, 'utf-8')
    , help = this;

  if (this.preprocess) content = this.preprocess(content);

  renderme({
    readmeFilename: this.filename,
    readme: content
  }, {
    trimmed: Infinity,
    github: this.github
  }, function rendered(err, html) {
    if (err) return fn(err);

    fn(err, help.html = html);
  });
};

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
    var help = new Help(item, path.join(npmdir, folder, item), {
      user: 'npm',
      repo: 'npm'
    }, function preprocess(content) {
      var index;

      if (~(index = content.indexOf('## SEE ALSO'))) {
        content = content.slice(0, index).trim();
      }

      return content;
    });

    items[folder][help.url] = help;
  });
});

//
// Read the documentation from nodejitsu-handbook.
//
fs.readdirSync(jitsudir).filter(function filter(file) {
  return '.md' === path.extname(file);
}).forEach(function each(item) {
  var help = new Help(item, path.join(jitsudir, item), {
    user: 'nodejitsu',
    repo: 'handbook/content/npm'
  });

  items.private[help.url] = help;
});

//
// Expose the items.
//
module.exports = items;
