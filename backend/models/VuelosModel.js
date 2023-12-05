const Model = require('../utils/Model.js');
const pool = require('../utils/dbConnection');

class VuelosModel extends Model {
  constructor(table, primary_key, pool) {
    super(table, primary_key, pool);
  }

  async vuelos(estado) {
    let query = {
      text: `
        SELECT v.id_vuelo, v.id_avion as avion, ori.nombre_cd as origen, de.nombre_cd as destino, v.fecha_salida, av.latitud, av.longitud,  v.asientos_ocupados
        FROM vuelos v
        JOIN ciudades ori ON v.id_origen=ori.id_ciudad
        JOIN ciudades de ON v.id_destino=de.id_ciudad
        JOIN aviones av ON v.id_avion=av.id_avion
        WHERE av.volando=${estado}
      `
    }

    return this._execute(query);
  }

}

const vuelo = new VuelosModel('vuelos', 'id_vuelo', pool);
module.exports = vuelo;
