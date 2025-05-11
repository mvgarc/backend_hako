const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marca.controller');

// Rutas CRUD para Marcas
router.post('/', marcaController.createMarca);
router.get('/', marcaController.getMarcas);
router.delete('/:id', marcaController.deleteMarca);

module.exports = router;