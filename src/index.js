// index.js

require('dotenv').config();
const express = require('express');
const sequelize = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeceras permitidas en las solicitudes
    credentials: true, // Habilita el envío de cookies o credenciales (si tu frontend las envía)
    optionsSuccessStatus: 200 // Algunas versiones antiguas de navegadores (IE11, varios SmartTVs) se atascan con 204
};

// --- Activar CORS con opciones específicas ---
app.use(cors(corsOptions));

// Middlewares
// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// OJO: Servir archivos estáticos desde la carpeta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
const proveedorRoutes = require('./routes/proveedor.routes');
const marcaRoutes = require('./routes/marca.routes');
const catalogoRoutes = require('./routes/catalogo.routes');

app.use('/api/proveedores', proveedorRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/catalogos', catalogoRoutes);

// Pendiente porque aquí Sincronización con la base de datos
// ===> C A M B I A   A Q U Í <===
// Reemplaza la siguiente línea:
// sequelize.sync()
// Con esta nueva línea:
sequelize.sync({ alter: true })
    .then(() => {
        console.log('Conexión exitosa con la base de datos y modelos sincronizados (tablas recreadas).');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.log('Error al conectar o sincronizar con la base de datos:', err));