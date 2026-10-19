const PromoModel = require('../models/promoModel');

const getPromos = async (req, res) => {
  try {
    const promos = await PromoModel.getAll();
    res.json(promos);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const getPromoById = async (req, res) => {
  try {
    const promo = await PromoModel.getById(req.params.id);
    if (!promo) return res.status(404).json({ error: 'Promoción no encontrada' });
    res.json(promo);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createPromo = async (req, res) => {
  try {
    const nueva = await PromoModel.create(req.body);
    res.status(201).json(nueva);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const updatePromo = async (req, res) => {
  try {
    const actualizada = await PromoModel.update(req.params.id, req.body);
    if (!actualizada) return res.status(404).json({ error: 'Promoción no encontrada' });
    res.json(actualizada);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const deletePromo = async (req, res) => {
  try {
    await PromoModel.delete(req.params.id);
    res.status(204).send();
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { getPromos, getPromoById, createPromo, updatePromo, deletePromo };
