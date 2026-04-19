const pedidosModel = require('../models/pedidos.model');

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

function validateEstado(estado) {
  return pedidosModel.ESTADOS_VALIDOS.includes(estado);
}

async function listarPedidos(req, res, next) {
  try {
    const pedidos = await pedidosModel.getAll();
    res.json(pedidos);
  } catch (error) {
    next(error);
  }
}

async function obtenerPedidoPorId(req, res, next) {
  try {
    const pedidoId = Number(req.params.id);

    if (!Number.isInteger(pedidoId) || pedidoId <= 0) {
      throw createHttpError(400, 'El id del pedido no es valido');
    }

    const pedido = await pedidosModel.getById(pedidoId);

    if (!pedido) {
      throw createHttpError(404, 'Pedido no encontrado');
    }

    const historial = await pedidosModel.getHistoryByPedidoId(pedidoId);

    res.json({
      ...pedido,
      historial
    });
  } catch (error) {
    next(error);
  }
}

async function crearPedido(req, res, next) {
  try {
    const { numero_pedido, cliente_id, fecha_pedido, estado, detalle_pedido, productos } = req.body;

    if (!numero_pedido || !fecha_pedido || !cliente_id) {
      throw createHttpError(
        400,
        'Los campos numero_pedido, cliente_id y fecha_pedido son obligatorios'
      );
    }

    const estadoFinal = estado || 'pendiente';

    if (!validateEstado(estadoFinal)) {
      throw createHttpError(400, 'El estado enviado no es valido');
    }

    let pedido;
    
    if (productos && productos.length > 0) {
      pedido = await pedidosModel.createWithDetails({
        numero_pedido: String(numero_pedido).trim(),
        cliente_id: Number(cliente_id),
        fecha_pedido,
        estado: estadoFinal,
        detalle_pedido: detalle_pedido || JSON.stringify(productos),
        productos
      });
    } else {
      pedido = await pedidosModel.create({
        numero_pedido: String(numero_pedido).trim(),
        cliente_id: Number(cliente_id),
        fecha_pedido,
        estado: estadoFinal,
        detalle_pedido: detalle_pedido || null
      });
    }

    res.status(201).json(pedido);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return next(createHttpError(409, 'El numero de pedido ya existe'));
    }
    if (error.code === 'ER_NO_REFERENCED_ROW_2') {
      return next(createHttpError(400, 'El cliente indicado no existe'));
    }
    next(error);
  }
}

async function actualizarEstadoPedido(req, res, next) {
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

    const pedidoActualizado = await pedidosModel.updateEstado(pedidoId, estado, comentarios);

    if (!pedidoActualizado) {
      throw createHttpError(404, 'Pedido no encontrado');
    }

    res.json(pedidoActualizado);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  actualizarEstadoPedido,
  crearPedido,
  listarPedidos,
  obtenerPedidoPorId
};
