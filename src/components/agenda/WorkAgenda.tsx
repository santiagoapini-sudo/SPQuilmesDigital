import React, { useState } from 'react';
import { 
  Intervention, 
  Cuadrilla, 
  UserProfile 
} from '../../types';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  AlertTriangle, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Filter,
  CalendarDays,
  MapPin,
  Edit
} from 'lucide-react';

interface WorkAgendaProps {
  interventions: Intervention[];
  cuadrillas: Cuadrilla[];
  onSelectIntervention: (id: string) => void;
  onReschedule: (id: string, newDate: string, delayReason?: string) => void;
  currentUser: UserProfile;
}

export const WorkAgenda: React.FC<WorkAgendaProps> = ({
  interventions,
  cuadrillas,
  onSelectIntervention,
  onReschedule,
  currentUser
}) => {
  const [viewCadence, setViewCadence] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedCuadrillaFilter, setSelectedCuadrillaFilter] = useState<string>('all');
  
  // Reschedule modal state
  const [reschedulingItem, setReschedulingItem] = useState<Intervention | null>(null);
  const [newDateInput, setNewDateInput] = useState('');
  const [delayReasonInput, setDelayReasonInput] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Overdue interventions: scheduledDate < todayStr and not completed
  const overdueInterventions = interventions.filter(item => {
    if (item.status === 'Verificada y cerrada' || item.status === 'Finalizada, pendiente de verificación') return false;
    if (item.scheduledDate && item.scheduledDate < todayStr) return true;
    return false;
  });

  // Scheduled interventions
  const scheduledInterventions = interventions.filter(item => {
    if (selectedCuadrillaFilter !== 'all' && item.cuadrillaId !== selectedCuadrillaFilter) return false;
    return !!item.scheduledDate;
  });

  // Group by date
  const groupedByDate: Record<string, Intervention[]> = {};
  scheduledInterventions.forEach(item => {
    if (item.scheduledDate) {
      if (!groupedByDate[item.scheduledDate]) {
        groupedByDate[item.scheduledDate] = [];
      }
      groupedByDate[item.scheduledDate].push(item);
    }
  });

  // Sort dates
  const sortedDates = Object.keys(groupedByDate).sort();

  const handleOpenReschedule = (item: Intervention, e: React.MouseEvent) => {
    e.stopPropagation();
    setReschedulingItem(item);
    setNewDateInput(item.scheduledDate || todayStr);
    setDelayReasonInput(item.delayReason || '');
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingItem || !newDateInput) return;
    onReschedule(reschedulingItem.id, newDateInput, delayReasonInput);
    setReschedulingItem(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Planificación Operativa
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">Cronograma de Cuadrillas</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Agenda Integral de Trabajos y Misiones
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* View Selector */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setViewCadence('daily')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  viewCadence === 'daily' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Diaria
              </button>
              <button
                onClick={() => setViewCadence('weekly')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  viewCadence === 'weekly' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semanal
              </button>
              <button
                onClick={() => setViewCadence('monthly')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  viewCadence === 'monthly' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mensual
              </button>
            </div>

            {/* Filter by Cuadrilla */}
            <select
              value={selectedCuadrillaFilter}
              onChange={(e) => setSelectedCuadrillaFilter(e.target.value)}
              className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:outline-hidden focus:border-purple-600"
            >
              <option value="all">Todas las cuadrillas</option>
              {cuadrillas.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Overdue Alert Bar if any */}
        {overdueInterventions.length > 0 && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-between flex-wrap gap-2 text-xs text-rose-900">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>Atención:</strong> Se detectaron <strong>{overdueInterventions.length}</strong> tareas programadas que superaron la fecha límite sin verificarse.
              </span>
            </div>
            <span className="text-[11px] font-semibold text-rose-700 bg-white/80 px-2 py-0.5 rounded border border-rose-200">
              Requieren reprogramación o reporte
            </span>
          </div>
        )}
      </div>

      {/* Agenda Content */}
      <div className="space-y-4">
        {sortedDates.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-xs">
            No hay trabajos programados con los filtros seleccionados.
          </div>
        ) : (
          sortedDates.map((dateStr) => {
            const items = groupedByDate[dateStr];
            const isToday = dateStr === todayStr;
            const isPast = dateStr < todayStr;

            return (
              <div 
                key={dateStr}
                className={`bg-white border rounded-xl overflow-hidden shadow-xs ${
                  isToday 
                    ? 'border-purple-400 ring-2 ring-purple-100' 
                    : isPast && items.some(i => i.status !== 'Verificada y cerrada' && i.status !== 'Finalizada, pendiente de verificación')
                    ? 'border-rose-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Date Header Strip */}
                <div className={`px-4 py-2.5 flex items-center justify-between border-b ${
                  isToday 
                    ? 'bg-purple-900 text-white' 
                    : 'bg-slate-50 text-slate-800 border-slate-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <CalendarDays className={`w-4 h-4 ${isToday ? 'text-cyan-300' : 'text-purple-800'}`} />
                    <span className="font-bold text-xs uppercase tracking-wider">
                      {new Date(dateStr + 'T12:00:00').toLocaleDateString('es-AR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    {isToday && (
                      <span className="text-[10px] font-bold bg-cyan-400 text-slate-950 px-1.5 py-0.2 rounded uppercase ml-2">
                        HOY
                      </span>
                    )}
                  </div>

                  <span className={`text-[11px] font-mono font-semibold ${isToday ? 'text-purple-200' : 'text-slate-500'}`}>
                    {items.length} {items.length === 1 ? 'tarea' : 'tareas'}
                  </span>
                </div>

                {/* Items on this Date */}
                <div className="divide-y divide-slate-100 p-2">
                  {items.map((item) => {
                    const isOverdue = isPast && item.status !== 'Verificada y cerrada' && item.status !== 'Finalizada, pendiente de verificación';

                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectIntervention(item.id)}
                        className="p-3 hover:bg-slate-50/80 rounded-lg transition-colors cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                            item.status === 'Verificada y cerrada' ? 'bg-emerald-500' :
                            item.status === 'En ejecución' ? 'bg-cyan-500' :
                            isOverdue ? 'bg-rose-500' : 'bg-purple-700'
                          }`} />

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono font-bold text-purple-950 text-xs">
                                {item.id}
                              </span>
                              <span className="text-slate-300">·</span>
                              <span className="font-semibold text-slate-900 text-xs">
                                {item.category}
                              </span>
                              {isOverdue && (
                                <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                                  Atrasada
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-700 font-medium mt-0.5">
                              {item.title}
                            </p>

                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1 flex-wrap">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                <span>{item.address} ({item.neighborhood})</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-3 h-3 text-slate-400" />
                                <span>{item.cuadrillaName || 'Sin cuadrilla'}</span>
                              </span>
                            </div>

                            {item.delayReason && (
                              <div className="mt-1.5 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Demora informada: {item.delayReason}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons on card */}
                        <div className="flex items-center gap-2 shrink-0 md:self-center" onClick={(e) => e.stopPropagation()}>
                          <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${
                            item.status === 'Verificada y cerrada' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                            item.status === 'En ejecución' ? 'bg-cyan-50 text-cyan-800 border-cyan-200' :
                            'bg-slate-100 text-slate-700 border-slate-200'
                          }`}>
                            {item.status}
                          </span>

                          {currentUser.role !== 'INTENDENTE' && (
                            <button
                              onClick={(e) => handleOpenReschedule(item, e)}
                              className="px-2.5 py-1 text-xs font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition-colors flex items-center gap-1"
                              title="Reprogramar fecha"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Reprogramar</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Reschedule Modal */}
      {reschedulingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-md p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="font-bold text-sm text-slate-900">
                Reprogramar Intervención {reschedulingItem.id}
              </h3>
              <button onClick={() => setReschedulingItem(null)} className="text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReschedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nueva Fecha Programada *
                </label>
                <input
                  type="date"
                  value={newDateInput}
                  onChange={(e) => setNewDateInput(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Motivo de Demora / Reprogramación *
                </label>
                <textarea
                  rows={3}
                  placeholder="Ej: Lluvias intensas imposibilitan el bacheo en caliente; espera de provisión de tubos pluviales..."
                  value={delayReasonInput}
                  onChange={(e) => setDelayReasonInput(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReschedulingItem(null)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 rounded-lg transition-colors"
                >
                  Guardar Reprogramación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
