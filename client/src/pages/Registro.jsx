// client/src/pages/Registro.jsx
import React, { useState } from 'react';
import api from '../api';

export default function Registro({ setVistaActiva }) {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    
    try {
      await api.post('/clientes', {
        nombre: formData.nombre,
        direccion: formData.direccion,
        telefono: formData.telefono || null,
        email: formData.email,
        contraseña: formData.password 
      });
      
      setExito(true);
      setTimeout(() => {
        setExito(false);
        setVistaActiva('login');
      }, 2000);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError('El email ya está registrado');
      } else {
        setError('Error al registrar. Intente de nuevo.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl shadow-xl border border-purple-100">
        <div className="text-center mb-8">
          <div className="bg-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">Crear Cuenta</h2>
          <p className="text-sm text-gray-600 mt-2">Regístrate para realizar pedidos</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre Completo *</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dirección *</label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Calle Falsa 123, Ciudad"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Teléfono</label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="+56 9 1234 5678"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Correo Electrónico *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Contraseña *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmar Contraseña *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Repite la contraseña"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {exito && <p className="text-green-600 text-sm">¡Registro exitoso! Redirigiendo al login...</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{' '}
            <button 
              onClick={() => setVistaActiva('login')} 
              className="text-purple-600 hover:underline font-bold"
              disabled={loading}
            >
              Inicia Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}