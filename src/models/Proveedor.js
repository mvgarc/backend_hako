const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Catalogo = require('./Catalogo'); // ¡IMPORTANTE! Solo importa si la necesitas para la relación inversa aquí

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
    tableName: 'Proveedor', // Nombre de la tabla en la BD (singular)
    freezeTableName: true,
    timestamps: true // Asegúrate de que esto sea consistente. Si no quieres createdAt/updatedAt, ponlo a false.
                     // Si lo dejas en true, tu tabla Proveedor debe tener createdAt y updatedAt.
});

// Define la relación aquí si un Proveedor puede tener muchos Catalogos
// NOTA: Debes hacer esta asociación después de que ambos modelos (Proveedor y Catalogo) estén definidos
// Esto se suele hacer en un archivo de relaciones o al final de tus modelos.
// Si lo haces aquí, asegúrate de que Catalogo ya esté requerido.
Proveedor.hasMany(Catalogo, { foreignKey: 'proveedorId' });

module.exports = Proveedor;