const Model = require('../utils/Model.js');
const pool = require('../utils/dbConnection');

class AvionModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }
}

const avion = new AvionModel('aviones', 'id_avion', pool);
module.exports = avion;
