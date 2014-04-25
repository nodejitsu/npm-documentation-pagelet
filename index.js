'use strict';

var Pagelet = require('pagelet')
  , npm = require('./npm');

Pagelet.extend({
  view: 'documentation.ejs',
  css:  'documentation.styl',

  get: function get(next) {
    var category = this.params.category
      , name = this.params.name;

    if (!(category in npm)) return next(new Error('Unknown category'));
    if (!(name in npm[category])) return next(new Error('Invalid name'));

    npm[category][name].render(function render(err, html) {
      if (err) return next(err);

      next(undefined, {
        category: category,
        html: html,
        name: name
      });
    });
  }
}).on(module);

//
// Also expose the sidebar.
//
module.exports.sidebar = require('./sidebar');
