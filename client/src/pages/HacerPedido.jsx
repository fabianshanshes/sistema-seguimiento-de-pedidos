// client/src/pages/HacerPedido.jsx
import React, { useState, useEffect } from 'react';
import api from '../api';

export default function HacerPedido({ usuario }) {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('todos');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    try {
      const res = await api.get('/productos');
      setProductos(res.data);
      const cats = ['todos', ...new Set(res.data.map(p => p.categoria).filter(Boolean))];
      setCategorias(cats);
    } catch (error) {
      console.error('Error cargando productos:', error);
      alert('Error al cargar productos');
    }
  };

  const agregarAlCarrito = (producto) => {
    const existente = carrito.find(item => item.id === producto.id);
    if (existente) {
      setCarrito(carrito.map(item =>
        item.id === producto.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarDelCarrito = (productoId) => {
    const existente = carrito.find(item => item.id === productoId);
    if (existente && existente.cantidad > 1) {
      setCarrito(carrito.map(item =>
        item.id === productoId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      ));
    } else {
      setCarrito(carrito.filter(item => item.id !== productoId));
    }
  };

  const eliminarDelCarrito = (productoId) => {
    setCarrito(carrito.filter(item => item.id !== productoId));
  };

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (carrito.length === 0) {
      alert('Agrega al menos un producto al pedido');
      return;
    }

    setLoading(true);
    
    try {
      const numeroPedido = `PED-${Date.now()}`;
      
      await api.post('/pedidos', {
        numero_pedido: numeroPedido,
        cliente_id: usuario.id,
        fecha_pedido: new Date().toISOString().split('T')[0],
        estado: 'pendiente',
        detalle_pedido: JSON.stringify(carrito.map(item => ({
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio
        }))),
        productos: carrito.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad
        }))
      });
      
      setExito(true);
      setCarrito([]);
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Error al crear pedido');
    } finally {
      setLoading(false);
    }
  };

  const productosFiltrados = categoriaSeleccionada === 'todos'
    ? productos
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-600 p-3 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Nuevo Pedido</h2>
            <p className="text-sm text-gray-600">Selecciona productos para tu pedido</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 mb-6 border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <svg className="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Cliente</p>
              <p className="font-semibold text-gray-900">{usuario?.nombre}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de productos */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Filtrar por categoría:</label>
              <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {categorias.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'todos' ? 'Todos los productos' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto p-2">
              {productosFiltrados.map(producto => (
                <div key={producto.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{producto.nombre}</h3>
                      <p className="text-sm text-gray-600 mt-1">{producto.descripcion}</p>
                      <p className="text-xs text-gray-500 mt-1">Stock: {producto.stock}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">${producto.precio}</p>
                      <button
                        onClick={() => agregarAlCarrito(producto)}
                        className="mt-2 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carrito */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <h3 className="font-bold text-lg mb-4">Carrito de compras</h3>
            
            {carrito.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay productos en el carrito</p>
            ) : (
              <>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {carrito.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.nombre}</p>
                        <p className="text-xs text-gray-500">${item.precio} x {item.cantidad}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => quitarDelCarrito(item.id)}
                          className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="text-sm font-semibold">{item.cantidad}</span>
                        <button
                          onClick={() => agregarAlCarrito(item)}
                          className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          +
                        </button>
                        <button
                          onClick={() => eliminarDelCarrito(item.id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-green-600">${calcularTotal().toFixed(2)}</span>
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={loading || carrito.length === 0}
                    className="w-full mt-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold shadow-lg transition-all disabled:opacity-50"
                  >
                    {loading ? 'Procesando...' : 'Confirmar Pedido'}
                  </button>
                  
                  {exito && (
                    <p className="text-green-600 text-center mt-3">¡Pedido creado correctamente!</p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}