require('shelljs/global');
config.silent = true;
require('co-mocha');
var chai = require('chai');

global.expect = chai.expect;
