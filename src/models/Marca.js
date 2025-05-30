const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Catalogo = require('./Catalogo'); // ¡IMPORTANTE! Solo importa si la necesitas para la relación inversa aquí

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
    timestamps: false, // Mantienes esto en false
});

// Define la relación aquí si una Marca puede tener muchos Catalogos
Marca.hasMany(Catalogo, { foreignKey: 'marcaId' });

module.exports = Marca;