const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marca.controller');

// Rutas
router.get('/', marcaController.getMarcas);
router.post('/', marcaController.createMarca);
router.get('/:id', marcaController.getMarcaById);
router.put('/:id', marcaController.updateMarca);
router.delete('/:id', marcaController.deleteMarca);

module.exports = router;