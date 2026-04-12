import React, { useState } from 'react';

export default function EstadoPedido() {
  const [pedidos] = useState([
    { 
      id: 'ORD-001', 
      items: '2x Ítem Premium A', 
      total: 20.00,
      fecha: '2024-01-15',
      cliente: 'Juan Pérez'
    },
    { 
      id: 'ORD-002', 
      items: '1x Ítem Premium B', 
      total: 25.00,
      fecha: '2024-01-14',
      cliente: 'María García'
    },
    { 
      id: 'ORD-003', 
      items: '3x Ítem Premium C', 
      total: 46.50,
      fecha: '2024-01-13',
      cliente: 'Carlos Rodríguez'
    },
  ]);

  const [estados, setEstados] = useState({
    'ORD-001': 'pendiente',
    'ORD-002': 'en proceso',
    'ORD-003': 'entregado'
  });

  const colorEstado = {
    'pendiente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'en proceso': 'bg-blue-100 text-blue-800 border-blue-300',
    'entregado': 'bg-green-100 text-green-800 border-green-300'
  };

  const iconoEstado = {
    'pendiente': '⏳',
    'en proceso': '🔄',
    'entregado': '✅'
  };

  const cambiarEstado = (pedidoId, nuevoEstado) => {
    setEstados({
      ...estados,
      [pedidoId]: nuevoEstado
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-xl border border-blue-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-600 p-3 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Estado de Pedidos</h2>
            <p className="text-sm text-gray-600">Gestiona y actualiza el estado de las órdenes</p>
          </div>
        </div>

        <div className="space-y-4">
          {pedidos.map(pedido => (
            <div key={pedido.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-3 rounded-lg">
                    <span className="text-2xl">{iconoEstado[estados[pedido.id]]}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{pedido.id}</h3>
                    <p className="text-sm text-gray-500">{pedido.fecha} • {pedido.cliente}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase border ${colorEstado[estados[pedido.id]]}`}>
                  {estados[pedido.id]}
                </span>
              </div>
              
              <div className="ml-14">
                <p className="text-gray-700 mb-2">{pedido.items}</p>
                <p className="text-lg font-semibold text-gray-900 mb-4">Total: ${pedido.total.toFixed(2)}</p>
                
                <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                  <span className="text-sm text-gray-500 self-center mr-2">Cambiar estado:</span>
                  {Object.keys(colorEstado).map(estado => (
                    <button
                      key={estado}
                      onClick={() => cambiarEstado(pedido.id, estado)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                        estados[pedido.id] === estado
                          ? 'ring-2 ring-offset-2 ' + (estado === 'pendiente' ? 'ring-yellow-500 bg-yellow-500 text-white' : 
                                                         estado === 'en proceso' ? 'ring-blue-500 bg-blue-500 text-white' : 
                                                         'ring-green-500 bg-green-500 text-white')
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{pedidos.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Valor total</p>
              <p className="text-2xl font-bold text-blue-600">
                ${pedidos.reduce((sum, p) => sum + p.total, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}