const Catalogo = require('../models/Catalogo');
const path = require('path');
const fs = require('fs');

// Crear un catálogo
const crearCatalogo = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const catalogo = await Catalogo.create({
        nombre,
        descripcion,
        nombreArchivo: req.file.filename
        });
        res.status(201).json({ message: 'Catálogo creado correctamente', catalogo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el catálogo' });
    }
};

// Obtener catálogos
const obtenerCatalogos = async (req, res) => {
    try {
        const catalogos = await Catalogo.findAll();
        res.status(200).json(catalogos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener catálogos' });
    }
};

// Eliminar un catálogo y su archivo
const eliminarCatalogo = async (req, res) => {
    try {
        const { id } = req.params;
        const catalogo = await Catalogo.findByPk(id);

        if (!catalogo) {
        return res.status(404).json({ message: 'Catálogo no encontrado' });
        }

        // Eliminar archivo físico
        const filePath = path.join(__dirname, '../uploads', catalogo.nombreArchivo);
        if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        }

        await catalogo.destroy();
        res.status(200).json({ message: 'Catálogo eliminado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el catálogo' });
    }
};
const actualizarCatalogo = async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, descripcion } = req.body;
            const catalogo = await Catalogo.findByPk(id);

            if (!catalogo) {
                return res.status(404).json({ message: 'Catálogo no encontrado' });
            }

            // Eliminar archivo físico anterior si se sube uno nuevo
            if (req.file) {
                const filePath = path.join(__dirname, '../uploads', catalogo.nombreArchivo);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                catalogo.nombreArchivo = req.file.filename;
            }

            catalogo.nombre = nombre || catalogo.nombre;
            catalogo.descripcion = descripcion || catalogo.descripcion;

            await catalogo.save();
            res.status(200).json({ message: 'Catálogo actualizado correctamente', catalogo });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar el catálogo' });
        }
};

module.exports = {
    crearCatalogo,
    obtenerCatalogos,
    eliminarCatalogo,
    actualizarCatalogo
};