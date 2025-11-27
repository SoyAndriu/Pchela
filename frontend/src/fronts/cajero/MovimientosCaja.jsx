import { useEffect, useState, useMemo } from "react";
import useCaja from "../../hooks/useCaja";
import Pagination from "../../components/Pagination";
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  AdjustmentsHorizontalIcon,
  MagnifyingGlassIcon,
  ScaleIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  XCircleIcon
} from "@heroicons/react/24/outline";

export default function MovimientosCaja({ darkMode }) {
  const { getHistorialCompleto } = useCaja();
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoFilter, setTipoFilter] = useState("all");
  const [medioPagoFilter, setMedioPagoFilter] = useState("all");
  
  // Paginación
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    loadMovimientos();
  }, []);

  const loadMovimientos = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getHistorialCompleto();
      const list = Array.isArray(data) ? data : [];
      setMovimientos(list);
    } catch (err) {
      setError(err.message || "Error cargando movimientos");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar movimientos
  const filteredMovimientos = useMemo(() => {
    let filtered = movimientos;

    // Buscar por descripción
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        (m.descripcion || "").toLowerCase().includes(q) ||
        (m.origen || "").toLowerCase().includes(q) ||
        (m.empleado_nombre || "").toLowerCase().includes(q)
      );
    }

    // Filtrar por tipo
    if (tipoFilter !== "all") {
      filtered = filtered.filter(m => 
        (m.tipo || "").toUpperCase() === tipoFilter.toUpperCase()
      );
    }

    // Filtrar por medio de pago
    if (medioPagoFilter !== "all") {
      filtered = filtered.filter(m => {
        const medio = m.medio_pago_display || m.id_tipo_pago_nombre || "";
        return medio.toUpperCase() === medioPagoFilter.toUpperCase();
      });
    }

    return filtered;
  }, [movimientos, searchTerm, tipoFilter, medioPagoFilter]);

  // Paginar
  const totalItems = filteredMovimientos.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const currentPageMovimientos = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredMovimientos.slice(start, start + pageSize);
  }, [filteredMovimientos, page, pageSize]);

  useEffect(() => { setPage(1); }, [searchTerm, tipoFilter, medioPagoFilter, pageSize]);

  const fmtCurrency = (val) => {
    if (val === undefined || val === null) return "-";
    const n = Number(val);
    return isNaN(n) ? String(val) : n.toLocaleString("es-AR", { style: "currency", currency: "ARS" });
  };

  const fmtDate = (val) => {
    if (!val) return "-";
    try {
      const d = new Date(val);
      return d.toLocaleString("es-AR", { 
        day: "2-digit", 
        month: "2-digit", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return String(val);
    }
  };

  const getTipoIcon = (tipo) => {
    const t = (tipo || "").toUpperCase();
    if (t === "INGRESO") return <ArrowUpIcon className="h-5 w-5 text-green-500" />;
    if (t === "EGRESO") return <ArrowDownIcon className="h-5 w-5 text-red-500" />;
    if (t === "AJUSTE") return <ScaleIcon className="h-5 w-5 text-yellow-500" />;
    if (t === "REVERSO") return <ArrowPathIcon className="h-5 w-5 text-gray-500" />;
    if (t === "APERTURA") return <CheckCircleIcon className="h-5 w-5 text-blue-500" />;
    if (t === "CIERRE") return <XCircleIcon className="h-5 w-5 text-purple-500" />;
    return <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-500" />;
  };

  const getTipoColor = (tipo) => {
    const t = (tipo || "").toUpperCase();
    if (t === "INGRESO") return darkMode ? "text-green-400" : "text-green-600";
    if (t === "EGRESO") return darkMode ? "text-red-400" : "text-red-600";
    if (t === "AJUSTE") return darkMode ? "text-yellow-400" : "text-yellow-600";
    if (t === "REVERSO") return darkMode ? "text-gray-400" : "text-gray-600";
    if (t === "APERTURA") return darkMode ? "text-blue-400" : "text-blue-600";
    if (t === "CIERRE") return darkMode ? "text-purple-400" : "text-purple-600";
    return darkMode ? "text-gray-400" : "text-gray-600";
  };

  return (
    <div className={`space-y-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Historial de Movimientos de Caja</h1>
        <button
          onClick={loadMovimientos}
          disabled={loading}
          className={`px-4 py-2 rounded font-semibold transition ${
            darkMode
              ? "bg-pink-600 hover:bg-pink-700 text-white"
              : "bg-pink-500 hover:bg-pink-600 text-white"
          } disabled:opacity-50`}
        >
          {loading ? "Cargando..." : "Actualizar"}
        </button>
      </div>

      {error && (
        <div className={`p-4 rounded ${darkMode ? "bg-red-900/30 text-red-300" : "bg-red-50 text-red-700"}`}>
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className={`p-4 rounded-lg space-y-4 ${darkMode ? "bg-gray-800" : "bg-white shadow"}`}>
        <h3 className="font-semibold flex items-center gap-2">
          <MagnifyingGlassIcon className="h-5 w-5" />
          Filtros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm mb-1">Buscar</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Descripción, origen..."
              className={`w-full rounded p-2 border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-sm mb-1">Tipo</label>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className={`w-full rounded p-2 border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            >
              <option value="all">Todos</option>
              <option value="INGRESO">Ingreso</option>
              <option value="EGRESO">Egreso</option>
              <option value="AJUSTE">Ajuste</option>
              <option value="REVERSO">Reverso</option>
              <option value="APERTURA">Apertura</option>
              <option value="CIERRE">Cierre</option>
            </select>
          </div>

          {/* Medio de pago */}
          <div>
            <label className="block text-sm mb-1">Medio de Pago</label>
            <select
              value={medioPagoFilter}
              onChange={(e) => setMedioPagoFilter(e.target.value)}
              className={`w-full rounded p-2 border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-white border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-pink-500`}
            >
              <option value="all">Todos</option>
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="TRANSFERENCIA">Transferencia</option>
              <option value="CREDITO">Crédito</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de movimientos */}
      <div className={`overflow-x-auto border rounded-lg shadow-sm ${
        darkMode ? "border-gray-700" : "border-gray-200"
      }`}>
        <table className="w-full text-sm">
          <thead className={darkMode ? "bg-gray-700 text-gray-100" : "bg-gray-50 text-gray-800"}>
            <tr>
              <th className="px-4 py-2 text-left">Tipo</th>
              <th className="px-4 py-2 text-left">Fecha</th>
              <th className="px-4 py-2 text-left">Descripción</th>
              <th className="px-4 py-2 text-left">Empleado</th>
              <th className="px-4 py-2 text-left">Medio</th>
              <th className="px-4 py-2 text-right">Monto</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                  Cargando movimientos...
                </td>
              </tr>
            ) : currentPageMovimientos.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                  No hay movimientos que mostrar
                </td>
              </tr>
            ) : (
              currentPageMovimientos.map((mov) => (
                <tr
                  key={mov.id}
                  className={`${darkMode ? "border-t border-gray-700" : "border-t border-gray-200"} ${
                    mov.es_evento_caja ? (darkMode ? "bg-gray-800/50" : "bg-blue-50/50") : ""
                  }`}
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {getTipoIcon(mov.tipo)}
                      <span className={getTipoColor(mov.tipo)}>
                        {(mov.tipo || "-").toUpperCase()}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">{fmtDate(mov.fecha || mov.created_at)}</td>
                  <td className="px-4 py-2">
                    <div>{mov.descripcion || "-"}</div>
                    {mov.es_evento_caja && (
                      <span className={`text-xs ${darkMode ? "text-blue-400" : "text-blue-600"}`}>
                        Caja #{mov.numero_caja}
                      </span>
                    )}
                    {mov.diferencia !== undefined && mov.diferencia !== 0 && (
                      <div className={`text-xs ${darkMode ? "text-orange-400" : "text-orange-600"}`}>
                        Diferencia: {fmtCurrency(mov.diferencia)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {mov.empleado_nombre || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {mov.es_evento_caja ? "-" : (mov.medio_pago_display || mov.id_tipo_pago_nombre || "-")}
                  </td>
                  <td className={`px-4 py-2 text-right font-semibold ${getTipoColor(mov.tipo)}`}>
                    {fmtCurrency(mov.monto)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <Pagination
        currentPage={page}
        totalItems={totalItems}
        pageSize={pageSize}
        onPageChange={(p) => setPage(Math.min(Math.max(1, p), totalPages))}
        onPageSizeChange={(s) => setPageSize(s)}
        darkMode={darkMode}
      />
    </div>
  );
}
