const db = require('../config/db');

class FlyerModel {
  static async getAll() {
    const { rows } = await db.query('SELECT * FROM flyers ORDER BY id ASC');
    return rows;
  }

  static async create(data) {
    const query = 'INSERT INTO flyers (nombre, foto) VALUES ($1, $2) RETURNING *';
    const { rows } = await db.query(query, [data.nombre, data.foto]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM flyers WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = FlyerModel;