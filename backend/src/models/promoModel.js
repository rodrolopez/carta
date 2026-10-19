const db = require('../config/db');

class PromoModel {
  static async getAll() {
    const query = `
      SELECT pr.*, p.nombre as producto_nombre, c.nombre as categoria_nombre 
      FROM promos pr
      LEFT JOIN productos p ON pr.producto_id = p.id
      LEFT JOIN categorias c ON pr.categoria_id = c.id
      ORDER BY pr.id ASC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async getById(id) {
    const query = `
      SELECT pr.*, p.nombre as producto_nombre, c.nombre as categoria_nombre
      FROM promos pr
      LEFT JOIN productos p ON pr.producto_id = p.id
      LEFT JOIN categorias c ON pr.categoria_id = c.id
      WHERE pr.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async create(data) {
    const query = `
      INSERT INTO promos (nombre, precio, producto_id, categoria_id) 
      VALUES ($1, $2, $3, $4) RETURNING *
    `;
    const { rows } = await db.query(query, [data.nombre, data.precio, data.producto_id, data.categoria_id]);
    return rows[0];
  }

  static async update(id, data) {
    const query = `
      UPDATE promos
      SET nombre = $1, precio = $2, producto_id = $3, categoria_id = $4
      WHERE id = $5
      RETURNING *
    `;
    const { rows } = await db.query(query, [data.nombre, data.precio, data.producto_id, data.categoria_id, id]);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM promos WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = PromoModel;
