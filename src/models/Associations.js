const Catalogo = require('./Catalogo');
const Proveedor = require('./Proveedor');
const Marca = require('./Marca');

// Definir las asociaciones de uno a muchos
// Un Proveedor puede tener muchos Catalogos
Proveedor.hasMany(Catalogo, { foreignKey: 'proveedorId' });
// Una Marca puede tener muchos Catalogos
Marca.hasMany(Catalogo, { foreignKey: 'marcaId' });

// Definir las asociaciones de muchos a uno (ya están en Catalogo.js, pero se pueden repetir aquí para claridad)
Catalogo.belongsTo(Proveedor, { foreignKey: 'proveedorId' });
Catalogo.belongsTo(Marca, { foreignKey: 'marcaId' });
