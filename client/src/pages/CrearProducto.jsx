import React, { useState } from 'react';

export default function CrearProducto() {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    categoria: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Producto a crear:', formData);
    // Aquí irá la lógica para guardar en BD
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-2xl shadow-xl border border-indigo-100">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-indigo-600 p-3 rounded-xl">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Crear Nuevo Producto</h2>
            <p className="text-sm text-gray-600">Agrega un nuevo ítem al catálogo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre del Producto
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <input 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Camiseta Premium"
                required 
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Precio ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input 
                  type="number" 
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required 
                  className="w-full pl-8 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Categoría
              </label>
              <select 
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Seleccionar...</option>
                <option value="ropa">Ropa</option>
                <option value="electronica">Electrónica</option>
                <option value="hogar">Hogar</option>
                <option value="deportes">Deportes</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción
            </label>
            <textarea 
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="3"
              placeholder="Describe las características del producto..."
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
          >
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Guardar Producto</span>
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}