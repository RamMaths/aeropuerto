const Model = require('../utils/Model.js');
const pool = require('../utils/dbConnection');

class PasajeroModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }
}

const pasajero = new PasajeroModel('pasajeros', 'id_pasajero', pool);
module.exports = pasajero;
