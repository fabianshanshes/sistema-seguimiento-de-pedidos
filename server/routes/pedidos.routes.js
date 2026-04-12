const express = require('express');

const pedidosController = require('../controllers/pedidos.controller');
const historialController = require('../controllers/historial.controller');

const router = express.Router();

router.get('/', pedidosController.listarPedidos);
router.get('/:id', pedidosController.obtenerPedidoPorId);
router.get('/:id/historial', historialController.listarHistorialPorPedido);
router.post('/', pedidosController.crearPedido);
router.post('/:id/historial', historialController.crearEventoHistorial);
router.patch('/:id/estado', pedidosController.actualizarEstadoPedido);

module.exports = router;
