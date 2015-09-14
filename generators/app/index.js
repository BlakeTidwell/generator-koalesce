'use strict';
var generators = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');
var _s = require('underscore.string');

module.exports = generators.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the phenomenal ' + chalk.red('Koala') + ' generator!'
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
      var baseFiles = [
        ['_bower.json', 'bower.json'],
        ['index.js', 'index.js']
      ],
      generator = this;
      baseFiles.forEach(function(copyInfo) {
        generator.fs.copy(
          generator.templatePath(copyInfo[0]),
          generator.destinationPath(copyInfo[1])
        );
      });
      generator.fs.copyTpl(
        generator.templatePath('_package.json'),
        generator.destinationPath('package.json'),
        { appname: generator.appname }
      )
    },

    projectfiles: function () {
      var baseFiles = [
        ['editorconfig', '.editorconfig'],
        ['jshintrc', '.jshintrc'],
      ],
      generator = this;
      baseFiles.forEach(function(copyInfo) {
        generator.fs.copy(
          generator.templatePath(copyInfo[0]),
          generator.destinationPath(copyInfo[1])
        );
      });
    }
  },

  install: function () {
    this.installDependencies();
  }
});
