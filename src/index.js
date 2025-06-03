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
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const CatalogoModel = require('./models/Catalogo');
const ProveedorModel = require('./models/Proveedor');
const MarcaModel = require('./models/Marca');
const UsuarioModel = require('./models/Usuario');

require('./models/Associations');

// Importar rutas
const proveedorRoutes = require('./routes/proveedor.routes');
const marcaRoutes = require('./routes/marca.routes');
const catalogoRoutes = require('./routes/catalogo.routes');
const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');

app.use('/api/proveedores', proveedorRoutes);
app.use('/api/marcas', marcaRoutes);
app.use('/api/catalogos', catalogoRoutes);
app.use('/api/auth', authRoutes);
// *** CAMBIO AQUÍ ***
app.use('/api', dashboardRoutes);

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Conexión exitosa con la base de datos y modelos sincronizados.');
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.log('Error al conectar o sincronizar con la base de datos:', err));