// src/controllers/catalogo.controller.js

const Catalogo = require('../models/Catalogo');
const path = require('path');
const fs = require('fs');

// Crear un catálogo (esta función ahora espera 'archivo', 'provider' y 'marcaId' del frontend)
const crearCatalogo = async (req, res) => {
    try {
        // req.file contiene la información del archivo subido por Multer
        // req.body contendrá los campos de texto como 'provider' y 'marcaId'
        console.log("req.file (en controller):", req.file); // Para depuración del archivo
        console.log("req.body (en controller):", req.body); // Para depuración de los campos de texto

        // Validaciones básicas de los campos esperados
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
        }
        if (!req.body.provider) { // Asegúrate de que este es el nombre del campo en tu frontend (formData.append("provider", ...))
            return res.status(400).json({ message: 'Falta el ID del proveedor.' });
        }
        if (!req.body.marcaId) { // Asegúrate de que este es el nombre del campo en tu frontend (formData.append("marcaId", ...))
            return res.status(400).json({ message: 'Falta el ID de la marca.' });
        }

        // El 'nombre' del catálogo se tomará del nombre original del archivo
        const nombreCatalogo = req.file.originalname; 

        // Crear la entrada en la base de datos usando Sequelize
        const catalogo = await Catalogo.create({
            nombre: nombreCatalogo, // Usamos el nombre del archivo como nombre del catálogo
            archivo: req.file.filename, // Multer guarda el archivo con un nombre único en 'uploads/'
            proveedorId: req.body.provider, // Mapea al campo proveedorId en tu modelo Catalogo
            marcaId: req.body.marcaId // Mapea al campo marcaId en tu modelo Catalogo
            // Nota: Si 'descripcion' no está en tu modelo o es opcional, no lo incluyas aquí a menos que lo envíes desde el frontend.
        });
        
        res.status(201).json({ message: 'Catálogo creado correctamente', catalogo });
    } catch (error) {
        console.error("Error en crearCatalogo:", error);
        // Manejo específico para errores de validación de Sequelize (ej. campos faltantes, tipo de dato incorrecto)
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ message: 'Error de validación al crear el catálogo', errors });
        }
        res.status(500).json({ message: 'Error al crear el catálogo', details: error.message });
    }
};

// Obtener todos los catálogos (para mostrar en la tabla, por ejemplo)
const obtenerCatalogos = async (req, res) => {
    try {
        const catalogo = await Catalogo.findAll(); // Busca todos los catálogos en la DB
        
        // Mapea los catálogos para incluir un enlace de descarga (si aplica)
        const catalogosConEnlace = catalogo.map((catalogo) => ({
            id: catalogo.id,
            nombre: catalogo.nombre,
            // descripcion: catalogo.descripcion, // Incluir si tu modelo tiene 'descripcion'
            archivo: catalogo.archivo,
            // Genera el enlace de descarga completo para el frontend
            enlaceDescarga: `${req.protocol}://${req.get('host')}/api/catalogos/download/${catalogo.id}`
        }));
        
        res.status(200).json(catalogosConEnlace);
    } catch (error) {
        console.error("Error al obtener catálogos:", error);
        res.status(500).json({ message: 'Error al obtener catálogos', details: error.message });
    }
};

// Listar catálogos por archivos en el directorio 'uploads'
const listarCatalogos = (req, res) => {
    try {
        const directoryPath = path.join(__dirname, '../uploads');

        if (!fs.existsSync(directoryPath)) {
            console.log("La carpeta 'uploads' no existe.");
            // Considera crearla si no existe, o asegúrate de que el proceso de Node.js tenga permisos para crearla.
            return res.status(404).json({ message: 'Directorio de uploads no encontrado.' });
        }

        const files = fs.readdirSync(directoryPath); // Lee los nombres de los archivos en el directorio

        // Esto es una lista simple de archivos. Si necesitas más detalles (proveedor, marca),
        // deberías consultar tu base de datos en lugar de solo el sistema de archivos.
        const catalogos = files.map((filename) => {
            return {
                filename,
                provider: 'Proveedor X', // Estos son valores estáticos, deberías obtenerlos de la DB
                brand: 'Marca Y',     // Estos son valores estáticos, deberías obtenerlos de la DB
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
        const catalogo = await Catalogo.findByPk(id); // Busca el catálogo por ID en la DB

        if (!catalogo) {
            return res.status(404).json({ message: 'Catálogo no encontrado' });
        }

        // Eliminar el archivo físico del sistema de archivos
        const filePath = path.join(__dirname, '../uploads', catalogo.archivo);
        if (fs.existsSync(filePath)) { // Verifica si el archivo existe antes de intentar eliminarlo
            fs.unlinkSync(filePath); // Elimina el archivo
        }

        await catalogo.destroy(); // Elimina la entrada del catálogo de la base de datos
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
        // nombre y descripcion solo se esperan si los vas a manejar en el frontend para actualizar
        // o si los tomas de req.body
        const { nombre, descripcion, proveedorId, marcaId } = req.body; // Incluir los campos que esperas actualizar

        const catalogo = await Catalogo.findByPk(id);

        if (!catalogo) {
            return res.status(404).json({ message: 'Catálogo no encontrado' });
        }

        // Si se sube un nuevo archivo, elimina el anterior y actualiza la referencia
        if (req.file) {
            const filePath = path.join(__dirname, '../uploads', catalogo.archivo);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            catalogo.archivo = req.file.filename; // Actualiza con el nombre del nuevo archivo
            catalogo.nombre = req.file.originalname; // Actualiza el nombre del catálogo con el del nuevo archivo
        }

        // Actualiza los campos que se hayan enviado en el body
        catalogo.nombre = nombre || catalogo.nombre; // Si 'nombre' viene en el body, úsalo, sino mantén el actual
        // catalogo.descripcion = descripcion || catalogo.descripcion; // Descomentar si tu modelo tiene 'descripcion'
        catalogo.proveedorId = proveedorId || catalogo.proveedorId; // Actualizar proveedorId si se envía
        catalogo.marcaId = marcaId || catalogo.marcaId; // Actualizar marcaId si se envía

        await catalogo.save(); // Guarda los cambios en la base de datos
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
        const catalogo = await Catalogo.findByPk(id); // Busca el catálogo en la DB por ID
        
        if (!catalogo) {
            return res.status(404).json({ message: 'Catálogo no encontrado' });
        }
        
        const filePath = path.join(__dirname, '../uploads', catalogo.archivo); // Ruta al archivo físico
        
        if (fs.existsSync(filePath)) {
            res.download(filePath, catalogo.archivo); // Envía el archivo para descarga
        } else {
            res.status(404).json({ message: 'Archivo no encontrado en el servidor' });
        }
    } catch (error) {
        console.error("Error al descargar el catálogo:", error);
        res.status(500).json({ message: 'Error al descargar el catálogo', details: error.message });
    }
};

// Exportar todas las funciones para que puedan ser usadas por las rutas
module.exports = {
    crearCatalogo,
    obtenerCatalogos,
    eliminarCatalogo,
    actualizarCatalogo,
    descargarCatalogo,
    listarCatalogos
};