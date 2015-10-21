var dotenv = require('dotenv');
var path = require('path');
var defaultPath, envPath;
defaultPath = path.join(__dirname, '..', '.env');

if(!!process.env.NODE_ENV) {
  try {
    envPath = path.join(__dirname, '..', '.env.' + process.env.NODE_ENV.toLowerCase())
    dotenv.config({ path: envPath });
  } catch(err) {
    console.log(err);
  }
}
dotenv.config({ path: defaultPath });
