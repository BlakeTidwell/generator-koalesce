var Router = require('koa-router');
var postsController = new Router();
var Post = require('../models').Post;

postsController.use('/', function *(next) {
  this.data = yield *this.request.json();
  yield next;
});

postsController.get('/posts', function *(next) {
  this.body = yield Post.findAll();
});

postsController.post('/posts', function *(next) {
  var post = yield Post.create({
    title: this.data.title
  });
  this.body = { id: post.id };
});

module.exports = postsController;
