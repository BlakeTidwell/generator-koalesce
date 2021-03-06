var fs = require('fs');
var path      = require('path');
var basename  = path.basename(module.filename);

module.exports = function(app) {
  fs
    .readdirSync(__dirname)
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== basename);
    })
    .forEach(function(file) {
      if (file.slice(-3) !== '.js') return;
      var controller = require(path.join(__dirname, file));
      app.use(controller.routes());
    });
};
