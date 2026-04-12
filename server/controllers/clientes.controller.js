const clientesModel = require('../models/clientes.model');

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
    const { nombre, direccion, telefono, email } = req.body;

    if (!nombre || !direccion) {
      throw createHttpError(400, 'Los campos nombre y direccion son obligatorios');
    }

    const cliente = await clientesModel.create({
      nombre: String(nombre).trim(),
      direccion: String(direccion).trim(),
      telefono: telefono ? String(telefono).trim() : null,
      email: email ? String(email).trim() : null
    });

    res.status(201).json(cliente);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  crearCliente,
  listarClientes,
  obtenerClientePorId
};
