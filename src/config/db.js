const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

sequelize.authenticate()
    .then(() => console.log('Conexión a MySQL exitosa'))
    .catch((err) => console.error('Error al conectar con MySQL:', err));

module.exports = sequelize;