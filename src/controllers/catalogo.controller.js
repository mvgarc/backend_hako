// catalogo.controller.js

const Catalogo = require('../models/Catalogo');
const path = require('path');
const fs = require('fs');

// Crear un catálogo
const crearCatalogo = async (req, res) => {
    try {
        // Verificar si se ha subido un archivo
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
        }

        // Obtener los datos del cuerpo de la petición (proveedor, marcaId)
        // Asegúrate que el frontend envíe 'provider' y 'marcaId'
        const { provider, marcaId } = req.body; 

        // Validar que proveedor y marcaId no estén vacíos
        if (!provider || !marcaId) {
            return res.status(400).json({ message: 'Los campos de proveedor y marca son obligatorios.' });
        }
        
        const nombreCatalogo = req.file.originalname;

        const catalogo = await Catalogo.create({
            nombre: nombreCatalogo, // Usamos el nombre original del archivo como nombre del catálogo
            archivo: req.file.filename,
            proveedorId: provider, // Asumiendo que el frontend envía 'provider'
            marcaId: marcaId      // Asumiendo que el frontend envía 'marcaId'
        });

        res.status(201).json({ message: 'Catálogo creado correctamente', catalogo });
    } catch (error) {
        console.error("Error al crear el catálogo:", error); // Más específico
        // Puedes enviar el mensaje de error del ORM si es más útil para depurar en desarrollo
        res.status(500).json({ 
            message: 'Error al crear el catálogo', 
            details: error.message // Útil para depuración, pero cuidado en producción
        });
    }
};

module.exports = {
    crearCatalogo,
    obtenerCatalogos,
    eliminarCatalogo,
    actualizarCatalogo,
    descargarCatalogo,
    listarCatalogos
};