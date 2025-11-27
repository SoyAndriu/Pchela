import React, { useState, useEffect } from 'react';
import { useConfiguracion } from '../../hooks/useConfiguracion';
import { BellIcon } from 'lucide-react';

const ConfigNotificaciones = ({ darkMode }) => {
  const { getConfig, updateConfig, loading } = useConfiguracion();
  const [config, setConfig] = useState({
    notificar_stock_bajo: true,
    notificar_productos_vencidos: true,
    notificar_pagos_pendientes: true,
    notificar_creditos_vencidos: true,
    notificar_nueva_venta: false,
    notificar_cierre_caja: true
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await getConfig('notificaciones');
      setConfig(data);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateConfig('notificaciones', config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  };

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const notificationOptions = [
    {
      key: 'notificar_stock_bajo',
      label: 'Stock bajo',
      description: 'Alertar cuando productos tengan stock por debajo del mínimo'
    },
    {
      key: 'notificar_productos_vencidos',
      label: 'Productos próximos a vencer',
      description: 'Alertar sobre productos cerca de su fecha de vencimiento'
    },
    {
      key: 'notificar_pagos_pendientes',
      label: 'Pagos pendientes a proveedores',
      description: 'Alertar sobre pagos próximos a vencer'
    },
    {
      key: 'notificar_creditos_vencidos',
      label: 'Créditos de clientes vencidos',
      description: 'Alertar sobre créditos de clientes que han vencido'
    },
    {
      key: 'notificar_nueva_venta',
      label: 'Nueva venta registrada',
      description: 'Notificar cada vez que se registra una venta'
    },
    {
      key: 'notificar_cierre_caja',
      label: 'Cierre de caja con diferencias',
      description: 'Alertar cuando hay diferencias al cerrar caja'
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          {/* Header */}
          <div className="flex items-center mb-6">
            <BellIcon className={`w-8 h-8 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Configuración de Notificaciones
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Gestiona qué alertas deseas recibir
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Opciones de Notificación */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Tipos de Notificaciones
              </h3>
              
              <div className="space-y-4">
                {notificationOptions.map((option) => (
                  <div key={option.key} className={`p-3 rounded border ${
                    darkMode ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={config[option.key]}
                        onChange={(e) => handleChange(option.key, e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-1"
                      />
                      <div className="ml-3">
                        <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {option.label}
                        </label>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info adicional */}
            <div className={`p-4 rounded-lg border ${
              darkMode ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                💡 Las notificaciones se mostrarán en el panel de control y en la barra de notificaciones del sistema.
              </p>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              {saved && (
                <span className="text-green-600 flex items-center mr-4">
                  ✓ Configuración guardada
                </span>
              )}
              <button
                type="button"
                onClick={loadConfig}
                className={`px-6 py-2 rounded-lg border ${
                  darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ConfigNotificaciones;
