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
        type: DataTypes.DATE, // Tipo de dato DATE para fechas y horas
        allowNull: false, // Asegura que siempre tenga una fecha
        defaultValue: DataTypes.NOW // Establece la fecha y hora actual por defecto
    }
}, {
    tableName: 'catalogos',
    timestamps: false // Lo mantienes en false porque quieres un campo específico
});

// Relaciones (mantén estas relaciones tal cual, o asegúrate de que están en associations.js)
Catalogo.belongsTo(Proveedor, { foreignKey: 'proveedorId' });
Catalogo.belongsTo(Marca, { foreignKey: 'marcaId' });

module.exports = Catalogo;