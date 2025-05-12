const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Proveedor = sequelize.define('Proveedor', {
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
    direccionFiscal: {
        type: DataTypes.STRING
    },
    nombreEmpresa: {
        type: DataTypes.STRING
    }
});

module.exports = Proveedor;