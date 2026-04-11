import React, { useState } from 'react';

export default function HacerPedido({ usuario }) {
  const [itemSeleccionado, setItemSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);

  const items = [
    { id: 1, nombre: 'Ítem Premium A', precio: 10.00, descripcion: 'Producto de alta calidad' },
    { id: 2, nombre: 'Ítem Premium B', precio: 25.00, descripcion: 'Edición especial' },
    { id: 3, nombre: 'Ítem Premium C', precio: 15.50, descripcion: 'Nuevo lanzamiento' },
  ];

  const total = itemSeleccionado 
    ? (items.find(i => i.id === parseInt(itemSeleccionado))?.precio || 0) * cantidad 
    : 0;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-xl border border-green-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-green-600 p-3 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Nuevo Pedido</h2>
            <p className="text-sm text-gray-600">Completa los detalles de tu orden</p>
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
              <p className="font-semibold text-gray-900">{usuario?.nombre || 'Invitado'}</p>
            </div>
          </div>
        </div>

        <form className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Seleccionar Producto
            </label>
            <select 
              required 
              value={itemSeleccionado}
              onChange={(e) => setItemSeleccionado(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
            >
              <option value="" disabled>Selecciona un producto...</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.nombre} - ${item.precio.toFixed(2)} - {item.descripcion}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cantidad
            </label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700 transition-colors duration-200"
              >
                -
              </button>
              <input 
                type="number" 
                min="1" 
                value={cantidad}
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-center px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setCantidad(cantidad + 1)}
                className="px-4 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold text-gray-700 transition-colors duration-200"
              >
                +
              </button>
            </div>
          </div>

          {total > 0 && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Total del pedido:</span>
                <span className="text-2xl font-bold text-green-700">${total.toFixed(2)}</span>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            Confirmar Pedido
          </button>
        </form>
      </div>
    </div>
  );
}