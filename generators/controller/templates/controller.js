<% var plural = _s.titleize(pluralize(name)),
       singular = _s.titleize(pluralize(name, 1)); %>var Router = require('koa-router');
var <%= plural %>Controller = new Router();
var <%= singular %> = require('../models').<%= singular %>;

// Do not remove. Parses JSON; will be moved further up chain.
<%= plural %>Controller.use('/', function *(next) {
  this.data = yield *this.request.json();
  yield next;
});
// Do not remove. Parses JSON; will be moved further up chain.

// FIXME: THIS IS INSECURE. Blindly posting data from the user is Really Dumb™.
// Only using this as POC for the generator, but should whitelist based on model
// attributes.
<%= plural %>Controller.post('/<%= _s.slugify(plural) %>', function *(next) {
  var <%= singular.toLowerCase() %> = yield <%= singular %>.create(this.data);
  this.body = { id: <%= singular.toLowerCase() %>.id }
})

<%= plural %>Controller.get('/<%= _s.slugify(plural) %>', function *(next) {
  this.body = yield <%= singular %>.findAll();
});

module.exports = <%= plural %>Controller;
