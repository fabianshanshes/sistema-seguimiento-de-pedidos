const db = require('../config/db');
const emailService = require('../services/email.service');
const clientesModel = require('./clientes.model');

const ESTADOS_VALIDOS = ['pendiente', 'en proceso', 'entregado'];

async function getAll() {
  const [rows] = await db.query(
    `SELECT
      p.id,
      p.numero_pedido,
      p.cliente_id,
      c.nombre AS cliente_nombre,
      c.email AS cliente_email,
      p.fecha_pedido,
      p.estado,
      p.detalle_pedido
    FROM pedidos p
    LEFT JOIN clientes c ON c.id = p.cliente_id
    ORDER BY p.fecha_pedido DESC, p.id DESC`
  );

  return rows;
}

async function getById(id) {
  const [rows] = await db.query(
    `SELECT
      p.id,
      p.numero_pedido,
      p.cliente_id,
      c.nombre AS cliente_nombre,
      c.direccion AS cliente_direccion,
      c.telefono AS cliente_telefono,
      c.email AS cliente_email,
      p.fecha_pedido,
      p.estado,
      p.detalle_pedido
    FROM pedidos p
    LEFT JOIN clientes c ON c.id = p.cliente_id
    WHERE p.id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function getHistoryByPedidoId(pedidoId) {
  const [rows] = await db.query(
    `SELECT id, pedido_id, fecha_evento, estado, comentarios
    FROM historial_seguimiento
    WHERE pedido_id = ?
    ORDER BY fecha_evento DESC, id DESC`,
    [pedidoId]
  );

  return rows;
}

async function create({ numero_pedido, cliente_id, fecha_pedido, estado, detalle_pedido }) {
  const [result] = await db.query(
    `INSERT INTO pedidos (numero_pedido, cliente_id, fecha_pedido, estado, detalle_pedido)
    VALUES (?, ?, ?, ?, ?)`,
    [numero_pedido, cliente_id, fecha_pedido, estado, detalle_pedido]
  );

  return getById(result.insertId);
}

async function updateEstado(id, estado, comentarios) {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const pedidoAnterior = await getById(id);
    if (!pedidoAnterior) {
      await connection.rollback();
      return null;
    }
    
    const estadoAnterior = pedidoAnterior.estado;
    
    const [updateResult] = await connection.query(
      'UPDATE pedidos SET estado = ? WHERE id = ?',
      [estado, id]
    );
    
    if (updateResult.affectedRows === 0) {
      await connection.rollback();
      return null;
    }
    
    await connection.query(
      `INSERT INTO historial_seguimiento (pedido_id, fecha_evento, estado, comentarios)
      VALUES (?, NOW(), ?, ?)`,
      [id, estado, comentarios || null]
    );
    
    await connection.commit();
    
    const pedidoActualizado = await getById(id);
    
    if (pedidoActualizado && estadoAnterior !== estado) {
      const cliente = await clientesModel.getById(pedidoActualizado.cliente_id);
      if (cliente && cliente.email) {
        emailService.enviarNotificacionEstado(cliente, pedidoActualizado, estadoAnterior, comentarios)
          .catch(error => console.error('Error en envío de correo:', error));
      }
    }
    
    return pedidoActualizado;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}
async function createWithDetails({ numero_pedido, cliente_id, fecha_pedido, estado, detalle_pedido, productos }) {
  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const [result] = await connection.query(
      `INSERT INTO pedidos (numero_pedido, cliente_id, fecha_pedido, estado, detalle_pedido)
       VALUES (?, ?, ?, ?, ?)`,
      [numero_pedido, cliente_id, fecha_pedido, estado, detalle_pedido || JSON.stringify(productos)]
    );
    
    const pedidoId = result.insertId;
    let total = 0;
    
    for (const item of productos) {
      const producto = await getProductoById(item.producto_id);
      if (!producto) {
        throw new Error(`Producto ${item.producto_id} no encontrado`);
      }
      
      const subtotal = producto.precio * item.cantidad;
      total += subtotal;
      
      await connection.query(
        `INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [pedidoId, item.producto_id, item.cantidad, producto.precio, subtotal]
      );
      
      await connection.query(
        `UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?`,
        [item.cantidad, item.producto_id, item.cantidad]
      );
    }
    
    await connection.commit();
    return getById(pedidoId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

async function getProductoById(id) {
  const [rows] = await db.query(
    `SELECT id, nombre, precio, stock FROM productos WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function getDetallesByPedidoId(pedidoId) {
  const [rows] = await db.query(
    `SELECT dp.*, p.nombre as producto_nombre
     FROM detalle_pedido dp
     JOIN productos p ON p.id = dp.producto_id
     WHERE dp.pedido_id = ?`,
    [pedidoId]
  );
  return rows;
}
module.exports = {
  ESTADOS_VALIDOS,
  create,
  getAll,
  getById,
  getHistoryByPedidoId,
  updateEstado,
  createWithDetails,
  getDetallesByPedidoId,
  getProductoById
};
