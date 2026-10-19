const express = require('express');
const router = express.Router();
const { getFlyers, createFlyer, deleteFlyer } = require('../controllers/flyerController');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', getFlyers);

// El middleware intercepta 'foto' del FormData antes de llegar al controlador
router.post('/', upload.single('foto'), createFlyer);

router.delete('/:id', deleteFlyer);

module.exports = router;