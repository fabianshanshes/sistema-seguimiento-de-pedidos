const db = require('../config/db');

async function getAll() {
  const [rows] = await db.query(
    `SELECT id, nombre, descripcion, precio, stock, categoria, imagen_url
     FROM productos
     WHERE activo = 1
     ORDER BY nombre ASC`
  );
  return rows;
}

async function getById(id) {
  const [rows] = await db.query(
    `SELECT id, nombre, descripcion, precio, stock, categoria, imagen_url
     FROM productos
     WHERE id = ? AND activo = 1`,
    [id]
  );
  return rows[0] || null;
}

async function getByCategoria(categoria) {
  const [rows] = await db.query(
    `SELECT id, nombre, descripcion, precio, stock, categoria, imagen_url
     FROM productos
     WHERE categoria = ? AND activo = 1
     ORDER BY nombre ASC`,
    [categoria]
  );
  return rows;
}

async function updateStock(id, cantidad) {
  await db.query(
    `UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?`,
    [cantidad, id, cantidad]
  );
}

async function updateActivo(id, activo) {
  await db.query(
    `UPDATE productos SET activo = ? WHERE id = ?`,
    [activo, id]
  );
}

async function create({ nombre, descripcion, precio, stock, categoria, imagen_url }) {
  const [result] = await db.query(
    `INSERT INTO productos (nombre, descripcion, precio, stock, categoria, imagen_url, activo)
     VALUES (?, ?, ?, ?, ?, ?, 1)`,
    [nombre, descripcion, precio, stock || 0, categoria, imagen_url || null]
  );
  return getById(result.insertId);
}

module.exports = {
  getAll,
  getById,
  getByCategoria,
  updateStock,
  create,
  updateActivo
};