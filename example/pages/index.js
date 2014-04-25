'use strict';

var Page = require('bigpipe').Page;

Page.extend({
  path: '/docs/:category/:name',  // HTTP route we should respond to.
  view: './index.ejs',            // The base template we need to render.
  pagelets: {                     // The pagelets that should be rendered.
    sidebar: require('../../').sidebar,
    documentation: require('../../')
  }
}).on(module);
