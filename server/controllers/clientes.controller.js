const clientesModel = require('../models/clientes.model');
const bcrypt = require('bcrypt');

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function listarClientes(req, res, next) {
  try {
    const clientes = await clientesModel.getAll();
    res.json(clientes);
  } catch (error) {
    next(error);
  }
}

async function obtenerClientePorId(req, res, next) {
  try {
    const clienteId = Number(req.params.id);
    if (!Number.isInteger(clienteId) || clienteId <= 0) {
      throw createHttpError(400, 'El id del cliente no es valido');
    }
    const cliente = await clientesModel.getById(clienteId);
    if (!cliente) {
      throw createHttpError(404, 'Cliente no encontrado');
    }
    res.json(cliente);
  } catch (error) {
    next(error);
  }
}

async function crearCliente(req, res, next) {
  try {
    const { nombre, direccion, telefono, email, contraseña } = req.body;
    
    if (!nombre || !direccion || !email) {
      throw createHttpError(400, 'Los campos nombre, direccion y email son obligatorios');
    }

    if (!contraseña) {
      throw createHttpError(400, 'La contraseña es obligatoria');
    }

    const existing = await clientesModel.getByEmail(email);
    if (existing) {
      throw createHttpError(409, 'El email ya esta registrado');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

    const cliente = await clientesModel.create({
      nombre: String(nombre).trim(),
      direccion: String(direccion).trim(),
      telefono: telefono ? String(telefono).trim() : null,
      email: String(email).trim(),
      contraseña: hashedPassword
    });

    delete cliente.contraseña;
    res.status(201).json(cliente);
  } catch (error) {
    console.error('Error en crear cliente:', error);
    next(error);
  }
}

module.exports = {
  crearCliente,
  listarClientes,
  obtenerClientePorId
};