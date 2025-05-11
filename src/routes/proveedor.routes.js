const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedor.controller');

// Definición de las rutas
router.get('/', proveedorController.getProveedores);
router.post('/', proveedorController.createProveedor);
router.get('/:id', proveedorController.getProveedorById);
router.put('/:id', proveedorController.updateProveedor);
router.delete('/:id', proveedorController.deleteProveedor);

module.exports = router