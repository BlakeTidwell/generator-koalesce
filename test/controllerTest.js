'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;

describe('scaffolding', function() {
  describe('koalesce:controller', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/controller'))
        .inTmpDir(function(dir) {
          fs.mkdir('controllers');
        })
        .withOptions({ skipInstall: true })
        .withArguments(['posts'])
        .on('end', done);
    });

    it('creates a controller', function () {
      assert.file([ 'controllers/postsController.js' ]);
    });

    it('names the module correctly', function () {
      assert.fileContent('controllers/postsController.js', /module.exports = PostsController;/)
    });
  });
});
