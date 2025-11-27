import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Sidebar from "./SiderbarEmpleado";
import Dashboard from "../../pages/Dashboard";
import Products from "../../pages/Products";
import Ventas from "../../pages/Ventas";
import Compras from "../../pages/Compras";
import ComprasHistorial from "../../pages/ComprasHistorial";
import Proveedores from "../../pages/Proveedores";
import Clientes from "../../pages/Clientes";
import Reportes from "../../pages/Reportes";
import ClientesInactivos from "../../pages/ClientesInactivos";
import SinAcceso from "../../pages/SinAcceso";
import { useAuth } from "../../auth/AuthContext";
import Header from "../../components/Header";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function EmpleadoLayout() {
  const [darkMode, setDarkMode] = useState(false);
  const { user, logout } = useAuth();

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
    <div
      className={`flex min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-pink-25"
      }`}
    >
      {/* Sidebar siempre visible */}
      <Sidebar darkMode={darkMode} />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        {/* Barra superior */}
        <Header darkMode={darkMode} setDarkMode={setDarkMode} user={user} logout={logout} userRole="Empleado" />

        <main className="p-6">
          <Routes>
            <Route index element={<Dashboard darkMode={darkMode} />} />
            
            <Route 
              path="productos" 
              element={
                <ProtectedRoute requiredPermission="puede_productos">
                  <Products darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="ventas" 
              element={
                <ProtectedRoute requiredPermission="puede_ventas">
                  <Ventas darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="compras" 
              element={
                <ProtectedRoute requiredPermission="puede_compras">
                  <Compras darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="compras/historial" 
              element={
                <ProtectedRoute requiredPermission="puede_compras">
                  <ComprasHistorial darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="proveedores" 
              element={
                <ProtectedRoute requiredPermission="puede_proveedores">
                  <Proveedores darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="clientes" 
              element={
                <ProtectedRoute requiredPermission="puede_clientes">
                  <Clientes darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="clientes-inactivos" 
              element={
                <ProtectedRoute requiredPermission="puede_clientes">
                  <ClientesInactivos darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="reportes" 
              element={
                <ProtectedRoute requiredPermission="puede_reportes">
                  <Reportes darkMode={darkMode} />
                </ProtectedRoute>
              } 
            />

            <Route path="sin-acceso" element={<SinAcceso darkMode={darkMode} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}