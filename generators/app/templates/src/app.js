var koala = require('koala');
var app = koala();
var router = require('koa-router')();


router.get('/', function *(next){
  this.body = 'Hello Koalesce';
  yield next;
});

app.use(router.routes())
  .use(router.allowedMethods());

require('./controllers')(app);

module.exports = app;
