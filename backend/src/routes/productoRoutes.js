const express = require('express');
const router = express.Router();
const { getProductos, getProductoById, createProducto, updateProducto, deleteProducto } = require('../controllers/productoController');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', getProductos);
router.get('/:id', getProductoById);
router.post('/', upload.single('foto'), createProducto);
router.put('/:id', upload.single('foto'), updateProducto);
router.delete('/:id', deleteProducto);

module.exports = router;
