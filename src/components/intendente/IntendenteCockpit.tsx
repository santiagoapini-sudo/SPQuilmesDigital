import React, { useState } from 'react';
import { Intervention, UserProfile } from '../../types';
import { 
  Award, 
  CheckCircle2, 
  Activity, 
  Clock, 
  AlertTriangle, 
  Printer, 
  Calendar, 
  MapPin, 
  Landmark, 
  CheckCheck,
  TrendingUp,
  FileText,
  ShieldCheck,
  Building2
} from 'lucide-react';

interface IntendenteCockpitProps {
  interventions: Intervention[];
  currentUser: UserProfile;
  lastUpdated: string;
}

export const IntendenteCockpit: React.FC<IntendenteCockpitProps> = ({
  interventions,
  currentUser,
  lastUpdated
}) => {
  const [period, setPeriod] = useState<'mes' | 'trimestre' | 'plan2027'>('plan2027');

  const todayStr = new Date().toISOString().split('T')[0];

  // Key metrics
  const total = interventions.length;
  const verifiedAndClosed = interventions.filter(i => i.status === 'Verificada y cerrada').length;
  const finishedPendingVerif = interventions.filter(i => i.status === 'Finalizada, pendiente de verificación').length;
  const totalCompleted = verifiedAndClosed + finishedPendingVerif;
  const inExecution = interventions.filter(i => i.status === 'En ejecución' || i.status === 'Pendiente de materiales').length;
  const pending = interventions.filter(i => 
    i.status === 'Registrada' || i.status === 'Pendiente de evaluación' || i.status === 'Priorizada' || i.status === 'Programada' || i.status === 'Asignada'
  ).length;

  const overdue = interventions.filter(i => {
    if (i.status === 'Verificada y cerrada' || i.status === 'Finalizada, pendiente de verificación') return false;
    if (i.scheduledDate && i.scheduledDate < todayStr) return true;
    return false;
  }).length;

  const complianceRate = total > 0 ? Math.round((verifiedAndClosed / total) * 100) : 0;
  const progressRate = total > 0 ? Math.round(((totalCompleted + inExecution) / total) * 100) : 0;

  // Areas breakdown & department compliance
  const areaStats: Record<string, { total: number; closed: number; inExec: number }> = {};
  interventions.forEach(i => {
    const area = i.responsibleArea;
    if (!areaStats[area]) {
      areaStats[area] = { total: 0, closed: 0, inExec: 0 };
    }
    areaStats[area].total += 1;
    if (i.status === 'Verificada y cerrada') areaStats[area].closed += 1;
    if (i.status === 'En ejecución') areaStats[area].inExec += 1;
  });

  // Zones breakdown
  const zoneStats: Record<string, number> = {};
  interventions.forEach(i => {
    zoneStats[i.neighborhood] = (zoneStats[i.neighborhood] || 0) + 1;
  });
  const topZones = Object.entries(zoneStats).sort((a, b) => b[1] - a[1]);

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Intendente Executive Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-900 flex items-center justify-center shrink-0 border border-purple-700">
              <Landmark className="w-6 h-6 text-cyan-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  Despacho de Intendencia
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-300 font-medium">Modo Solo Lectura Seguro</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                Tablero de Control del Intendente — Plan Quilmes 2027
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                Síntesis ejecutiva de la Secretaría de Servicios Públicos. Seguimiento del cumplimiento de metas, calidad de obras e impacto barrial.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {/* Period Filter */}
            <div className="flex items-center bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs font-semibold">
              <button
                onClick={() => setPeriod('mes')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  period === 'mes' ? 'bg-purple-900 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Mes Actual
              </button>
              <button
                onClick={() => setPeriod('trimestre')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  period === 'trimestre' ? 'bg-purple-900 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Trimestre
              </button>
              <button
                onClick={() => setPeriod('plan2027')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  period === 'plan2027' ? 'bg-purple-900 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Plan 2027
              </button>
            </div>

            <button
              onClick={handlePrintReport}
              className="px-3.5 py-2 text-xs font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Printer className="w-4 h-4" />
              <span>Emitir Informe Ejecutivo</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Pillars Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pillar 1: Qué se hizo */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">1. Obras Finalizadas</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 font-mono tabular-nums">
            {totalCompleted}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            <strong className="text-emerald-700">{verifiedAndClosed}</strong> con certificación técnica in situ
          </div>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${progressRate}%` }}></div>
          </div>
        </div>

        {/* Pillar 2: Qué está en ejecución */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-800">2. En Ejecución</span>
            <Activity className="w-5 h-5 text-cyan-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-cyan-800 font-mono tabular-nums">
            {inExecution}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Cuadrillas trabajando en vía pública hoy
          </div>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-cyan-600 h-full rounded-full" style={{ width: `${total > 0 ? (inExecution/total)*100 : 0}%` }}></div>
          </div>
        </div>

        {/* Pillar 3: Qué está pendiente */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-800">3. Pendientes / Prog.</span>
            <Clock className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-slate-900 font-mono tabular-nums">
            {pending}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Proyectos agendados o en evaluación
          </div>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${total > 0 ? (pending/total)*100 : 0}%` }}></div>
          </div>
        </div>

        {/* Pillar 4: Qué tareas están atrasadas */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-800">4. Desvíos / Atrasadas</span>
            <AlertTriangle className="w-5 h-5 text-rose-600" />
          </div>
          <div className="mt-2 text-3xl font-black text-rose-600 font-mono tabular-nums">
            {overdue}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {overdue === 0 ? 'Sin atrasos críticos detectados' : 'Requieren aceleración de cuadrilla'}
          </div>
          <div className="mt-3 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-rose-500 h-full rounded-full" style={{ width: `${total > 0 ? (overdue/total)*100 : 0}%` }}></div>
          </div>
        </div>

      </div>

      {/* Two Macro Panels: Department Compliance & Geographic Concentration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Compliance by Department */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-900" />
                <span>Cumplimiento por Dirección de Servicios Públicos</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Obras cerradas y avance operativo de cada equipo de conducción
              </p>
            </div>
            <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2 py-1 rounded">
              Meta 2027: 85%+
            </span>
          </div>

          <div className="space-y-4">
            {Object.entries(areaStats).map(([area, stats], i) => {
              const compPercent = stats.total > 0 ? Math.round((stats.closed / stats.total) * 100) : 0;

              return (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{area}</span>
                    <span className="font-mono font-bold text-purple-950">
                      {stats.closed}/{stats.total} cerradas ({compPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-emerald-600 h-full transition-all" 
                      style={{ width: `${compPercent}%` }}
                      title={`${compPercent}% verificadas`}
                    />
                    <div 
                      className="bg-cyan-500 h-full transition-all" 
                      style={{ width: `${stats.total > 0 ? (stats.inExec / stats.total) * 100 : 0}%` }}
                      title="En ejecución"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>{stats.inExec} obras en campo</span>
                    <span>Total asignado: {stats.total} intervenciones</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Zones Heatmap Ranking */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-900" />
                <span>Concentración Territorial de Intervenciones</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Localidades de Quilmes con mayor despliegue de maquinaria y personal
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {topZones.map(([zone, count], i) => {
              const zonePercent = total > 0 ? Math.round((count / total) * 100) : 0;

              return (
                <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-900 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-slate-800">{zone}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden hidden sm:block">
                      <div className="bg-purple-900 h-full rounded-full" style={{ width: `${zonePercent}%` }} />
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {count} obras ({zonePercent}%)
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Safety Notice for the Mayor */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>Protección de Datos:</strong> Esta vista ejecutiva está blindada contra modificaciones operativas accidentales.
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">
          Corte de datos: {new Date(lastUpdated).toLocaleString('es-AR')}
        </span>
      </div>

    </div>
  );
};
