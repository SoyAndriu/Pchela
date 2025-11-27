import { NavLink, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import PaymentForm from "./PaymentForm";
import SalesHistory from "./SalesHistory";
import Caja from "./Caja";
import MovimientosCaja from "./MovimientosCaja";
import {
  CreditCardIcon,
  ChartBarIcon,
  BanknotesIcon,
  ClipboardDocumentListIcon,
  SunIcon,
  MoonIcon,
  PowerIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import CajaGuard from "../../components/CajaGuard";
import CajaStatusBadge from "../../components/CajaStatusBadge";

export default function CajeroLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ui.darkMode");
      if (saved !== null) setDarkMode(saved === "true");
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("ui.darkMode", String(darkMode)); } catch { /* noop */ }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-gray-900 text-white" : "bg-pink-25"}`}>
      {/* Sidebar */}
      <aside className={`w-64 ${darkMode ? "bg-gray-800" : "bg-pink-600"} text-white flex flex-col`}>
        <h2 className={`text-2xl font-bold p-4 border-b ${darkMode ? "border-gray-700" : "border-pink-500"}`}>
          Cajero
        </h2>
        <nav className="flex flex-col p-4 gap-2 flex-1">
          {/* Se elimina sección Pedidos */}
          <NavLink 
            to="/cajero/payment"
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded transition-colors ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`
            }
          >
            <CreditCardIcon className="h-5 w-5" />
            Cobro
          </NavLink>
          <NavLink 
            to="/cajero/history"
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded transition-colors ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`
            }
          >
            <ChartBarIcon className="h-5 w-5" />
            Historial Ventas
          </NavLink>
          <NavLink 
            to="/cajero/movimientos"
            className={({ isActive }) => 
              `flex items-center gap-2 p-2 rounded transition-colors ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`
            }
          >
            <ClipboardDocumentListIcon className="h-5 w-5" />
            Movimientos Caja
          </NavLink>
          <NavLink 
            to="/cajero/caja"
            className={({ isActive }) => 
              `flex items-center gap-1 p-3 h-12 rounded-lg text-lg shadow-md border transition-colors ${
                darkMode ? "border-gray-600" : "border-gray-300"
              } ${
                isActive 
                  ? "bg-blue-600 text-white" 
                  : "hover:bg-gray-700"
              }`
            }
          >
            <BanknotesIcon className="h-6 w-6 mr-2" />
            <span className="font-semibold">Caja</span>
            <span className="flex-1" />
            <CajaStatusBadge compact darkMode={darkMode} className="ml-4" />
          </NavLink>
          {/* Empuja el botón Volver al fondo */}
          <div className="flex-1" />
          {/* Botón Volver sólo visible para gerente o empleado */}
          {(user?.role === "gerente" || user?.role === "empleado") && (
            <button
              onClick={() => navigate(user.role === "gerente" ? "/gerente" : "/empleado")}
              className="mt-2 flex items-center gap-2 p-2 rounded transition-colors bg-white/10 hover:bg-white/20"
            >
              ⟵ Volver
            </button>
          )}
        </nav>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className={`shadow p-4 flex justify-between items-center ${
          darkMode ? "bg-gray-800 text-white" : "bg-white"
        }`}>
          <h1 className="text-lg font-semibold">Panel de Cajero</h1>
          <div className="flex items-center gap-4">
            {user && (
              <>
                {/* Tarjeta usuario */}
                <span
                  className={`flex items-center gap-2 text-sm px-3 py-1 rounded-lg shadow-sm border font-medium transition-colors ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-pink-200"
                      : "bg-pink-50 border-pink-200 text-pink-700"
                  }`}
                >
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span className={darkMode ? "text-gray-300" : "text-gray-700"}>Cajero:</span>
                  <b
                    className={
                      darkMode ? "text-pink-300" : "text-pink-600"
                    }
                  >
                    {user?.name || user?.username || ""}
                  </b>
                </span>
              </>
            )}

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 px-3 py-1 rounded-lg border-2 shadow-sm transition-all duration-200 bg-white text-gray-900 border-black hover:bg-gray-100"
            >
              {darkMode ? (
                <>
                  <SunIcon className="h-4 w-4" />
                  Claro
                </>
              ) : (
                <>
                  <MoonIcon className="h-4 w-4" />
                  Oscuro
                </>
              )}
            </button>
            
            {user ? (
              <button
                onClick={logout}
                className={`flex items-center gap-2 rounded-lg px-3 py-1 border-2 shadow-sm transition-all duration-200 ${
                  darkMode
                    ? "border-gray-600 bg-gray-700 hover:bg-gray-600 text-white"
                    : "border-pink-400 bg-pink-50 hover:bg-pink-100 text-pink-700"
                }`}
              >
                <PowerIcon className="h-4 w-4" />
                Cerrar sesión
              </button>
            ) : (
              <span className="text-sm text-gray-500">No logueado</span>
            )}
          </div>
        </header>

        {/* Main content con guardia de Caja */}
        <CajaGuard
          darkMode={darkMode}
          allowedWhenClosed={["/cajero/caja", "/cajero/history", "/cajero/movimientos"]}
        >
          <main className="flex-1 p-6">
            <Routes>
              <Route index element={<Navigate to="payment" replace />} />
              <Route path="/payment" element={<PaymentForm darkMode={darkMode} />} />
              <Route path="/history" element={<SalesHistory darkMode={darkMode} />} />
              <Route path="/movimientos" element={<MovimientosCaja darkMode={darkMode} />} />
              <Route path="/caja" element={<Caja darkMode={darkMode} />} />
            </Routes>
          </main>
        </CajaGuard>
      </div>
    </div>
  );
}