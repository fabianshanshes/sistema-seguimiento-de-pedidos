import React, { useState, useEffect } from 'react';
import api from '../api';

export default function EstadoPedido() {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comentarios, setComentarios] = useState({});

  useEffect(() => {
    cargarPedidos();
  }, []);

  const cargarPedidos = async () => {
    try {
      const res = await api.get('/pedidos');
      setPedidos(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cambiarEstado = async (pedidoId, nuevoEstado) => {
    try {
      await api.patch(`/pedidos/${pedidoId}/estado`, {
        estado: nuevoEstado,
        comentarios: comentarios[pedidoId] || ''
      });
      cargarPedidos(); // recargar lista
    } catch (error) {
      alert('Error al actualizar estado');
    }
  };

  const colorEstado = {
    'pendiente': 'bg-yellow-100 text-yellow-800',
    'en proceso': 'bg-blue-100 text-blue-800',
    'entregado': 'bg-green-100 text-green-800'
  };

  if (loading) return <div>Cargando pedidos...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6">Estado de Pedidos</h2>
        {pedidos.map(pedido => (
          <div key={pedido.id} className="bg-white rounded-xl p-6 mb-4 shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{pedido.numero_pedido}</h3>
                <p className="text-sm text-gray-600">Cliente: {pedido.cliente_nombre}</p>
                <p className="text-sm text-gray-600">Fecha: {pedido.fecha_pedido}</p>
                <p className="mt-2">{pedido.detalle_pedido}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorEstado[pedido.estado]}`}>
                {pedido.estado}
              </span>
            </div>

            <div className="mt-4 pt-4 border-t">
              <textarea
                placeholder="Comentarios (opcional)"
                className="w-full p-2 border rounded text-sm mb-2"
                value={comentarios[pedido.id] || ''}
                onChange={(e) => setComentarios({ ...comentarios, [pedido.id]: e.target.value })}
              />
              <div className="flex gap-2">
                {['pendiente', 'en proceso', 'entregado'].map(estado => (
                  <button
                    key={estado}
                    onClick={() => cambiarEstado(pedido.id, estado)}
                    className={`px-4 py-2 text-sm rounded ${pedido.estado === estado ? 'ring-2 ring-offset-2 ring-gray-500 bg-gray-500 text-white' : 'bg-gray-200'}`}
                  >
                    {estado}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}