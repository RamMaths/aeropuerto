class Model {
  constructor(table, primary_key, pool) {
    this.table = table;
    this.pool = pool;
    this.primary_key = primary_key;
    this.transaction_mode = false;
  }

  transaction_on() {
    this.transaction_mode = true;
  }

  transaction_off() {
    this.transaction_mode = false;
  }

  async dataTypes(client) {
    const query = `
      SELECT column_name, data_type FROM information_schema.columns
      WHERE table_name='${this.table}';
    `;

    if(client) this.transaction_on();
    return await this._execute(query, client);
  }

  async find({fields, filters, join}, client) {
    let query = '';

    if(!fields && !filters) {
      query = `
        SELECT * 
        FROM ${this.table}
      `;
    } else if(!fields && filters) {
      for(const [key, value] of Object.entries(filters)) {
        conditions.push(`${key}=${value}`);
      }

      query = {
        text: `
        SELECT ${Object.keys(fields).join(', ')}
        FROM ${this.table} ${this.table.charAt(0)}
        WHERE ${conditions.join(' AND ')}
        ${join ? join : ''}
      `

      };
    } else if(fields && !filters) {
      query = {
        text: `
        SELECT ${fields.join(', ')}
        FROM ${this.table} ${this.table.charAt(0)}
        ${join ? join : ''}
        `
      };
    } else {
      const conditions = [];

      for(const [key, value] of Object.entries(filters)) {
        conditions.push(`${key}=${value}`);
      }

      query = {
        text: `
        SELECT ${fields.join(', ')}
        FROM ${this.table} ${this.table.charAt(0)}
        ${join ? join : ''}
        WHERE ${this.table.charAt(0)}.${conditions.join(' AND ')}
      `,
      };
    }

    if(client) this.transaction_on();
    return await this._execute(query, client);
  }

  async findOne(field, value, client) {
    const query = {
      text: `
        SELECT *
        FROM ${this.table}
        WHERE ${field}=${value}
      `
    };
    
    if(client) this.transaction_on();
    return await this._execute(query);
  }

  async create(obj, client) {
    const query = {
      text: `
        INSERT INTO ${this.table} (
          ${Object.keys(obj).join(', ')}
        ) 
        VALUES (${Object.keys(obj).map((_, i) => `$${i + 1}`)})
        RETURNING *
      `,
      values: Object.values(obj)
    }

    if(client) this.transaction_on();
    return await this._execute(query, client);
  };

  async updateAField(data, client) {

    const query =
      `
      UPDATE ${this.table} 
      SET ${
        data.type === 'numeric' || data.type === 'integer' ?
        `${data.field}=${data.value}` :
        `${data.field}='${data.value}'`
      }
      WHERE ${this.primary_key}=${data.id}
      `
    ;

    if(client) this.transaction_on();
    return await this._execute(query, client);
  }

  async update(identifier, data, client) {
    let lastItemPosition = 0;

    const values = Object.keys(data).map(
      (propName, i) => {
        lastItemPosition = i + 2
        return `${propName}=$${i+1}`
      }
    );

    const query = {
      text: `
        UPDATE ${this.table} 
        SET ${values.join(', ')} 
        WHERE ${Object.keys(identifier)[0]}=$${lastItemPosition}
      `,
      values: [...Object.values(data), Object.values(identifier)[0]]
    }

    if(client) this.transaction_on();
    return await this._execute(query, client);
  }

  async delete(arr, client) {
    const query = {
      text: `
        DELETE FROM ${this.table}
        WHERE ${this.primary_key} IN (${arr.join(', ')})
      `
    }

    if(client) this.transaction_on();
    return await this._execute(query, client);
  }

  async deleteWhere({field, value}, client) {
    const query = {
      text: `
        DELETE FROM ${this.table}
        WHERE ${field}=${value}
      `
    }
    
    if(client) this.transaction_on();
    return await this._execute(query, client);
  } 

  async getColumns(client) {
    const query = `
      SELECT column_name 
      FROM information_schema.columns
      WHERE table_name='${this.table}';
    `;

    if(client) this.transaction_on();
    return await this._execute(query, client);
  }

  //private methods

  async _execute(query, client) {
    if(!this.transaction_mode) {
      let results;
      let client = await this.pool.connect();
      const qRes = await client.query(query)
      client.on('error', (err) => {
        client.release();
        throw err;
      });
      results = qRes.rows;
      await client.release();
      return results;
    } else {
      const qRes = await client.query(query)
      client.on('error', (err) => {
        client.release();
        throw err;
      });
      let results = qRes.rows;
      this.transaction_off();
      return results;
    }
  }
}

module.exports = Model;
