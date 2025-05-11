const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuración de Multer para guardar archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardan los archivos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nombre único
    },
});

const upload = multer({ storage });

// Ruta para subir un archivo
router.post('/upload', upload.single('archivo'), (req, res) => {
    if (req.file) {
        res.status(200).json({
        message: 'Archivo subido correctamente',
        file: req.file,
        });
    } else {
        res.status(400).json({ message: 'Error al subir el archivo' });
    }
});

module.exports = router;