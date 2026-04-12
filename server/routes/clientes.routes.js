const express = require('express');

const clientesController = require('../controllers/clientes.controller');

const router = express.Router();

router.get('/', clientesController.listarClientes);
router.get('/:id', clientesController.obtenerClientePorId);
router.post('/', clientesController.crearCliente);

module.exports = router;
