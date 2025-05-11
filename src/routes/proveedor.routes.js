const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedor.controller');

// Rutas CRUD para Proveedores
router.post('/', proveedorController.createProveedor);
router.get('/', proveedorController.getProveedores);
router.get('/:id', proveedorController.getProveedorById);
router.put('/:id', proveedorController.updateProveedor);
router.delete('/:id', proveedorController.deleteProveedor);

module.exports = router;