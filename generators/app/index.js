'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var glob = require('glob');
var path = require('path');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the phenomenal ' + chalk.red('Koalesce') + ' generator!'
    ));

    var prompts = [{
      type: 'input',
      name: 'appname',
      message: 'Application name',
      default: path.basename(this.destinationRoot())
    }];

    this.prompt(prompts, function (props) {
      this.props = props;
      // To access props later use this.props.someOption;
      this.appname = props.appname;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      this.sourceRoot(path.join(__dirname, 'templates', 'meta'));
      glob.sync('**', { cwd: this.sourceRoot() }).map(function (file) {
        this.template(file, file.replace(/^_/, ''));
      }, this);

      this.sourceRoot(path.join(__dirname, 'templates', 'src'));
      this.directory('.', '.');
    },
  },

  install: function () {
    this.installDependencies();
  }
});
