import { useState, useCallback } from 'react';
import { apiFetch } from '../utils/productUtils';

const API_URL = 'http://localhost:8000/api/configuracion';

export const useConfiguracion = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getConfig = useCallback(async (tipo) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch(`${API_URL}/${tipo}/obtener/`);
      if (!response.ok) {
        throw new Error('Error al obtener configuración');
      }
      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message || 'Error al obtener configuración');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateConfig = useCallback(async (tipo, data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFetch(`${API_URL}/${tipo}/actualizar/`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        throw new Error('Error al actualizar configuración');
      }
      const responseData = await response.json();
      return responseData;
    } catch (err) {
      setError(err.message || 'Error al actualizar configuración');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getConfig,
    updateConfig
  };
};
