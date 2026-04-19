const productosModel = require('../models/productos.model');

function createHttpError(status, message) {
  const error = new Error(message);
  error.status = status;
  return error;
}

async function listarProductos(req, res, next) {
  try {
    const productos = await productosModel.getAll();
    res.json(productos);
  } catch (error) {
    next(error);
  }
}

async function obtenerProductoPorId(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw createHttpError(400, 'ID de producto inválido');
    }
    const producto = await productosModel.getById(id);
    if (!producto) {
      throw createHttpError(404, 'Producto no encontrado');
    }
    res.json(producto);
  } catch (error) {
    next(error);
  }
}

async function crearProducto(req, res, next) {
  try {
    const { nombre, descripcion, precio, stock, categoria, imagen_url } = req.body;

    if (!nombre || !precio) {
      throw createHttpError(400, 'Los campos nombre y precio son obligatorios');
    }

    const producto = await productosModel.create({
      nombre: String(nombre).trim(),
      descripcion: descripcion || null,
      precio: Number(precio),
      stock: Number(stock) || 0,
      categoria: categoria || null,
      imagen_url: imagen_url || null
    });

    res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listarProductos,
  obtenerProductoPorId,
  crearProducto
};