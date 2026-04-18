const clientesModel = require('../models/clientes.model');

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

    if (cliente.contraseña !== contraseña) {
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