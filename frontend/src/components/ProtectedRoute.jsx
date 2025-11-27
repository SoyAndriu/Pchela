import { Navigate } from 'react-router-dom';
import usePermisos from '../hooks/usePermisos';

/**
 * Componente que protege rutas basándose en permisos del usuario.
 * Si el usuario no tiene el permiso requerido, redirige a una página de acceso denegado.
 * 
 * @param {React.ReactNode} children - Componente hijo a renderizar si tiene permiso
 * @param {string} requiredPermission - Nombre del permiso requerido (ej: 'puede_ventas')
 */
export default function ProtectedRoute({ children, requiredPermission }) {
  const { permisos, loading } = usePermisos();

  // Mostrar loader mientras se cargan los permisos
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  // Si es gerente, tiene acceso a todo
  if (permisos.es_gerente) {
    return children;
  }

  // Verificar si tiene el permiso específico
  if (permisos[requiredPermission]) {
    return children;
  }

  // Si no tiene permiso, redirigir a página de acceso denegado
  return <Navigate to="/empleado/sin-acceso" replace />;
}
