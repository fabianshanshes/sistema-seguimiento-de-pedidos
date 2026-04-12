import React, { useState } from 'react';
import api from '../api';

export default function HacerPedido({ usuario }) {
  const [numeroPedido, setNumeroPedido] = useState('');
  const [detalle, setDetalle] = useState('');
  const [loading, setLoading] = useState(false);
  const [exito, setExito] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/pedidos', {
        numero_pedido: numeroPedido,
        cliente_id: usuario.id,
        fecha_pedido: new Date().toISOString().split('T')[0],
        estado: 'pendiente',
        detalle_pedido: detalle
      });
      setExito(true);
      setNumeroPedido('');
      setDetalle('');
      setTimeout(() => setExito(false), 3000);
    } catch (err) {
      alert('Error al crear pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl shadow-xl">
        <h2>Nuevo Pedido</h2>
        <p>Cliente: {usuario?.nombre}</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Número de pedido (único)"
            value={numeroPedido}
            onChange={(e) => setNumeroPedido(e.target.value)}
            required
            className="w-full p-3 mb-4 border rounded"
          />
          <textarea
            placeholder="Detalle del pedido (productos, cantidades, etc.)"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            rows="4"
            className="w-full p-3 mb-4 border rounded"
            required
          />
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded">
            {loading ? 'Guardando...' : 'Confirmar Pedido'}
          </button>
          {exito && <p className="text-green-600 mt-4">¡Pedido creado correctamente!</p>}
        </form>
      </div>
    </div>
  );
}