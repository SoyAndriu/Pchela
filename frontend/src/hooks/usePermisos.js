import { useState, useEffect } from 'react';
import { apiFetch } from '../utils/productUtils';
import { API_BASE } from '../config/productConfig';

/**
 * Hook para obtener los permisos del usuario actual.
 * Devuelve un objeto con todos los permisos y estados de carga/error.
 * 
 * Los gerentes tienen todos los permisos por defecto.
 * Los empleados obtienen sus permisos desde el backend.
 */
export default function usePermisos() {
  const [permisos, setPermisos] = useState({
    puede_ventas: false,
    puede_productos: false,
    puede_clientes: false,
    puede_compras: false,
    puede_proveedores: false,
    puede_lotes: false,
    puede_marcas: false,
    puede_reportes: false,
    puede_movimientos_caja: false,
    es_gerente: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchPermisos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiFetch(`${API_BASE}/permisos/mis-permisos/`);
        const data = await response.json();
        
        if (!mounted) return;
        
        setPermisos(data);
      } catch (err) {
        if (!mounted) return;
        
        console.error('Error al cargar permisos:', err);
        setError(err.message || 'No se pudieron cargar los permisos');
        
        // En caso de error, asumir sin permisos
        setPermisos({
          puede_ventas: false,
          puede_productos: false,
          puede_clientes: false,
          puede_compras: false,
          puede_proveedores: false,
          puede_lotes: false,
          puede_marcas: false,
          puede_reportes: false,
          puede_movimientos_caja: false,
          es_gerente: false,
        });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPermisos();

    return () => {
      mounted = false;
    };
  }, []);

  return { permisos, loading, error };
}
