const FlyerModel = require('../models/flyerModel');
const { uploadBuffer } = require('../services/minioService');

const getFlyers = async (req, res) => {
  try {
    const flyers = await FlyerModel.getAll();
    res.json(flyers);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

const createFlyer = async (req, res) => {
  try {
    const { nombre } = req.body;
    
    // Como en la BD flyers exige foto (NOT NULL), validamos que venga el archivo
    if (!req.file) {
      return res.status(400).json({ error: 'La foto del flyer es obligatoria' });
    }

    // Subimos la foto al bucket y obtenemos la URL pública
    const fotoUrl = await uploadBuffer(req.file.buffer, req.file.originalname, req.file.mimetype);

    const data = {
      nombre,
      foto: fotoUrl
    };

    const nuevo = await FlyerModel.create(data);
    res.status(201).json(nuevo);
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

const deleteFlyer = async (req, res) => {
  try {
    // Nota: A futuro podés agregar lógica aquí para eliminar también el objeto de MinIO 
    // extrayendo el nombre del archivo desde la URL, antes de borrar el registro en DB.
    await FlyerModel.delete(req.params.id);
    res.status(204).send();
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  }
};

module.exports = { getFlyers, createFlyer, deleteFlyer };