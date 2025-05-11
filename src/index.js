const express = require('express');
const sequelize = require('./config/db');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
const proveedorRoutes = require('./routes/proveedor.routes');
const marcaRoutes = require('./routes/marca.routes');
const catalogoRoutes = require('./routes/catalogo.routes');

app.use('/api/proveedores', proveedorRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/catalogos', catalogoRoutes);

// Sincronización con la base de datos
sequelize.sync()
    .then(() => {
        console.log('Conexión exitosa con la base de datos');
        app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.log('Error al conectar con la base de datos:', err));