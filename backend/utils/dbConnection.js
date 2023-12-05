const Pool = require('pg').Pool;

const pool = new Pool({
  host: 'localhost',
  user: 'db',
  database:  'aeropuerto',
  password: '1',
  port: 5433
});

module.exports = pool;
