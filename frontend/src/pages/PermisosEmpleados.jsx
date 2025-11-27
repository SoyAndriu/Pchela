import React, { useEffect, useState } from 'react';
import { UserIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { apiFetch } from '../utils/productUtils';
import { API_BASE } from '../config/productConfig';

export default function PermisosEmpleados({ darkMode }) {
  const [empleados, setEmpleados] = useState([]);
  const [permisos, setPermisos] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState({});
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Cargar lista de empleados y sus permisos
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Obtener empleados activos
        const empleadosResponse = await apiFetch(`${API_BASE}/empleados/`);
        
        if (!empleadosResponse.ok) {
          throw new Error(`Error al cargar empleados: ${empleadosResponse.status}`);
        }
        
        const empleadosData = await empleadosResponse.json();
        
        if (!mounted) return;
        
        // El endpoint devuelve empleados directamente con su relación user
        const empleadosList = Array.isArray(empleadosData) ? empleadosData : (empleadosData.results || []);
        // Filtrar solo empleados activos que tienen rol 'empleado' (no gerentes)
        setEmpleados(empleadosList.filter(e => e.activo !== false && e.role === 'empleado'));

        // Obtener permisos existentes
        const permisosResponse = await apiFetch(`${API_BASE}/permisos/`);
        
        if (!permisosResponse.ok) {
          throw new Error(`Error al cargar permisos: ${permisosResponse.status}`);
        }
        
        const permisosData = await permisosResponse.json();

        if (!mounted) return;

        // Crear mapa de permisos por user_id
        const permisosMap = {};
        const permisosList = Array.isArray(permisosData) ? permisosData : (permisosData.results || []);
        permisosList.forEach(p => {
          permisosMap[p.user] = p;
        });

        setPermisos(permisosMap);
      } catch (err) {
        if (!mounted) return;
        console.error('Error al cargar datos:', err);
        setError(err.message || 'No se pudieron cargar los empleados');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, []);

  // Actualizar un permiso específico
  const togglePermiso = async (userId, campo) => {
    const permisoActual = permisos[userId];
    
    if (!permisoActual) {
      // Crear nuevo permiso
      try {
        setSaving(prev => ({ ...prev, [userId]: true }));
        setError(null);

        const nuevoPermiso = {
          user: userId,
          puede_ventas: campo === 'puede_ventas' ? true : false,
          puede_productos: campo === 'puede_productos' ? true : false,
          puede_clientes: campo === 'puede_clientes' ? true : false,
          puede_compras: campo === 'puede_compras' ? true : false,
          puede_proveedores: campo === 'puede_proveedores' ? true : false,
          puede_lotes: campo === 'puede_lotes' ? true : false,
          puede_marcas: campo === 'puede_marcas' ? true : false,
          puede_reportes: campo === 'puede_reportes' ? true : false,
          puede_movimientos_caja: campo === 'puede_movimientos_caja' ? true : false,
        };

        const response = await apiFetch(`${API_BASE}/permisos/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(nuevoPermiso),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        
        setPermisos(prev => ({ ...prev, [userId]: data }));
        showSuccess('Permisos actualizados correctamente');
      } catch (err) {
        console.error('Error al crear permiso:', err);
        setError(err.message || 'No se pudo crear el permiso');
      } finally {
        setSaving(prev => ({ ...prev, [userId]: false }));
      }
    } else {
      // Actualizar permiso existente
      try {
        setSaving(prev => ({ ...prev, [userId]: true }));
        setError(null);

        const permisoActualizado = {
          ...permisoActual,
          [campo]: !permisoActual[campo],
        };

        const response = await apiFetch(`${API_BASE}/permisos/${permisoActual.id}/`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ [campo]: !permisoActual[campo] }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(JSON.stringify(errorData));
        }

        const data = await response.json();
        
        setPermisos(prev => ({ ...prev, [userId]: data }));
        showSuccess('Permisos actualizados correctamente');
      } catch (err) {
        console.error('Error al actualizar permiso:', err);
        setError(err.message || 'No se pudo actualizar el permiso');
      } finally {
        setSaving(prev => ({ ...prev, [userId]: false }));
      }
    }
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const getPermisoValue = (userId, campo) => {
    return permisos[userId]?.[campo] || false;
  };

  const permisosConfig = [
    { key: 'puede_ventas', label: 'Ventas' },
    { key: 'puede_productos', label: 'Productos' },
    { key: 'puede_clientes', label: 'Clientes' },
    { key: 'puede_compras', label: 'Compras' },
    { key: 'puede_proveedores', label: 'Proveedores' },
    { key: 'puede_lotes', label: 'Lotes' },
    { key: 'puede_marcas', label: 'Marcas' },
    { key: 'puede_reportes', label: 'Reportes' },
    { key: 'puede_movimientos_caja', label: 'Movimientos de Caja' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Permisos de Empleados
        </h1>
        <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
          Configura qué secciones puede acceder cada empleado
        </p>
      </div>

      {error && (
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-red-900/20 border-red-800 text-red-300' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {error}
        </div>
      )}

      {successMessage && (
        <div className={`p-4 rounded-lg border ${darkMode ? 'bg-green-900/20 border-green-800 text-green-300' : 'bg-green-50 border-green-200 text-green-700'}`}>
          {successMessage}
        </div>
      )}

      {empleados.length === 0 ? (
        <div className={`p-8 rounded-lg border text-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
          <UserIcon className={`w-12 h-12 mx-auto mb-3 ${darkMode ? 'text-gray-600' : 'text-slate-400'}`} />
          <p className={`${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            No hay empleados registrados
          </p>
        </div>
      ) : (
        <div className={`rounded-lg border overflow-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className={`${darkMode ? 'bg-gray-900' : 'bg-slate-50'}`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                    Empleado
                  </th>
                  {permisosConfig.map(p => (
                    <th key={p.key} className={`px-3 py-3 text-center text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                      {p.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {empleados.map((empleado, index) => (
                  <tr key={`empleado-${empleado.user_id || empleado.id || index}`} className={`${darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-50'}`}>
                    <td className={`px-4 py-3 ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-5 h-5 text-pink-600" />
                        <div>
                          <div className="font-medium">{empleado.nombre} {empleado.apellido}</div>
                          {empleado.email && (
                            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                              {empleado.email}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    {permisosConfig.map(p => {
                      const value = getPermisoValue(empleado.user_id, p.key);
                      const isSaving = saving[empleado.user_id];
                      
                      return (
                        <td key={`${empleado.user_id}-${p.key}`} className="px-3 py-3 text-center">
                          <button
                            onClick={() => togglePermiso(empleado.user_id, p.key)}
                            disabled={isSaving}
                            className={`inline-flex items-center justify-center w-8 h-8 rounded transition-colors ${
                              value
                                ? darkMode
                                  ? 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                                : darkMode
                                ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                            } ${isSaving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                          >
                            {isSaving ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                            ) : value ? (
                              <CheckIcon className="w-5 h-5" />
                            ) : (
                              <XMarkIcon className="w-5 h-5" />
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-300' : 'bg-blue-50 border-blue-200 text-blue-800'}`}>
        <p className="text-sm">
          <strong>Nota:</strong> Los empleados sin permisos configurados tienen acceso únicamente a Ventas por defecto. 
          Haz clic en los botones para activar o desactivar el acceso a cada sección.
        </p>
      </div>
    </div>
  );
}
