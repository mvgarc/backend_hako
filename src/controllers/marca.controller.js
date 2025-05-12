const Marca = require('../models/Marca');
const multer = require ('multer');
const path = require('path');

// Configuración de Multer para almacenamiento de archivos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Carpeta donde se guardarán los logos
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Nombre único con timestamp
    },
});

const upload = multer({ storage });

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
        const { nombre } = req.body;
        let logoPath = null;

        // Verifica si hay un archivo subido
        if (req.file) {
            logoPath = `uploads/${req.file.filename}`;
        }

        // Crea el registro en la base de datos
        const nuevaMarca = await Marca.create({ nombre, logo: logoPath });
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
        const { nombre} = req.body;
        let logoPath = null;

        const marca = await Marca.findByPk(id);

        if (!marca) {
            return res.status(404).json({ message: 'Marca no encontrada' });
        }

        if (req.file) {
            logoPath = `uploads/${req.file.filename}`;
            marca.logo = logoPath;
        }

        marca.nombre = nombre;

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
    createMarca: [upload.single('logo'), createMarca], // Middleware para subir el archivo
    getMarcaById,
    updateMarca: [upload.single('logo'), updateMarca], // Middleware para subir el archivo
    deleteMarca,
};