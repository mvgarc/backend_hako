const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { crearCatalogo, obtenerCatalogos, eliminarCatalogo, actualizarCatalogo } = require('../controllers/catalogo.controller');

// Configuración de Multer para guardar archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// OJO: Ruta para subir un archivo y guardar en DB
router.post('/upload', upload.single('archivo'), crearCatalogo);

// OJO: Ruta para obtener todos los catálogos
router.get('/', obtenerCatalogos);

// OJO: Ruta para eliminar un catálogo y su archivo
router.delete('/:id', eliminarCatalogo);

// OJO: Ruta para actualizar un catálogo y su archivo
router.put('/:id', upload.single('archivo'), actualizarCatalogo)

module.exports = router;
