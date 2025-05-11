const Proveedor = require('../models/Proveedor');

const proveedorController = {
    getProveedores: async (req, res) => {
        try {
        const proveedores = await Proveedor.findAll();
        res.json(proveedores);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    },
    createProveedor: async (req, res) => {
        try {
        const nuevoProveedor = await Proveedor.create(req.body);
        res.json(nuevoProveedor);
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    },
    getProveedorById: async (req, res) => {
        try {
        const proveedor = await Proveedor.findByPk(req.params.id);
        if (proveedor) {
            res.json(proveedor);
        } else {
            res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    },
    updateProveedor: async (req, res) => {
        try {
        const proveedor = await Proveedor.findByPk(req.params.id);
        if (proveedor) {
            await proveedor.update(req.body);
            res.json(proveedor);
        } else {
            res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    },
    deleteProveedor: async (req, res) => {
        try {
        const proveedor = await Proveedor.findByPk(req.params.id);
        if (proveedor) {
            await proveedor.destroy();
            res.json({ message: 'Proveedor eliminado' });
        } else {
            res.status(404).json({ message: 'Proveedor no encontrado' });
        }
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    }
};

module.exports = proveedorController;