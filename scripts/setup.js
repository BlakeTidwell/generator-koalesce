require('shelljs/global');
var fs = require('fs');
var ejs = require('ejs');
var tplStr, compiledStr;

tplStr = fs.readFileSync('./generators/app/templates/meta/_package.json', 'utf8');
compiledStr = ejs.render(tplStr, { appname: 'test' });

fs.writeFileSync('./test/fixtures/app/package.json', compiledStr);

cd('./test/fixtures/app');
exec('npm install', function(code, output) {
  console.log(output);
});
