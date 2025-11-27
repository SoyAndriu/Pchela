import React, { useState, useEffect } from 'react';
import { useConfiguracion } from '../hooks/useConfiguracion';
import { 
  PackageIcon, 
  ShoppingCartIcon, 
  TruckIcon, 
  FileTextIcon, 
  BellIcon, 
  SettingsIcon
} from 'lucide-react';

const ConfiguracionGeneral = ({ darkMode }) => {
  const { getConfig, updateConfig, loading } = useConfiguracion();
  const [activeTab, setActiveTab] = useState('inventario');
  const [saved, setSaved] = useState(false);
  
  const [configs, setConfigs] = useState({
    inventario: {
      stock_minimo_alerta: 10,
      dias_alerta_vencimiento: 30,
      permitir_stock_negativo: false,
      actualizar_precios_automatico: false,
      margen_ganancia_default: 30.00
    },
    ventas: {
      descuento_maximo: 20.00,
      permitir_ventas_credito: true,
      limite_credito_default: 10000.00,
      dias_credito_default: 30,
      permitir_precios_personalizados: false
    },
    compras: {
      aprobacion_requerida_monto: 50000.00,
      proveedor_requerido: true,
      dias_alerta_pago: 7,
      permitir_compra_producto_inactivo: false
    },
    reportes: {
      periodo_reporte_default: 'mensual',
      incluir_graficos: true,
      top_productos_count: 10,
      enviar_reporte_email: false,
      email_destinatarios: ''
    },
    notificaciones: {
      notificar_stock_bajo: true,
      notificar_productos_vencidos: true,
      notificar_pagos_pendientes: true,
      notificar_creditos_vencidos: true,
      notificar_nueva_venta: false,
      notificar_cierre_caja: true
    },
    sistema: {
      nombre_empresa: 'Pchela Belén',
      rut_empresa: '',
      direccion: '',
      telefono: '',
      email_contacto: '',
      moneda: 'ARS',
      zona_horaria: 'America/Argentina/Buenos_Aires',
      formato_fecha: 'DD/MM/YYYY',
      idioma: 'es'
    }
  });

  useEffect(() => {
    loadAllConfigs();
  }, []);

  const loadAllConfigs = async () => {
    try {
      const [inventario, ventas, compras, reportes, notificaciones, sistema] = await Promise.all([
        getConfig('inventario').catch(() => configs.inventario),
        getConfig('ventas').catch(() => configs.ventas),
        getConfig('compras').catch(() => configs.compras),
        getConfig('reportes').catch(() => configs.reportes),
        getConfig('notificaciones').catch(() => configs.notificaciones),
        getConfig('sistema').catch(() => configs.sistema),
      ]);
      
      setConfigs({
        inventario,
        ventas,
        compras,
        reportes,
        notificaciones,
        sistema
      });
    } catch (error) {
      console.error('Error al cargar configuraciones:', error);
    }
  };

  const handleSave = async () => {
    try {
      await updateConfig(activeTab, configs[activeTab]);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleChange = (field, value) => {
    setConfigs(prev => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        [field]: value
      }
    }));
  };

  const tabs = [
    { id: 'inventario', label: 'Inventario', icon: PackageIcon },
    { id: 'ventas', label: 'Ventas', icon: ShoppingCartIcon },
    { id: 'compras', label: 'Compras', icon: TruckIcon },
    { id: 'reportes', label: 'Reportes', icon: FileTextIcon },
    { id: 'notificaciones', label: 'Notificaciones', icon: BellIcon },
    { id: 'sistema', label: 'Sistema', icon: SettingsIcon }
  ];

  const currentConfig = configs[activeTab];

  return (
    <div className="max-w-6xl mx-auto">
      <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden`}>
        {/* Header */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center">
            <SettingsIcon className={`w-8 h-8 mr-3 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-pink-600'}`}>
                Configuración General
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Gestiona todas las configuraciones del sistema
              </p>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar de Tabs */}
          <div className={`w-64 border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} p-4`}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                    activeTab === tab.id
                      ? darkMode
                        ? 'bg-pink-600 text-white'
                        : 'bg-pink-500 text-white'
                      : darkMode
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Contenido */}
          <div className="flex-1 p-6">
            {/* INVENTARIO */}
            {activeTab === 'inventario' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Configuración de Inventario
                </h2>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Stock Mínimo para Alerta
                  </label>
                  <input
                    type="number"
                    value={currentConfig.stock_minimo_alerta}
                    onChange={(e) => handleChange('stock_minimo_alerta', parseInt(e.target.value))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-pink-500`}
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
                    value={currentConfig.dias_alerta_vencimiento}
                    onChange={(e) => handleChange('dias_alerta_vencimiento', parseInt(e.target.value))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-pink-500`}
                    min="1"
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Días antes del vencimiento para mostrar alerta
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentConfig.permitir_stock_negativo}
                    onChange={(e) => handleChange('permitir_stock_negativo', e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Permitir stock negativo (vender sin stock suficiente)
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentConfig.actualizar_precios_automatico}
                    onChange={(e) => handleChange('actualizar_precios_automatico', e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
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
                    value={currentConfig.margen_ganancia_default}
                    onChange={(e) => handleChange('margen_ganancia_default', parseFloat(e.target.value))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-pink-500`}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            )}

            {/* VENTAS */}
            {activeTab === 'ventas' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Configuración de Ventas
                </h2>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Descuento Máximo Permitido (%)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentConfig.descuento_maximo}
                    onChange={(e) => handleChange('descuento_maximo', parseFloat(e.target.value))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-pink-500`}
                    min="0"
                    max="100"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentConfig.permitir_precios_personalizados}
                    onChange={(e) => handleChange('permitir_precios_personalizados', e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Permitir modificar precios durante la venta
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentConfig.permitir_ventas_credito}
                    onChange={(e) => handleChange('permitir_ventas_credito', e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Permitir ventas a crédito (cuenta corriente)
                  </label>
                </div>

                {currentConfig.permitir_ventas_credito && (
                  <>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Límite de Crédito por Defecto ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={currentConfig.limite_credito_default}
                        onChange={(e) => handleChange('limite_credito_default', parseFloat(e.target.value))}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-pink-500`}
                        min="0"
                      />
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Límite de cuenta corriente para nuevos clientes
                      </p>
                    </div>

                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Días de Crédito por Defecto
                      </label>
                      <input
                        type="number"
                        value={currentConfig.dias_credito_default}
                        onChange={(e) => handleChange('dias_credito_default', parseInt(e.target.value))}
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white' 
                            : 'bg-white border-gray-300 text-gray-900'
                        } focus:ring-2 focus:ring-pink-500`}
                        min="1"
                      />
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Plazo en días para pago en cuenta corriente
                      </p>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* COMPRAS */}
            {activeTab === 'compras' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Configuración de Compras
                </h2>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Monto Mínimo para Aprobación del Gerente ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentConfig.aprobacion_requerida_monto}
                    onChange={(e) => handleChange('aprobacion_requerida_monto', parseFloat(e.target.value))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-pink-500`}
                    min="0"
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Compras mayores a este monto requieren autorización
                  </p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentConfig.proveedor_requerido}
                    onChange={(e) => handleChange('proveedor_requerido', e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Requerir proveedor al registrar compra
                  </label>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Días de Alerta antes del Vencimiento de Pago
                  </label>
                  <input
                    type="number"
                    value={currentConfig.dias_alerta_pago}
                    onChange={(e) => handleChange('dias_alerta_pago', parseInt(e.target.value))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-pink-500`}
                    min="1"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentConfig.permitir_compra_producto_inactivo}
                    onChange={(e) => handleChange('permitir_compra_producto_inactivo', e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Permitir comprar productos marcados como inactivos
                  </label>
                </div>
              </div>
            )}

            {/* REPORTES */}
            {activeTab === 'reportes' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Configuración de Reportes
                </h2>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Período por Defecto
                  </label>
                  <select
                    value={currentConfig.periodo_reporte_default}
                    onChange={(e) => handleChange('periodo_reporte_default', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-pink-500`}
                  >
                    <option value="diario">Diario</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Top Productos a Mostrar
                  </label>
                  <input
                    type="number"
                    value={currentConfig.top_productos_count}
                    onChange={(e) => handleChange('top_productos_count', parseInt(e.target.value))}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-pink-500`}
                    min="1"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentConfig.incluir_graficos}
                    onChange={(e) => handleChange('incluir_graficos', e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Incluir gráficos en reportes exportados
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={currentConfig.enviar_reporte_email}
                    onChange={(e) => handleChange('enviar_reporte_email', e.target.checked)}
                    className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                  />
                  <label className={`ml-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Enviar reportes automáticos por email
                  </label>
                </div>

                {currentConfig.enviar_reporte_email && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Destinatarios (separados por comas)
                    </label>
                    <textarea
                      value={currentConfig.email_destinatarios}
                      onChange={(e) => handleChange('email_destinatarios', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-pink-500`}
                      rows="3"
                      placeholder="usuario@ejemplo.com, otro@ejemplo.com"
                    />
                  </div>
                )}
              </div>
            )}

            {/* NOTIFICACIONES */}
            {activeTab === 'notificaciones' && (
              <div className="space-y-4">
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Configuración de Notificaciones
                </h2>

                {[
                  { key: 'notificar_stock_bajo', label: 'Stock bajo', desc: 'Alertar cuando productos tengan stock por debajo del mínimo' },
                  { key: 'notificar_productos_vencidos', label: 'Productos próximos a vencer', desc: 'Alertar sobre productos cerca de su fecha de vencimiento' },
                  { key: 'notificar_pagos_pendientes', label: 'Pagos pendientes a proveedores', desc: 'Alertar sobre pagos próximos a vencer' },
                  { key: 'notificar_creditos_vencidos', label: 'Créditos de clientes vencidos', desc: 'Alertar sobre cuentas corrientes vencidas' },
                  { key: 'notificar_nueva_venta', label: 'Nueva venta registrada', desc: 'Notificar cada vez que se registra una venta' },
                  { key: 'notificar_cierre_caja', label: 'Cierre de caja con diferencias', desc: 'Alertar cuando hay diferencias al cerrar caja' }
                ].map(option => (
                  <div key={option.key} className={`p-3 rounded border ${
                    darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-white'
                  }`}>
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        checked={currentConfig[option.key]}
                        onChange={(e) => handleChange(option.key, e.target.checked)}
                        className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500 mt-1"
                      />
                      <div className="ml-3">
                        <label className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {option.label}
                        </label>
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {option.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* SISTEMA */}
            {activeTab === 'sistema' && (
              <div className="space-y-6">
                <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Configuración del Sistema
                </h2>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Nombre de la Empresa
                  </label>
                  <input
                    type="text"
                    value={currentConfig.nombre_empresa}
                    onChange={(e) => handleChange('nombre_empresa', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-pink-500`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      RUT/CUIT
                    </label>
                    <input
                      type="text"
                      value={currentConfig.rut_empresa}
                      onChange={(e) => handleChange('rut_empresa', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-pink-500`}
                      placeholder="Opcional"
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={currentConfig.telefono}
                      onChange={(e) => handleChange('telefono', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-pink-500`}
                      placeholder="Opcional"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Dirección
                  </label>
                  <input
                    type="text"
                    value={currentConfig.direccion}
                    onChange={(e) => handleChange('direccion', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-pink-500`}
                    placeholder="Opcional"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email de Contacto
                  </label>
                  <input
                    type="email"
                    value={currentConfig.email_contacto}
                    onChange={(e) => handleChange('email_contacto', e.target.value)}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    } focus:ring-2 focus:ring-pink-500`}
                    placeholder="Opcional"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Moneda
                    </label>
                    <select
                      value={currentConfig.moneda}
                      onChange={(e) => handleChange('moneda', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-pink-500`}
                    >
                      <option value="ARS">ARS (Peso Argentino)</option>
                      <option value="USD">USD (Dólar)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="BRL">BRL (Real)</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Formato de Fecha
                    </label>
                    <select
                      value={currentConfig.formato_fecha}
                      onChange={(e) => handleChange('formato_fecha', e.target.value)}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white' 
                          : 'bg-white border-gray-300 text-gray-900'
                      } focus:ring-2 focus:ring-pink-500`}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Botones de Acción */}
            <div className={`flex justify-end space-x-3 mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {saved && (
                <span className="text-green-600 flex items-center mr-4">
                  ✓ Configuración guardada
                </span>
              )}
              <button
                type="button"
                onClick={loadAllConfigs}
                className={`px-6 py-2 rounded-lg border ${
                  darkMode
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionGeneral;
