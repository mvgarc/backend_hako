const Catalogo = require('./Catalogo');
const Proveedor = require('./Proveedor');
const Marca = require('./Marca');

Proveedor.hasMany(Catalogo, { foreignKey: 'proveedorId' });
Marca.hasMany(Catalogo, { foreignKey: 'marcaId' });

Catalogo.belongsTo(Proveedor, { foreignKey: 'proveedorId' });
Catalogo.belongsTo(Marca, { foreignKey: 'marcaId' });

module.exports = {};