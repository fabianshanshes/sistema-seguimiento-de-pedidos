const express = require('express');
const productosController = require('../controllers/productos.controller');

const router = express.Router();

router.get('/', productosController.listarProductos);
router.get('/:id', productosController.obtenerProductoPorId);
router.post('/', productosController.crearProducto);

module.exports = router;