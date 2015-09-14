var koala = require('koala');
var app = koala();
var port = process.env.PORT || 3000;

app.use(function* () {
  this.body = 'Hello Koala';
});

app.listen(port);

console.log('Server listening on port %s.', port);
