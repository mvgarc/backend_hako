const Catalogo = require('../models/Catalogo');
const path = require('path');
const fs = require('fs');

// Crear un catálogo
const crearCatalogo = async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        console.log("req.file:", req.file); // Debe mostrar los datos del archivo
        console.log("req.body:", req.body); // Debe mostrar nombre y descripción

        const catalogo = await Catalogo.create({
        nombre,
        descripcion,
        archivo: req.file.filename
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
        const catalogo = await Catalogo.findAll();
    
        // Generar un enlace de descarga para cada catálogo
        const catalogosConEnlace = catalogo.map((catalogo) => ({
            id: catalogo.id,
            nombre: catalogo.nombre,
            descripcion: catalogo.descripcion,
            archivo: catalogo.archivo,
            enlaceDescarga: `${req.protocol}://${req.get('host')}/api/catalogos/download/${catalogo.id}`
        }));
        
        res.status(200).json(catalogosConEnlace);
    
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al obtener catálogos' });
    }
};

const listarCatalogos = (req, res) => {
    let catalogos; // Declarar 'catalogos' fuera del try
    try {
        const directoryPath = path.join(__dirname, '../uploads');

        // Verificar si el directorio existe
        if (!fs.existsSync(directoryPath)) {
            console.log("La carpeta 'uploads' no existe.");
            return res.status(404).json({ message: 'Directorio de uploads no encontrado.' });
        }

        // Leer los archivos del directorio
        const files = fs.readdirSync(directoryPath);

        // Definir "catalogos" correctamente
        catalogos = files.map((filename) => {
            return {
                filename,
                provider: 'Proveedor X',
                brand: 'Marca Y',
                publishedAt: new Date().toISOString(),
            };
        });

        // Responder con el arreglo de "catalogos"
        res.status(200).json(catalogos);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error al listar los catálogos', error: error.message });
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
        const filePath = path.join(__dirname, '../uploads', catalogo.archivo);
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
                const filePath = path.join(__dirname, '../uploads', catalogo.archivo);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                catalogo.archivo = req.file.filename;
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

// Descargar un catálogo
const descargarCatalogo = async (req, res) => {
        try {
        const { id } = req.params;
        const catalogo = await Catalogo.findByPk(id);
    
        if (!catalogo) {
            return res.status(404).json({ message: 'Catálogo no encontrado' });
        }
    
        // Ruta absoluta del archivo
        const filePath = path.join(__dirname, '../uploads', catalogo.archivo);
    
        // Verifica si el archivo existe
        if (fs.existsSync(filePath)) {
            res.download(filePath, catalogo.archivo);
        } else {
            res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
        }
    
        } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al descargar el catálogo' });
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