const Catalogo = require('../models/Catalogo');
const Proveedor = require('../models/Proveedor');
const Marca = require('../models/Marca');
const { Sequelize, DataTypes, Op } = require('sequelize'); 

const getDashboardStats = async (req, res) => {
    try {
        const totalArchivos = await Catalogo.count();

        const totalProveedores = await Proveedor.count();

        const totalMarcas = await Marca.count();

        const ultimoCatalogo = await Catalogo.findOne({
            order: [['publishedAt', 'DESC']]
        });
        const ultimaActualizacion = ultimoCatalogo ? new Date(ultimoCatalogo.publishedAt).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }) : 'N/A';


        const filesByProvider = await Catalogo.findAll({
            attributes: [
                [Sequelize.fn('COUNT', Sequelize.col('Catalogo.id')), 'count'] // Alias 'count' para el resultado del conteo
            ],
            include: [{
                model: Proveedor,
                attributes: ['nombre'] // Incluye el nombre del proveedor
            }],
            group: ['Proveedor.id', 'Proveedor.nombre'], // Agrupa por ID y nombre del proveedor para obtener el conteo correcto
            raw: true // Devuelve resultados sin las instancias de Sequelize
        });

        // Formatear los datos para el componente Chart del frontend
        const chartData = filesByProvider.map(item => ({
            name: item['Proveedor.nombre'], // Accede al nombre del proveedor
            value: parseInt(item.count, 10) // Convierte el conteo a número
        }));

        res.status(200).json({
            totalArchivos,
            totalProveedores,
            totalMarcas,
            ultimaActualizacion,
            chartData
        });

    } catch (error) {
        console.error("Error al obtener estadísticas del dashboard:", error);
        res.status(500).json({ message: 'Error al obtener estadísticas del dashboard', details: error.message });
    }
};

module.exports = {
    getDashboardStats
};