import { XCircleIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';

export default function SinAcceso({ darkMode }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <XCircleIcon className={`w-24 h-24 mx-auto mb-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
        <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`}>
          Acceso Denegado
        </h1>
        <p className={`text-lg mb-6 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
          No tienes permisos para acceder a esta sección.
        </p>
        <p className={`text-sm mb-8 ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
          Contacta a tu gerente si necesitas acceso a esta funcionalidad.
        </p>
        <button
          onClick={() => navigate('/empleado')}
          className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
}
