const Catalogo = require('../models/Catalogo');
const Proveedor = require('../models/Proveedor'); 
const Marca = require('../models/Marca');       
const path = require('path');
const fs = require('fs');

// Crear un catálogo (esta función ahora espera 'archivo', 'providerId' y 'marcaId' del frontend)
const crearCatalogo = async (req, res) => {
    try {
        // req.file contiene la información del archivo subido por Multer
        // req.body contendrá los campos de texto como 'providerId' y 'marcaId'
        console.log("req.file (en controller):", req.file); // Para depuración del archivo
        console.log("req.body (en controller):", req.body); // Para depuración de los campos de texto

        // Validaciones básicas de los campos esperados
        if (!req.file) {
            return res.status(400).json({ message: 'No se ha subido ningún archivo.' });
        }
        // Nota: En tu frontend, si el campo se llama 'provider' en el formData,
        // aquí será req.body.provider. Asegúrate de que el nombre del campo coincida.
        if (!req.body.provider) { // <-- Se espera 'provider' del frontend, que mapea a 'proveedorId'
            return res.status(400).json({ message: 'Falta el ID del proveedor.' });
        }
        if (!req.body.marcaId) { // <-- Se espera 'marcaId' del frontend
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
            // Nota: Si 'descripcion' o 'publishedAt' no están en tu modelo Catalogo o son opcionales,
            // no los incluyas aquí a menos que los envíes desde el frontend y los tengas en tu modelo.
        });
        
        res.status(201).json({ message: 'Catálogo creado correctamente', catalogo });
    } catch (error) {
        console.error("Error en crearCatalogo:", error);
        // Manejo específico para errores de validación de Sequelize (ej. campos faltantes, tipo de dato incorrecto)
        if (error.name === 'SequelizeValidationError') {
            const errors = error.errors.map(err => err.message);
            return res.status(400).json({ message: 'Error de validación al crear el catálogo', errors });
        }
        // Manejo específico para errores de clave foránea
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
            // ===> ESTA ES LA CLAVE PARA TRAER LOS NOMBRES DE PROVEEDORES Y MARCAS <===
            include: [
                {
                    model: Proveedor, // Incluye el modelo Proveedor
                    attributes: ['nombre'] // Solo trae el campo 'nombre' del Proveedor
                },
                {
                    model: Marca,     // Incluye el modelo Marca
                    attributes: ['nombre'] // Solo trae el campo 'nombre' de la Marca
                }
            ]
        });
        
        // Mapea los catálogos para incluir la información completa necesaria para el frontend
        const catalogosConInfoCompleta = catalogos.map((item) => {
            // Accede a los nombres de las relaciones. Sequelize adjunta el modelo
            // relacionado como una propiedad con el nombre del modelo.
            const proveedorNombre = item.Proveedor ? item.Proveedor.nombre : 'Desconocido';
            const marcaNombre = item.Marca ? item.Marca.nombre : 'Desconocida';

            return {
                id: item.id,
                filename: item.nombre, // 'nombre' del catálogo es el nombre original del archivo
                provider: proveedorNombre,
                brand: marcaNombre,
                // publishedAt: Como tu modelo Catalogo tiene timestamps: false, 'createdAt' no existe en la DB.
                // Si necesitas una fecha de publicación, deberías añadir un campo 'publishedAt' (DataTypes.DATE)
                // a tu modelo Catalogo y gestionarlo manualmente al crear.
                // Por ahora, pondremos un valor por defecto que el frontend pueda manejar.
                publishedAt: 'N/A', // O puedes poner una fecha fija, o dejarlo vacío si tu frontend lo acepta
                notes: "", // Si tu modelo Catalogo tiene un campo 'notes', lo mapearías aquí: item.notes
                enlaceDescarga: `${req.protocol}://${req.get('host')}/api/catalogos/download/${item.id}`
            };
        });
        
        res.status(200).json(catalogosConInfoCompleta);
    } catch (error) {
        console.error("Error al obtener catálogos:", error);
        res.status(500).json({ message: 'Error al obtener catálogos', details: error.message });
    }
};

// Listar catálogos por archivos en el directorio 'uploads' (Esta función no usa la DB para detalles)
// Si quieres que esta función también devuelva los detalles de la DB, deberías modificarla
// para hacer consultas a la DB.
const listarCatalogos = (req, res) => {
    try {
        const directoryPath = path.join(__dirname, '../uploads');

        if (!fs.existsSync(directoryPath)) {
            console.log("La carpeta 'uploads' no existe.");
            return res.status(404).json({ message: 'Directorio de uploads no encontrado.' });
        }

        const files = fs.readdirSync(directoryPath); // Lee los nombres de los archivos en el directorio

        // Esto es una lista simple de archivos. Si necesitas más detalles (proveedor, marca),
        // deberías consultar tu base de datos en lugar de solo el sistema de archivos (similar a obtenerCatalogos).
        const catalogos = files.map((filename) => {
            return {
                filename,
                provider: 'Proveedor X', // Estos son valores estáticos, deberías obtenerlos de la DB
                brand: 'Marca Y',     // Estos son valores estáticos, deberías obtenerlos de la DB
                publishedAt: new Date().toISOString(), // Fecha actual del servidor
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
            res.download(filePath, catalogo.nombre); // Envía el archivo para descarga, usando el nombre original
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