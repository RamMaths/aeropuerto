const dotenv = require('dotenv');

const app = require('./app.js');

//environment variables
dotenv.config({path: './config.env'});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
