const Catalogo = require('./Catalogo');
const Proveedor = require('./Proveedor');
const Marca = require('./Marca');

// Definir las asociaciones DE UNO A MUCHOS
// Un Proveedor puede tener muchos Catalogos
Proveedor.hasMany(Catalogo, { foreignKey: 'proveedorId' });
// Una Marca puede tener muchos Catalogos
Marca.hasMany(Catalogo, { foreignKey: 'marcaId' });

// Definir las asociaciones DE MUCHOS A UNO
// Un Catalogo pertenece a un Proveedor
Catalogo.belongsTo(Proveedor, { foreignKey: 'proveedorId' });
// Un Catalogo pertenece a una Marca
Catalogo.belongsTo(Marca, { foreignKey: 'marcaId' });

// No es necesario exportar nada específico si solo se usa para ejecutar las asociaciones
module.exports = {};