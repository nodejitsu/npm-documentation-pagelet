'use strict';

var Pagelet = require('pagelet')
  , npm = require('./npm');

Pagelet.extend({
  view: 'sidebar.ejs',
  css:  'sidebar.styl',

  get: function get(next) {
    next(undefined, {
      category: this.params.category,
      name: this.params.name,
      npm: npm
    });
  }
}).on(module);
