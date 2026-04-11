import React, { useState } from 'react';

export default function EstadoPedido() {
  // Estado local para simular el cambio en la interfaz
  const [estadoActual, setEstadoActual] = useState('pendiente');

  const colorEstado = {
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'en proceso': 'bg-blue-100 text-blue-800',
    'entregado': 'bg-green-100 text-green-800'
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Estado de los Pedidos</h2>
      
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-gray-800">Pedido #ORD-001</span>
          <span className={`px-2 py-1 text-xs font-semibold rounded-full uppercase ${colorEstado[estadoActual]}`}>
            {estadoActual}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">Detalle: 2x Ítem A</p>
        
        <div className="flex gap-2 mt-4 border-t pt-4 border-gray-200">
          <span className="text-sm text-gray-500 self-center mr-2">Cambiar a:</span>
          <button onClick={() => setEstadoActual('pendiente')} className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600">
            Pendiente
          </button>
          <button onClick={() => setEstadoActual('en proceso')} className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600">
            En Proceso
          </button>
          <button onClick={() => setEstadoActual('entregado')} className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600">
            Entregado
          </button>
        </div>
      </div>
    </div>
  );
}