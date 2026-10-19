const db = require('../config/db');

class CategoriaModel {
  static async getAll() {
    const { rows } = await db.query('SELECT * FROM categorias ORDER BY id ASC');
    return rows;
  }

  static async getById(id) {
    const { rows } = await db.query('SELECT * FROM categorias WHERE id = $1', [id]);
    return rows[0];
  }

  static async create(data) {
    const query = 'INSERT INTO categorias (nombre, tipo) VALUES ($1, $2) RETURNING *';
    const { rows } = await db.query(query, [data.nombre, data.tipo]);
    return rows[0];
  }

  static async update(id, data) {
    const query = 'UPDATE categorias SET nombre = $1, tipo = $2 WHERE id = $3 RETURNING *';
    const { rows } = await db.query(query, [data.nombre, data.tipo, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM categorias WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = CategoriaModel;
