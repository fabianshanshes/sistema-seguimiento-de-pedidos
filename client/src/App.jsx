import React, { useState } from 'react';
import CrearProducto from './pages/CrearProducto';
import HacerPedido from './pages/HacerPedido';
import EstadoPedido from './pages/EstadoPedido';
import Login from './pages/Login';
import Registro from './pages/Registro';

export default function App() {
  const [vistaActiva, setVistaActiva] = useState('login');
  const [usuario, setUsuario] = useState(null);

  const handleLogin = (userData) => {
    setUsuario(userData);
    setVistaActiva('hacer_pedido');
  };

  const handleLogout = () => {
    setUsuario(null);
    setVistaActiva('login');
  };

  const renderizarVista = () => {
    switch (vistaActiva) {
      case 'login': 
        return <Login setVistaActiva={setVistaActiva} setUsuario={handleLogin} />;
      case 'registro': 
        return <Registro setVistaActiva={setVistaActiva} />;
      case 'crear_producto': 
        return <CrearProducto />;
      case 'hacer_pedido': 
        return <HacerPedido usuario={usuario} />;
      case 'estado_pedido': 
        return <EstadoPedido />;
      default: 
        return <Login setVistaActiva={setVistaActiva} setUsuario={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <nav className="bg-blue-900 text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-xl font-bold">Gestión de Pedidos</h1>
          <div className="flex gap-2 flex-wrap">
            {!usuario ? (
              <>
                <button 
                  onClick={() => setVistaActiva('login')} 
                  className="px-3 py-1 hover:bg-blue-800 rounded transition"
                >
                  Iniciar Sesión
                </button>
                <button 
                  onClick={() => setVistaActiva('registro')} 
                  className="px-3 py-1 hover:bg-blue-800 rounded transition"
                >
                  Registro
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setVistaActiva('crear_producto')} 
                  className="px-3 py-1 hover:bg-blue-800 rounded transition"
                >
                  Crear Producto
                </button>
                <button 
                  onClick={() => setVistaActiva('hacer_pedido')} 
                  className="px-3 py-1 hover:bg-blue-800 rounded transition"
                >
                  Hacer Pedido
                </button>
                <button 
                  onClick={() => setVistaActiva('estado_pedido')} 
                  className="px-3 py-1 hover:bg-blue-800 rounded transition"
                >
                  Ver Estados
                </button>
                <button 
                  onClick={handleLogout} 
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded ml-4 transition"
                >
                  Salir
                </button>
                <span className="px-3 py-1 bg-blue-800 rounded text-sm">
                  👤 {usuario.nombre}
                </span>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-4 mt-8">
        {renderizarVista()}
      </main>
    </div>
  );
}