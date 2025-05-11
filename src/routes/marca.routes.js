const express = require('express');
const router = express.Router();
const marcaController = require('../controllers/marca.controller');
const multer = require('multer');
const path = require('path');

// Configuración de Multer para subir archivos
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Rutas CRUD para Marcas
router.post('/', upload.single('logo'), marcaController.createMarca);
router.get('/', marcaController.getMarcas);
router.delete('/:id', marcaController.deleteMarca);

module.exports = router;