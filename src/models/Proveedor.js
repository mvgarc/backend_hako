const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Proveedor = sequelize.define('Proveedor', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paginaWeb: {
        type: DataTypes.STRING
    },
    vendedor: {
        type: DataTypes.STRING
    },
    telefono: {
        type: DataTypes.STRING
    },
    direccionFiscal: {
        type: DataTypes.STRING
    },
    nombreEmpresa: {
        type: DataTypes.STRING
    }
}, {
    tableName: 'Proveedor', // ¡IMPORTANTE! Cambia a plural si tu tabla se llama 'proveedores'
    freezeTableName: true, // Esto evitará que Sequelize pluralice 'Proveedor' a 'Proveedores'
    timestamps: false // Consistente con lo que hablamos. Si tu tabla tiene 'createdAt'/'updatedAt', ponlo a true.
});


module.exports = Proveedor;