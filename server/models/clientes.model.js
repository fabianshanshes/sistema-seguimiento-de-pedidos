const db = require('../config/db');

async function getAll() {
  const [rows] = await db.query(
    `SELECT id, nombre, direccion, telefono, email
    FROM clientes
    ORDER BY nombre ASC, id ASC`
  );

  return rows;
}

async function getById(id) {
  const [rows] = await db.query(
    `SELECT id, nombre, direccion, telefono, email
    FROM clientes
    WHERE id = ?`,
    [id]
  );

  return rows[0] || null;
}

async function create({ nombre, direccion, telefono, email, contraseña }) {
  const [result] = await db.query(
    `INSERT INTO clientes (nombre, direccion, telefono, email, contraseña)
    VALUES (?, ?, ?, ?, ?)`,
    [nombre, direccion, telefono, email, contraseña]
  );

  return getById(result.insertId);
}

async function getByEmail(email) {
  const [rows] = await db.query(
    `SELECT id, nombre, direccion, telefono, email, contraseña
    FROM clientes
    WHERE email = ?`,
    [email]
  );
  return rows[0] || null;
}

module.exports = {
  create,
  getAll,
  getById,
  getByEmail
};
