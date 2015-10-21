'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var coTest = require('co-supertest');
var app, request, suite, db;

describe('server smoke test', function() {
  this.timeout(0);

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
          app = require(suite.tmpDir + '/app').listen(3001);
          request = coTest.agent(app);
          done();
        });
    });

    after(function *() {
      app.close();
    });

    it('configures a working app', function *() {
      var res = yield request.get('/').expect(200).end();
      expect(res.text).to.equal('Hello Koalesce');
    });
  });
});
