'use strict';
var generators = require('yeoman-generator');
var _s = require('underscore.string');
var pluralize = require('pluralize');

module.exports = generators.Base.extend({
  constructor: function () {
    generators.Base.apply(this, arguments);

    this._s = _s;
    this.pluralize = pluralize;

    // This makes `appname` a required argument.
    this.argument('name', { type: String, required: true  });
  },

  writing: {
    app: function () {
      this.template('controller.js', 'controllers/' + this.name + 'Controller.js');
    },
  }
});
