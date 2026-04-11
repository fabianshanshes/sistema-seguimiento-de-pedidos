import React from 'react';

export default function Registro({ setVistaActiva }) {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Registro de Cliente</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
          <input type="text" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input type="password" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <button type="button" onClick={() => setVistaActiva('login')} className="w-full py-2 px-4 text-white bg-blue-600 hover:bg-blue-700 rounded-md font-medium">
          Registrarse
        </button>
      </form>
    </div>
  );
}