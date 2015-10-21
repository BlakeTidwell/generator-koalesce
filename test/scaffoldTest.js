'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var coTest = require('co-supertest');
var request, suite, db;

describe('scaffolding', function() {
  this.timeout(10000);

  describe('koalesce:app', function () {
    before(function (done) {
      suite = this;
      helpers.run(path.join(__dirname, '../generators/app'))
        .inTmpDir(function(dir) {
          fs.symlinkSync(
            path.join(__dirname, 'fixtures/app/node_modules'),
            path.join(dir, 'node_modules'),
            'dir'
          );
        })
        .withOptions({ skipInstall: true })
        .withPrompts({ appname: 'koalesce' })
        .on('end', function() {
          suite.tmpDir = process.cwd();
          db = require(suite.tmpDir + '/models');
          db.sequelize.sync().then(function() {
            done();
          });
        });
    });

    after(function *() {
      yield db.sequelize.drop();
      yield db.sequelize.query('DROP TABLE IF EXISTS "SequelizeMeta";');
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
      assert.fileContent('package.json', /"name": "koalesce"/)
    });

    it('configures sequelize for use via CLI', function () {
      var result;
      result = exec('sequelize model:create --name Foo --attributes bar:string');
      expect(result.code).to.eq(0);
      result = exec('sequelize db:migrate');
      expect(result.code).to.eq(0);
      result = exec('sequelize db:migrate:undo');
      expect(result.code).to.eq(0);
    });
  });
});
