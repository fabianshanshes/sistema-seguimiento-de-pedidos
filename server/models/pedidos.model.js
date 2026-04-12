const db = require('../config/db');

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
    return getById(id);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  ESTADOS_VALIDOS,
  create,
  getAll,
  getById,
  getHistoryByPedidoId,
  updateEstado
};
