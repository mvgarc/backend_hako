const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { crearCatalogo, obtenerCatalogos } = require('../controllers/catalogo.controller');

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

module.exports = router;
