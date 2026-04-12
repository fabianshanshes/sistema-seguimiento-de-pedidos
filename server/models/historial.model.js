const db = require('../config/db');

async function getByPedidoId(pedidoId) {
  const [rows] = await db.query(
    `SELECT id, pedido_id, fecha_evento, estado, comentarios
    FROM historial_seguimiento
    WHERE pedido_id = ?
    ORDER BY fecha_evento DESC, id DESC`,
    [pedidoId]
  );

  return rows;
}

async function getById(id) {
  const [rows] = await db.query(
    `SELECT id, pedido_id, fecha_evento, estado, comentarios
    FROM historial_seguimiento
    WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function create({ pedido_id, estado, comentarios }) {
  const [result] = await db.query(
    `INSERT INTO historial_seguimiento (pedido_id, fecha_evento, estado, comentarios)
    VALUES (?, NOW(), ?, ?)`,
    [pedido_id, estado, comentarios || null]
  );

  return getById(result.insertId);
}

async function createAndUpdatePedidoEstado({ pedido_id, estado, comentarios }) {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO historial_seguimiento (pedido_id, fecha_evento, estado, comentarios)
      VALUES (?, NOW(), ?, ?)`,
      [pedido_id, estado, comentarios || null]
    );

    await connection.query(
      'UPDATE pedidos SET estado = ? WHERE id = ?',
      [estado, pedido_id]
    );

    await connection.commit();
    return getById(result.insertId);
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  create,
  createAndUpdatePedidoEstado,
  getById,
  getByPedidoId
};
