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
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    archivo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    proveedorId: {
        type: DataTypes.INTEGER,
        references: {
            model: Proveedor,
            key: 'id'
        }
    },
    marcaId: {
        type: DataTypes.INTEGER,
        references: {
            model: Marca,
            key: 'id'
        }
    },
    publishedAt: {
        type: DataTypes.DATE, 
        allowNull: true, 
        defaultValue: DataTypes.NOW 
    }
}, {
    tableName: 'catalogos',
    timestamps: false // Lo mantienes en false porque quieres un campo específico
});

module.exports = Catalogo;