'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var coTest = require('co-supertest');
var app, request;

describe('server smoke test', function() {
  describe('koalesce:app', function () {
    before(function (done) {
      helpers.run(path.join(__dirname, '../generators/app'))
        .inTmpDir(function(dir) {
          fs.symlinkSync(
            path.join(__dirname, 'fixtures/app/node_modules'),
            path.join(dir, 'node_modules'),
            'dir'
          );
        })
        .withOptions({ skipInstall: true })
        .withPrompts({ appname: 'test' })
        .on('end', function() {
          app = require(process.cwd() + '/app').listen(3001);
          request = coTest.agent(app);
          done();
        });
    });

    after(function () {
      app.close();
    });

    it('configures a working server', function *() {
      var res = yield request.get('/').expect(200).end();
      expect(res.text).to.equal('Hello Koalesce');
    });
  });
});
