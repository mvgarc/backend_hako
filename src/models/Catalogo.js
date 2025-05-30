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
        allowNull: false
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
    timestamps: false // ¡Importante! Esto significa que no habrá createdAt/updatedAt en tu tabla 'catalogos'
});

// Relaciones para Catalogo (este "pertenece a" un Proveedor y una Marca)
Catalogo.belongsTo(Proveedor, { foreignKey: 'proveedorId' });
Catalogo.belongsTo(Marca, { foreignKey: 'marcaId' });

module.exports = Catalogo;