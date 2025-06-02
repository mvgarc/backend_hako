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
    tableName: 'proveedor', 
    freezeTableName: true, 
    timestamps: true 
});


module.exports = Proveedor;