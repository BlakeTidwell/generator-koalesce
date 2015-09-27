var koala = require('koala');
var app = koala();

app.use(function* () {
  this.body = 'Hello Koalesce';
});

module.exports = app;
