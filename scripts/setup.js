var fs = require('fs');
var util = require('util')
var exec = require('child_process').exec;
var ejs = require('ejs');
var tplStr, compiledStr;

tplStr = fs.readFileSync('./generators/app/templates/meta/_package.json', 'utf8');
compiledStr = ejs.render(tplStr, { appname: 'test' });

fs.writeFileSync('./test/fixtures/app/package.json', compiledStr);

function puts(error, stdout, stderr) { console.log(stdout) }
process.chdir('./test/fixtures/app');
exec('npm install', puts);
