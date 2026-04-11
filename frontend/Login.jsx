import React from 'react';

export default function Login({ setVistaActiva, setUsuario }) {
  const manejarSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la petición fetch al backend
    // Simulamos un login exitoso:
    setUsuario({ id: 1, nombre: 'Usuario Prueba' });
    setVistaActiva('hacer_pedido');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Iniciar Sesión</h2>
      <form onSubmit={manejarSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" required className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input type="password" required className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
        </div>
        <button type="submit" className="w-full py-2 px-4 text-white bg-gray-800 hover:bg-gray-900 rounded-md font-medium">
          Entrar
        </button>
      </form>
    </div>
  );
}