import React from 'react';

export default function CrearProducto() {
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">Crear Nuevo Ítem (Producto)</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del Ítem</label>
          <input type="text" placeholder="Ej. Camiseta" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Precio</label>
          <input type="number" step="0.01" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>
        <button type="submit" className="w-full py-2 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md font-medium">
          Guardar Ítem en BD
        </button>
      </form>
    </div>
  );
}