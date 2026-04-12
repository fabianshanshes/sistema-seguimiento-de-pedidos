const historialModel = require('../models/historial.model');
const pedidosModel = require('../models/pedidos.model');

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateEstado(estado) {
  return pedidosModel.ESTADOS_VALIDOS.includes(estado);
}

async function listarHistorialPorPedido(req, res, next) {
  try {
    const pedidoId = Number(req.params.id);

    if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
      throw createHttpError(400, 'El id del pedido no es valido');
    }

    const pedido = await pedidosModel.getById(pedidoId);

    if (!pedido) {
      throw createHttpError(404, 'Pedido no encontrado');
    }

    const historial = await historialModel.getByPedidoId(pedidoId);
    res.json(historial);
  } catch (error) {
    next(error);
  }
}

async function crearEventoHistorial(req, res, next) {
  try {
    const pedidoId = Number(req.params.id);
    const { estado, comentarios } = req.body;

    if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
      throw createHttpError(400, 'El id del pedido no es valido');
    }

    if (!estado) {
      throw createHttpError(400, 'El campo estado es obligatorio');
    }

    if (!validateEstado(estado)) {
      throw createHttpError(400, 'El estado enviado no es valido');
    }

    const pedido = await pedidosModel.getById(pedidoId);

    if (!pedido) {
      throw createHttpError(404, 'Pedido no encontrado');
    }

    const evento = await historialModel.createAndUpdatePedidoEstado({
      pedido_id: pedidoId,
      estado,
      comentarios: comentarios || null
    });

    res.status(201).json(evento);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  crearEventoHistorial,
  listarHistorialPorPedido
};
