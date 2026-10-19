const db = require('../config/db');

class ProductoModel {
  static async getAll() {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      ORDER BY p.id ASC
    `;
    const { rows } = await db.query(query);
    return rows;
  }

  static async getById(id) {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.id = $1
    `;
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }

  static async getByCategoriaTipo(tipo) {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      INNER JOIN categorias c ON p.categoria_id = c.id
      WHERE c.tipo = $1
      ORDER BY p.id ASC
    `;
    const { rows } = await db.query(query, [tipo]);
    return rows;
  }

  static async getByCategoriaId(categoriaId) {
    const query = `
      SELECT p.*, c.nombre as categoria_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.categoria_id = c.id
      WHERE p.categoria_id = $1
      ORDER BY p.id ASC
    `;
    const { rows } = await db.query(query, [categoriaId]);
    return rows;
  }

  static async create(data) {
    const query = `
      INSERT INTO productos (nombre, descripcion, precio, foto, categoria_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `;
    const values = [data.nombre, data.descripcion, data.precio, data.foto, data.categoria_id];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async update(id, data) {
    const query = `
      UPDATE productos 
      SET nombre = $1, descripcion = $2, precio = $3, foto = COALESCE($4, foto), categoria_id = $5 
      WHERE id = $6 RETURNING *
    `;
    const values = [data.nombre, data.descripcion, data.precio, data.foto, data.categoria_id, id];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM productos WHERE id = $1 RETURNING *';
    const { rows } = await db.query(query, [id]);
    return rows[0];
  }
}

module.exports = ProductoModel;
