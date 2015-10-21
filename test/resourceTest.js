'use strict';

var path = require('path');
var fs = require('fs');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var RunContext = require('yeoman-generator/lib/test/run-context');
var coTest = require('co-supertest');
var koalesce, app, request, suite, db;

describe('resources and routing', function() {
  this.timeout(10000);

  before(function (done) {
    suite = this;

    helpers.run(path.join(__dirname, '../generators/app'))
    .inTmpDir(function (dir) {
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

      helpers.run(path.join(__dirname, '../generators/controller'))
      .inDir('.tmp')
      .withArguments(['posts'])
      .on('end', function() {
        // Ends in '.tmp' directory, so move back up to random temp dir.
        cd('..')

        // Copy over generated controller from manually specified
        // output folder.
        cp(
          '-R',
          './.tmp/controllers/*',
          './controllers'
        )

        // Make a model to match the controller.
        exec('sequelize model:create --name Post --attributes title:string');
        exec('sequelize db:migrate');
        app = require(suite.tmpDir + '/app').listen(3001);
        db = require(suite.tmpDir + '/models');
        db.sequelize.sync().then(function() {
          request = coTest.agent(app);
          done();
        });
      });
    });
  });

  after(function *() {
    app.close();
    yield db.sequelize.drop();
    yield db.sequelize.query('DROP TABLE IF EXISTS "SequelizeMeta";');
  });

  it('generates a working resource controller', function *() {
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
});
