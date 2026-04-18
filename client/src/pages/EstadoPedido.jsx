import React, { useState, useEffect } from 'react';
import api from '../api';

export default function EstadoPedido() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comentarios, setComentarios] = useState({});
  const [enviando, setEnviando] = useState({});

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const res = await api.get('/pedidos');
      setPedidos(res.data);
    } catch (error) {
      console.error(error);
      alert('Error al cargar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    setEnviando({ ...enviando, [pedidoId]: true });
    try {
      await api.patch(`/pedidos/${pedidoId}/estado`, {
        estado: nuevoEstado,
        comentarios: comentarios[pedidoId] || ''
      });
      await cargarPedidos(); 
      setComentarios({ ...comentarios, [pedidoId]: '' });
    } catch (error) {
      alert('Error al actualizar estado');
    } finally {
      setEnviando({ ...enviando, [pedidoId]: false });
    }
  };

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

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-xl text-gray-600">Cargando pedidos...</div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-xl">
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

        {pedidos.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-500">No hay pedidos registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map(pedido => (
              <div key={pedido.id} className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">{iconoEstado[pedido.estado]}</span>
                      <h3 className="font-bold text-xl text-gray-900">{pedido.numero_pedido}</h3>
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Cliente:</strong> {pedido.cliente_nombre}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Email:</strong> {pedido.cliente_email}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Fecha:</strong> {new Date(pedido.fecha_pedido).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase border ${colorEstado[pedido.estado]}`}>
                    {pedido.estado}
                  </span>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    <strong>Detalle del pedido:</strong>
                  </p>
                  <p className="text-gray-600 mt-1">{pedido.detalle_pedido || 'Sin detalles'}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Comentarios (opcional):
                  </label>
                  <textarea
                    placeholder="Agregar comentarios sobre el cambio de estado..."
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm mb-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="2"
                    value={comentarios[pedido.id] || ''}
                    onChange={(e) => setComentarios({ ...comentarios, [pedido.id]: e.target.value })}
                  />
                  
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-500 self-center mr-2">Cambiar estado:</span>
                    {['pendiente', 'en proceso', 'entregado'].map(estado => (
                      <button
                        key={estado}
                        onClick={() => cambiarEstado(pedido.id, estado)}
                        disabled={enviando[pedido.id]}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                          pedido.estado === estado
                            ? 'ring-2 ring-offset-2 ' + (
                                estado === 'pendiente' ? 'ring-yellow-500 bg-yellow-500 text-white' :
                                estado === 'en proceso' ? 'ring-blue-500 bg-blue-500 text-white' :
                                'ring-green-500 bg-green-500 text-white'
                              )
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } ${enviando[pedido.id] ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {enviando[pedido.id] ? '...' : estado.charAt(0).toUpperCase() + estado.slice(1)}
                      </button>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-3">
                    Al cambiar el estado, se enviará automáticamente un correo de notificación al cliente.
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de pedidos</p>
              <p className="text-2xl font-bold text-gray-900">{pedidos.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Estados</p>
              <div className="flex gap-3 mt-1">
                <div><span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span> <span className="text-sm">Pendiente: {pedidos.filter(p => p.estado === 'pendiente').length}</span></div>
                <div><span className="inline-block w-3 h-3 rounded-full bg-blue-500 mr-1"></span> <span className="text-sm">Proceso: {pedidos.filter(p => p.estado === 'en proceso').length}</span></div>
                <div><span className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"></span> <span className="text-sm">Entregado: {pedidos.filter(p => p.estado === 'entregado').length}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}