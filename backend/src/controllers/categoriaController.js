const CategoriaModel = require('../models/categoriaModel');

const getCategorias = async (req, res) => {
  try {
    const categorias = await CategoriaModel.getAll();
    res.json(categorias);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getCategoriaById = async (req, res) => {
  try {
    const categoria = await CategoriaModel.getById(req.params.id);
    if (!categoria) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(categoria);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createCategoria = async (req, res) => {
  try {
    const nueva = await CategoriaModel.create(req.body);
    res.status(201).json(nueva);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updateCategoria = async (req, res) => {
  try {
    const actualizada = await CategoriaModel.update(req.params.id, req.body);
    if (!actualizada) return res.status(404).json({ error: 'Categoría no encontrada' });
    res.json(actualizada);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deleteCategoria = async (req, res) => {
  try {
    await CategoriaModel.delete(req.params.id);
    res.status(204).send();
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { getCategorias, getCategoriaById, createCategoria, updateCategoria, deleteCategoria };
