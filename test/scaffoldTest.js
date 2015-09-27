'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('scaffolding', function() {
  describe('koalesce:app', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .withOptions({ skipInstall: true })
        .withPrompts({ appname: 'test' })
        .on('end', done);
    });

    it('creates files', function () {
      assert.file([
        'bower.json',
        'package.json',
        '.editorconfig',
        '.jshintrc',
        'index.js',
        'app.js'
      ]);
    });

    it('names the app correctly', function () {
      var contents = fs.readFileSync('package.json', 'utf8');
      assert.fileContent('package.json', /"name": "test"/)
    });
  });
});
