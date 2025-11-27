import React, { useState, useEffect } from 'react';
import { useConfiguracion } from '../../hooks/useConfiguracion';
import { PackageIcon, AlertTriangleIcon, TrendingUpIcon } from 'lucide-react';

const ConfigInventario = ({ darkMode }) => {
  const { getConfig, updateConfig, loading } = useConfiguracion();
  const [config, setConfig] = useState({
    stock_minimo_alerta: 10,
    dias_alerta_vencimiento: 30,
    permitir_stock_negativo: false,
    actualizar_precios_automatico: false,
    margen_ganancia_default: 30.00
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await getConfig('inventario');
      setConfig(data);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateConfig('inventario', config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error al guardar configuración:', error);
    }
  };

  const handleChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg p-6`}>
          {/* Header */}
          <div className="flex items-center mb-6">
            <PackageIcon className={`w-8 h-8 mr-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Configuración de Inventario
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Gestiona alertas y políticas de inventario
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Alertas de Stock */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center mb-4">
                <AlertTriangleIcon className={`w-5 h-5 mr-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Alertas de Stock
                </h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Stock Mínimo para Alerta
                  </label>
                  <input
                    type="number"
                    value={config.stock_minimo_alerta}
                    onChange={(e) => handleChange('stock_minimo_alerta', parseInt(e.target.value))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500`}
                    min="0"
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Cantidad mínima antes de mostrar alerta
                  </p>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Días de Alerta antes del Vencimiento
                  </label>
                  <input
                    type="number"
                    value={config.dias_alerta_vencimiento}
                    onChange={(e) => handleChange('dias_alerta_vencimiento', parseInt(e.target.value))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500`}
                    min="1"
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Días antes del vencimiento para mostrar alerta
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.permitir_stock_negativo}
                    onChange={(e) => handleChange('permitir_stock_negativo', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Permitir stock negativo (vender sin stock suficiente)
                  </label>
                </div>
              </div>
            </div>

            {/* Precios */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <div className="flex items-center mb-4">
                <TrendingUpIcon className={`w-5 h-5 mr-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Gestión de Precios
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.actualizar_precios_automatico}
                    onChange={(e) => handleChange('actualizar_precios_automatico', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Actualizar precios automáticamente según costo + margen
                  </label>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Margen de Ganancia por Defecto (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={config.margen_ganancia_default}
                    onChange={(e) => handleChange('margen_ganancia_default', parseFloat(e.target.value))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-600 border-gray-500 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-blue-500`}
                    min="0"
                    max="100"
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Margen aplicado al calcular precio de venta desde el costo
                  </p>
                </div>
              </div>
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

export default ConfigInventario;
