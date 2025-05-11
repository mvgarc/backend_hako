const Marca = require('../models/Marca');

// Obtener todas las marcas
const getMarcas = async (req, res) => {
    try {
        const marcas = await Marca.findAll();
        res.status(200).json(marcas);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener las marcas' });
    }
};

// Crear una nueva marca
const createMarca = async (req, res) => {
    try {
        const { nombre, logo } = req.body;
        const nuevaMarca = await Marca.create({ nombre, logo });
        res.status(201).json(nuevaMarca);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al crear la marca' });
    }
};

// Obtener una marca por ID
const getMarcaById = async (req, res) => {
    try {
        const { id } = req.params;
        const marca = await Marca.findByPk(id);

        if (!marca) {
        return res.status(404).json({ message: 'Marca no encontrada' });
        }

        res.status(200).json(marca);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al obtener la marca' });
    }
};

// Actualizar una marca
const updateMarca = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, logo } = req.body;

        const marca = await Marca.findByPk(id);

        if (!marca) {
        return res.status(404).json({ message: 'Marca no encontrada' });
        }

        marca.nombre = nombre;
        marca.logo = logo;

        await marca.save();
        res.status(200).json(marca);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al actualizar la marca' });
    }
};

// Eliminar una marca
const deleteMarca = async (req, res) => {
    try {
        const { id } = req.params;
        const marca = await Marca.findByPk(id);

        if (!marca) {
        return res.status(404).json({ message: 'Marca no encontrada' });
        }

        await marca.destroy();
        res.status(204).send();
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al eliminar la marca' });
    }
};

module.exports = {
    getMarcas,
    createMarca,
    getMarcaById,
    updateMarca,
    deleteMarca,
};