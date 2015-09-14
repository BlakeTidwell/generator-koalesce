'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('koala:app', function () {
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
      'index.js'
    ]);
  });

  it('names the app correctly', function () {
    var fs = require('fs');
    var contents = fs.readFileSync('package.json', 'utf8');
    assert.fileContent('package.json', /"name": "test"/)
  });
});
