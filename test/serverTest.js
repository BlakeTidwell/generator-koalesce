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
        .withPrompts({ appname: 'test' })
        .on('end', function() {
          suite.tmpDir = process.cwd();
          app = require(suite.tmpDir + '/app').listen(3001);
          db = require(suite.tmpDir + '/models');
          db.sequelize.sync().then(function() {
            request = coTest.agent(app);
            done();
          });
        });
    });

    after(function *() {
      app.close();
      yield db.sequelize.drop();
      yield db.sequelize.query('DROP TABLE "SequelizeMeta";');
    });

    it('configures a working app', function *() {
      var res = yield request.get('/').expect(200).end();
      expect(res.text).to.equal('Hello Koalesce');
    });

    it('configures a database connection', function *() {
      var createResponse = yield request.post(
        '/posts'
      ).send({
        title: 'A Title'
      }).expect(200).end();
      expect(createResponse.body.id).to.exist;

      var indexResponse = yield request.get('/posts').expect(200).end();
      var post = indexResponse.body[0];
      expect(post.id).to.equal(createResponse.body.id);
      expect(post.title).to.equal('A Title');
    });

    it('configures sequelize for use via CLI', function *() {
      yield exec('sequelize model:create --name Foo --attributes bar:string');
      //function(code, output) {
      var result = yield exec('sequelize db:migrate --config ' + suite.tmpDir + '/config/config.json');
      expect(result.code).to.eq(0);
      yield exec('sequelize db:migrate:undo --config '  + suite.tmpDir + '/config/config.json');
    });
  });
});
