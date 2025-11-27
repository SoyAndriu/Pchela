import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  HomeIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  ShoppingCartIcon,
  UsersIcon,
  DocumentTextIcon,
  TruckIcon,
  BanknotesIcon
} from "@heroicons/react/24/outline";
import CajaStatusBadge from "../../components/CajaStatusBadge";
import usePermisos from "../../hooks/usePermisos";


function ModoOscuro(isActive, darkMode) {
  if (isActive) {
    return `font-semibold ${darkMode ? "bg-pink-700 text-pink-100" : "bg-pink-100 text-pink-700"}`;
  }
  return darkMode ? "hover:bg-gray-700" : "hover:bg-pink-50";
}

export default function Sidebar({ darkMode }) {
  const { permisos, loading } = usePermisos();

  // Configuración de items del menú con sus permisos requeridos
  const menuItems = [
    {
      to: "/empleado",
      icon: HomeIcon,
      label: "Inicio",
      end: true,
      permission: null, // Siempre visible
    },
    {
      to: "/empleado/productos",
      icon: ShoppingBagIcon,
      label: "Productos",
      permission: "puede_productos",
    },
    {
      to: "/empleado/ventas",
      icon: ChartBarIcon,
      label: "Ventas",
      permission: "puede_ventas",
    },
    {
      to: "/empleado/compras",
      icon: ShoppingCartIcon,
      label: "Compras",
      permission: "puede_compras",
    },
    {
      to: "/empleado/proveedores",
      icon: TruckIcon,
      label: "Proveedores",
      permission: "puede_proveedores",
    },
    {
      to: "/empleado/clientes",
      icon: UsersIcon,
      label: "Clientes",
      permission: "puede_clientes",
    },
    {
      to: "/empleado/reportes",
      icon: DocumentTextIcon,
      label: "Reportes",
      permission: "puede_reportes",
    },
  ];

  // Filtrar items según permisos
  const visibleItems = menuItems.filter(item => {
    // Si no requiere permiso, siempre visible
    if (!item.permission) return true;
    
    // Si es gerente, tiene acceso a todo
    if (permisos.es_gerente) return true;
    
    // Verificar permiso específico
    return permisos[item.permission] === true;
  });

  return (
    <aside
      className={`w-64 shadow-md h-screen sticky top-0 ${
        darkMode ? "bg-gray-800 text-white" : "bg-white text-black"
      }`}
    >
      <div className={`p-4 font-bold border-b flex items-center ${darkMode ? "border-gray-600" : "border-gray-200"}`}>
        <img src="/images/logo.png" alt="Pchéla logo" className="h-10 w-10 mr-2" />
        <div>
          <h1 className={`text-xl ${darkMode ? "text-white" : "text-pink-600"}`}>Pchéla</h1>
          <p className="text-xs text-gray-500">Universal Beauty</p>
        </div>
      </div>

      <nav className="p-4 space-y-2 flex flex-col h-[calc(100%-72px)]">
        {loading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-600"></div>
          </div>
        ) : (
          visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  "flex items-center gap-2 p-2 rounded transition-colors " + ModoOscuro(isActive, darkMode)
                }
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            );
          })
        )}

        {/* Spacer to push Caja button to bottom */}
        <div className="flex-1" />
        
        {/* Botón Caja al fondo del sidebar - siempre visible */}
        <NavLink
          to="/cajero"
          className={({ isActive }) =>
            `mt-2 flex items-center gap-1 p-3 h-12 rounded-lg text-lg shadow-md border transition-colors ${
              darkMode ? "border-gray-600" : "border-gray-300"
            } ` + ModoOscuro(isActive, darkMode)
          }
        >
          <BanknotesIcon className="w-6 h-6 mr-2" />
          <span className="font-semibold">Caja</span>
          <span className="flex-1" />
          <CajaStatusBadge compact darkMode={darkMode} className="ml-4" />
        </NavLink>
      </nav>
    </aside>
  );
}
