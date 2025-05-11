const { Sequelize } = require('sequelize');

// Configuración de la conexión
const sequelize = new Sequelize('nombre_de_tu_bd', 'usuario', 'password', {
    host: 'localhost',
    dialect: 'mysql',
    });

    // Verificar conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente.');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error);
    }
};

testConnection();

module.exports = sequelize;