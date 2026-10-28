import React, { useState } from 'react';
import { 
  Intervention, 
  Cuadrilla, 
  InterventionCategory, 
  QuilmesNeighborhood, 
  UserProfile 
} from '../../types';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Filter, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  Clock, 
  MapPin,
  TrendingUp,
  FileText
} from 'lucide-react';

interface ReportsGeneratorProps {
  interventions: Intervention[];
  cuadrillas: Cuadrilla[];
  currentUser: UserProfile;
}

export const ReportsGenerator: React.FC<ReportsGeneratorProps> = ({
  interventions,
  cuadrillas,
  currentUser
}) => {
  const [filterPeriod, setFilterPeriod] = useState<string>('todos');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterNeighborhood, setFilterNeighborhood] = useState<string>('all');
  const [filterArea, setFilterArea] = useState<string>('all');
  const [filterCuadrilla, setFilterCuadrilla] = useState<string>('all');

  const generationTime = new Date().toLocaleString('es-AR');

  // Filter dataset
  const filtered = interventions.filter(item => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterNeighborhood !== 'all' && item.neighborhood !== filterNeighborhood) return false;
    if (filterArea !== 'all' && item.responsibleArea !== filterArea) return false;
    if (filterCuadrilla !== 'all' && item.cuadrillaId !== filterCuadrilla) return false;
    return true;
  });

  const total = filtered.length;
  const verifiedCount = filtered.filter(i => i.status === 'Verificada y cerrada').length;
  const finishedPendingCount = filtered.filter(i => i.status === 'Finalizada, pendiente de verificación').length;
  const inExecutionCount = filtered.filter(i => i.status === 'En ejecución' || i.status === 'Pendiente de materiales').length;
  const pendingCount = filtered.filter(i => 
    i.status === 'Registrada' || i.status === 'Pendiente de evaluación' || i.status === 'Priorizada' || i.status === 'Programada'
  ).length;

  const compliancePercent = total > 0 ? Math.round((verifiedCount / total) * 100) : 0;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Titulo', 'Categoria', 'Area', 'Barrio', 'Direccion', 'Prioridad', 'Estado', 'Fecha_Registro', 'Fecha_Prog', 'Verificado', 'Cuadrilla'];
    const rows = filtered.map(item => [
      item.id,
      `"${item.title.replace(/"/g, '""')}"`,
      item.category,
      `"${item.responsibleArea}"`,
      item.neighborhood,
      `"${item.address.replace(/"/g, '""')}"`,
      item.priority,
      item.status,
      item.registrationDate,
      item.scheduledDate || '',
      item.verification.verified ? 'SI' : 'NO',
      `"${item.cuadrillaName || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `quilmes360_informe_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Inteligencia y Estadísticas
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">Informes de Servicios Públicos</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Generador Oficial de Informes y Estadísticas
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              title="Descargar en formato CSV / Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Exportar CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-cyan-300" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* Filter Selection Panel */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Categoría</label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">Todas las categorías</option>
              <option value="Bacheo">Bacheo</option>
              <option value="Reparación de calzadas">Reparación de calzadas</option>
              <option value="Mantenimiento vial">Mantenimiento vial</option>
              <option value="Sumideros y bocas de tormenta">Sumideros y bocas de tormenta</option>
              <option value="Drenajes pluviales">Drenajes pluviales</option>
              <option value="Plazas y espacios públicos">Plazas y espacios públicos</option>
              <option value="Mobiliario urbano">Mobiliario urbano</option>
              <option value="Saneamiento">Saneamiento</option>
              <option value="Fumigación">Fumigación</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Barrio / Localidad</label>
            <select
              value={filterNeighborhood}
              onChange={(e) => setFilterNeighborhood(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">Todos los barrios</option>
              <option value="Quilmes Centro">Quilmes Centro</option>
              <option value="Quilmes Oeste">Quilmes Oeste</option>
              <option value="Bernal Este">Bernal Este</option>
              <option value="Bernal Oeste">Bernal Oeste</option>
              <option value="Don Bosco">Don Bosco</option>
              <option value="Ezpeleta Este">Ezpeleta Este</option>
              <option value="Ezpeleta Oeste">Ezpeleta Oeste</option>
              <option value="San Francisco Solano">San Francisco Solano</option>
              <option value="Villa La Florida">Villa La Florida</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cuadrilla Responsable</label>
            <select
              value={filterCuadrilla}
              onChange={(e) => setFilterCuadrilla(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">Todas las cuadrillas</option>
              {cuadrillas.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">Área Ejecutora</label>
            <select
              value={filterArea}
              onChange={(e) => setFilterArea(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">Todas las áreas de Servicios Públicos</option>
              <option value="Dirección General de Vialidad Urbana y Pavimentos">Dirección de Vialidad</option>
              <option value="Dirección de Hidráulica, Sumideros y Pluviales">Dirección de Hidráulica</option>
              <option value="Dirección de Espacios Públicos y Plazas">Dirección de Espacios Públicos</option>
              <option value="Dirección de Saneamiento y Control de Vectores">Dirección de Saneamiento</option>
            </select>
          </div>

        </div>

        {/* Report Metadata Info */}
        <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Fecha y hora de generación: <strong className="font-mono text-slate-700">{generationTime}</strong></span>
          <span>Usuario emisor: <strong className="text-slate-700">{currentUser.name} ({currentUser.role})</strong></span>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-slate-500 font-semibold block">Total Filtrado</span>
          <span className="text-2xl font-black text-slate-900 font-mono tabular-nums">{total}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-emerald-800 font-semibold block">Verificadas y Cerradas</span>
          <span className="text-2xl font-black text-emerald-700 font-mono tabular-nums">{verifiedCount}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-purple-800 font-semibold block">A Verificar</span>
          <span className="text-2xl font-black text-purple-800 font-mono tabular-nums">{finishedPendingCount}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-cyan-800 font-semibold block">En Ejecución</span>
          <span className="text-2xl font-black text-cyan-700 font-mono tabular-nums">{inExecutionCount}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-indigo-800 font-semibold block">% Cumplimiento Oficial</span>
          <span className="text-2xl font-black text-indigo-900 font-mono tabular-nums">{compliancePercent}%</span>
        </div>
      </div>

      {/* Report Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">
            Detalle Consolidado de Intervenciones ({filtered.length} registros)
          </h3>
          <span className="text-xs text-slate-500">Plan 2027 · Secretaría de Servicios Públicos</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No hay registros con los filtros seleccionados para este informe.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-2.5 px-3">Código</th>
                  <th className="py-2.5 px-3">Título / Ubicación</th>
                  <th className="py-2.5 px-3">Categoría</th>
                  <th className="py-2.5 px-3">Barrio</th>
                  <th className="py-2.5 px-3">Cuadrilla</th>
                  <th className="py-2.5 px-3">Estado</th>
                  <th className="py-2.5 px-3 text-right">Verificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono font-bold text-purple-950">
                      {item.id}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-slate-500">{item.address}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{item.category}</td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">{item.neighborhood}</td>
                    <td className="py-2.5 px-3 text-slate-600 truncate max-w-[150px]">
                      {item.cuadrillaName || 'S/A'}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-[11px] font-semibold text-slate-800">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      {item.verification.verified ? (
                        <span className="text-emerald-700 font-bold text-[11px]">
                          ✓ Certificada
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">
                          Pendiente
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
