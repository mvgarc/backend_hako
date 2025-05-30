const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Proveedor = require('./Proveedor');
const Marca = require('./Marca');

const Catalogo = sequelize.define('Catalogo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: { // Este es el campo que usaremos para req.file.originalname
        type: DataTypes.STRING,
        allowNull: false // Asegúrate de que esto sea lo que quieres
    },
    archivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    proveedorId: { // Este es el campo que recibirá req.body.provider
        type: DataTypes.INTEGER,
        references: {
            model: Proveedor,
            key: 'id'
        }
    },
    marcaId: { // Este es el campo que recibirá req.body.marcaId
        type: DataTypes.INTEGER,
        references: {
            model: Marca,
            key: 'id'
        }
    }
}, {
    tableName: 'catalogos',
    timestamps: false
});

// Relaciones (corrección de nombres y claves foráneas)
Proveedor.hasMany(Catalogo, { foreignKey: 'proveedorId' });
Marca.hasMany(Catalogo, { foreignKey: 'marcaId' });

Catalogo.belongsTo(Proveedor, { foreignKey: 'proveedorId' });
Catalogo.belongsTo(Marca, { foreignKey: 'marcaId' });

module.exports = Catalogo;