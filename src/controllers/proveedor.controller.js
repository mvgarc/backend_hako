const Proveedor = require('../models/Proveedor');

// Obtener todos los proveedores
const getProveedores = async (req, res) => {
    try {
        const proveedores = await Proveedor.findAll();
        res.status(200).json(proveedores);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener proveedores' });
    }
};

// Crear un proveedor
const createProveedor = async (req, res) => {
    try {
        const { nombre, paginaWeb, vendedor, direccionFiscal, nombreEmpresa } = req.body;
        const nuevoProveedor = await Proveedor.create({
        nombre,
        paginaWeb,
        vendedor,
        direccionFiscal,
        nombreEmpresa
        });
        res.status(201).json(nuevoProveedor);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear proveedor' });
    }
};

module.exports = {
    getProveedores,
    createProveedor
};