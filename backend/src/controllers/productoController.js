const ProductoModel = require('../models/productoModel');
const { uploadBuffer } = require('../services/minioService');

const getProductos = async (req, res) => {
  try {
    const { tipo, categoria_id: categoriaId } = req.query;
    let productos;
    if (categoriaId) {
      productos = await ProductoModel.getByCategoriaId(categoriaId);
    } else if (tipo) {
      productos = await ProductoModel.getByCategoriaTipo(tipo);
    } else {
      productos = await ProductoModel.getAll();
    }
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProductoById = async (req, res) => {
  try {
    const producto = await ProductoModel.getById(req.params.id);
    if (!producto) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria_id } = req.body;
    let fotoUrl = null;

    // Si viene un archivo en la petición, lo subimos por buffer al object storage
    if (req.file) {
      fotoUrl = await uploadBuffer(req.file.buffer, req.file.originalname, req.file.mimetype);
    }

    const data = {
      nombre,
      descripcion,
      precio,
      foto: fotoUrl, // Guardamos la URL generada en Postgres
      categoria_id
    };

    const nuevoProducto = await ProductoModel.create(data);
    res.status(201).json(nuevoProducto);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  
};

const updateProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, categoria_id } = req.body;
    const fotoUrl = req.file
      ? await uploadBuffer(req.file.buffer, req.file.originalname, req.file.mimetype)
      : null;
    const actualizada = await ProductoModel.update(req.params.id, {
      nombre,
      descripcion,
      precio,
      foto: fotoUrl,
      categoria_id,
    });
    if (!actualizada) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteProducto = async (req, res) => {
  try {
    const eliminado = await ProductoModel.delete(req.params.id);
    if (!eliminado) return res.status(404).json({ error: 'Producto no encontrado' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getProductos, getProductoById, createProducto, updateProducto, deleteProducto };
