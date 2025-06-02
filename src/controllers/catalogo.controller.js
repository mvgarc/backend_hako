const Catalogo = require('../models/Catalogo');
const Proveedor = require('../models/Proveedor'); // Asegúrate de importar Proveedor
const Marca = require('../models/Marca');       // Asegúrate de importar Marca
const path = require('path');
const fs = require('fs');

// Crear un catálogo
const crearCatalogo = async (req, res) => {
    try {
        console.log("req.file (en controller):", req.file);
        console.log("req.body (en controller):", req.body);

        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
        }
        if (!req.body.provider) { // <-- Se espera 'provider' del frontend, que mapea a 'proveedorId'
            return res.status(400).json({ message: 'Falta el ID del proveedor.' });
        }
        if (!req.body.marcaId) { // <-- Se espera 'marcaId' del frontend
            return res.status(400).json({ message: 'Falta el ID de la marca.' });
        }

        const nombreCatalogo = req.file.originalname; 

        // Sequelize automáticamente pondrá la fecha y hora actual en 'publishedAt'
        // gracias a `defaultValue: DataTypes.NOW` en el modelo Catalogo.js
        const catalogo = await Catalogo.create({
            nombre: nombreCatalogo,
            archivo: req.file.filename,
            proveedorId: req.body.provider, // Mapea al campo proveedorId en tu modelo Catalogo
            marcaId: req.body.marcaId       // Mapea al campo marcaId en tu modelo Catalogo
        });
        
        res.status(201).json({ message: 'Catálogo creado correctamente', catalogo });
    } catch (error) {
        console.error("Error en crearCatalogo:", error);
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ message: 'Error de validación al crear el catálogo', errors });
        }
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({ message: 'Error de clave foránea: El proveedor o la marca especificados no existen.', details: error.message });
        }
        res.status(500).json({ message: 'Error al crear el catálogo', details: error.message });
    }
};

// Obtener todos los catálogos (para mostrar en la tabla de reportes)
const obtenerCatalogos = async (req, res) => {
    try {
        const catalogos = await Catalogo.findAll({
            include: [
                {
                    model: Proveedor,
                    attributes: ['nombre']
                },
                {
                    model: Marca,
                    attributes: ['nombre']
                }
            ]
        });
        
        const catalogosConInfoCompleta = catalogos.map((item) => {
            const proveedorNombre = item.Proveedor ? item.Proveedor.nombre : 'Desconocido';
            const marcaNombre = item.Marca ? item.Marca.nombre : 'Desconocida';

            return {
                id: item.id,
                filename: item.nombre, 
                provider: proveedorNombre, 
                brand: marcaNombre,       
                publishedAt: item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('es-ES') : 'N/A',
                notes: item.notes || "", 
                enlaceDescarga: `${req.protocol}://${req.get('host')}/api/catalogos/download/${item.id}`
            };
        });
        
        res.status(200).json(catalogosConInfoCompleta);
    } catch (error) {
        console.error("Error al obtener catálogos:", error);
        res.status(500).json({ message: 'Error al obtener catálogos', details: error.message });
    }
};

const listarCatalogos = (req, res) => {
    try {
        const directoryPath = path.join(__dirname, '../uploads');

        if (!fs.existsSync(directoryPath)) {
            console.log("La carpeta 'uploads' no existe.");
            return res.status(404).json({ message: 'Directorio de uploads no encontrado.' });
        }

        const files = fs.readdirSync(directoryPath); 
        
        const catalogos = files.map((filename) => {
            return {
                filename,
                provider: 'Proveedor X',
                brand: 'Marca Y',
                publishedAt: new Date().toISOString(),
            };
        });

        res.status(200).json(catalogos);
    } catch (error) {
        console.error("Error al listar los catálogos:", error.message);
        res.status(500).json({ message: 'Error al listar los catálogos', error: error.message });
    }
};

// Eliminar un catálogo y su archivo asociado
const eliminarCatalogo = async (req, res) => {
    try {
        const { id } = req.params;
        const catalogo = await Catalogo.findByPk(id);

        if (!catalogo) {
            return res.status(404).json({ message: 'Catálogo no encontrado' });
        }

        const filePath = path.join(__dirname, '../uploads', catalogo.archivo);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await catalogo.destroy();
        res.status(200).json({ message: 'Catálogo eliminado correctamente' });
    } catch (error) {
        console.error("Error al eliminar el catálogo:", error);
        res.status(500).json({ message: 'Error al eliminar el catálogo', details: error.message });
    }
};

// Actualizar un catálogo existente
const actualizarCatalogo = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, proveedorId, marcaId } = req.body;

        const catalogo = await Catalogo.findByPk(id);

        if (!catalogo) {
            return res.status(404).json({ message: 'Catálogo no encontrado' });
        }

        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', catalogo.archivo);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            catalogo.archivo = req.file.filename;
            catalogo.nombre = req.file.originalname;
        }

        catalogo.nombre = nombre || catalogo.nombre;
        // catalogo.descripcion = descripcion || catalogo.descripcion;
        catalogo.proveedorId = proveedorId || catalogo.proveedorId;
        catalogo.marcaId = marcaId || catalogo.marcaId;

        await catalogo.save();
        res.status(200).json({ message: 'Catálogo actualizado correctamente', catalogo });
    } catch (error) {
        console.error("Error al actualizar el catálogo:", error);
        res.status(500).json({ message: 'Error al actualizar el catálogo', details: error.message });
    }
};

// Descargar un catálogo por su ID
const descargarCatalogo = async (req, res) => {
    try {
        const { id } = req.params;
        const catalogo = await Catalogo.findByPk(id);
        
        if (!catalogo) {
            return res.status(404).json({ message: 'Catálogo no encontrado' });
        }
        
        const filePath = path.join(__dirname, '../uploads', catalogo.archivo);
        
        if (fs.existsSync(filePath)) {
            res.download(filePath, catalogo.nombre);
        } else {
            res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
        }
    } catch (error) {
        console.error("Error al descargar el catálogo:", error);
        res.status(500).json({ message: 'Error al descargar el catálogo', details: error.message });
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