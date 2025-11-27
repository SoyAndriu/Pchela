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


function ModoOscuro(isActive, darkMode) {
  if (isActive) {
    return `font-semibold ${darkMode ? "bg-pink-700 text-pink-100" : "bg-pink-100 text-pink-700"}`;
  }
  return darkMode ? "hover:bg-gray-700" : "hover:bg-pink-50";
}

export default function Sidebar({ darkMode }) {
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
        <NavLink
          to="/empleado"
          end
          className={({ isActive }) =>
            "flex items-center gap-2 p-2 rounded transition-colors " + ModoOscuro(isActive, darkMode)
          }
        >
          <HomeIcon className="w-5 h-5" />
          Inicio
        </NavLink>
        <NavLink
          to="/empleado/productos"
          className={({ isActive }) =>
            "flex items-center gap-2 p-2 rounded transition-colors " + ModoOscuro(isActive, darkMode)
          }
        >
          <ShoppingBagIcon className="w-5 h-5" />
          Productos
        </NavLink>
        <NavLink
          to="/empleado/ventas"
          className={({ isActive }) =>
            "flex items-center gap-2 p-2 rounded transition-colors " + ModoOscuro(isActive, darkMode)
          }
        >
          <ChartBarIcon className="w-5 h-5" />
          Ventas
        </NavLink>

        <NavLink
          to="/empleado/compras"
          className={({ isActive }) =>
            "flex items-center gap-2 p-2 rounded transition-colors " + ModoOscuro(isActive, darkMode)
          }
        >
          <ShoppingCartIcon className="w-5 h-5" />
          Compras
        </NavLink>

        <NavLink
          to="/empleado/proveedores"
          className={({ isActive }) =>
            "flex items-center gap-2 p-2 rounded transition-colors " + ModoOscuro(isActive, darkMode)
          }
        >
          <TruckIcon className="w-5 h-5" />
          Proveedores
        </NavLink>
        
        <NavLink
          to="/empleado/clientes"
          className={({ isActive }) =>
            "flex items-center gap-2 p-2 rounded transition-colors " + ModoOscuro(isActive, darkMode)
          }
        >
          <UsersIcon className="w-5 h-5" />
          Clientes
        </NavLink>
        
        <NavLink
          to="/empleado/reportes"
          className={({ isActive }) =>
            "flex items-center gap-2 p-2 rounded transition-colors " + ModoOscuro(isActive, darkMode)
          }
        >
          <DocumentTextIcon className="w-5 h-5" />
          Reportes
        </NavLink>

        {/* Spacer to push Caja button to bottom */}
        <div className="flex-1" />
        
        {/* Botón Caja al fondo del sidebar */}
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
