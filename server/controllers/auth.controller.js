const clientesModel = require('../models/clientes.model');
const bcrypt = require('bcrypt');

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function login(req, res, next) {
  try {
    const { email, contraseña } = req.body;

    if (!email || !contraseña) {
      throw createHttpError(400, 'Email y contraseña son obligatorios');
    }

    const cliente = await clientesModel.getByEmail(email);
    
    if (!cliente) {
      throw createHttpError(401, 'Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(contraseña, cliente.contraseña);
    
    if (!isPasswordValid) {
      throw createHttpError(401, 'Credenciales inválidas');
    }

    delete cliente.contraseña;
    
    res.json({ 
      message: 'Login exitoso', 
      usuario: cliente 
    });
  } catch (error) {
    next(error);
  }
}

module.exports = { login };