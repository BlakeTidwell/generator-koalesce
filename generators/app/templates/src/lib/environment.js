var dotenv = require('dotenv');
if(!!process.env.NODE_ENV) {
  try {
    dotenv.config({
      path: '.env.' + process.env.NODE_ENV.toLowerCase()
    });
  } catch(err) {
    console.log(err);
  }
}
dotenv.config({path: '.env'});
