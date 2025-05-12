const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Marca = sequelize.define('Marca', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    logo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    }, {
    tableName: 'marcas', // El nombre de la tabla en la BD
    timestamps: false,
});

module.exports = Marca;