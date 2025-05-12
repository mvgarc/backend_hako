const Catalogo = require('../models/Catalogo');

// Función para crear un nuevo catálogo
const crearCatalogo = async (req, res) => {
    try {
        const { nombre } = req.body;
        const archivo = req.file ? req.file.filename : null;

        if (!nombre || !archivo) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
        }

        // Guardar en la base de datos
        const nuevoCatalogo = await Catalogo.create({
        nombre,
        archivo
        });

        res.status(201).json({
        message: 'Catálogo creado exitosamente',
        data: nuevoCatalogo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el catálogo' });
    }
};

module.exports = {
    crearCatalogo,
};
