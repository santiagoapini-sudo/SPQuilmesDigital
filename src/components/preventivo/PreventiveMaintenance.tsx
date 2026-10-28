import React, { useState } from 'react';
import { 
  PreventiveInspection, 
  QuilmesNeighborhood, 
  UserProfile 
} from '../../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  CheckSquare, 
  Square, 
  Calendar, 
  User, 
  MapPin,
  X,
  Save,
  Check
} from 'lucide-react';

interface PreventiveMaintenanceProps {
  inspections: PreventiveInspection[];
  onSaveInspection: (inspection: PreventiveInspection) => void;
  onToggleChecklistItem: (inspectionId: string, index: number) => void;
  currentUser: UserProfile;
}

export const PreventiveMaintenance: React.FC<PreventiveMaintenanceProps> = ({
  inspections,
  onSaveInspection,
  onToggleChecklistItem,
  currentUser
}) => {
  const [filterTarget, setFilterTarget] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form states for new inspection schedule
  const [title, setTitle] = useState('');
  const [targetType, setTargetType] = useState<any>('Sumideros y bocas de tormenta');
  const [neighborhood, setNeighborhood] = useState<QuilmesNeighborhood>('Quilmes Centro');
  const [location, setLocation] = useState('');
  const [frequency, setFrequency] = useState<any>('Quincenal');
  const [responsibleInspector, setResponsibleInspector] = useState(currentUser.name);
  const [responsibleArea, setResponsibleArea] = useState('Dirección de Hidráulica, Sumideros y Pluviales');
  const [nextScheduledDate, setNextScheduledDate] = useState('');
  const [checklistItemsText, setChecklistItemsText] = useState(
    'Revisión estructural de rejillas\nMedición de nivel de sedimentos\nPrueba de desagüe con tobera de presión\nLimpieza y desobstrucción'
  );

  const todayStr = new Date().toISOString().split('T')[0];

  // Calculate dynamic status for each inspection
  const processedInspections = inspections.map(item => {
    let status: 'Al día' | 'Próxima' | 'Vencida' = 'Al día';
    if (item.nextScheduledDate < todayStr) {
      status = 'Vencida';
    } else {
      const diffDays = Math.ceil(
        (new Date(item.nextScheduledDate).getTime() - new Date(todayStr).getTime()) / (1000 * 3600 * 24)
      );
      if (diffDays <= 5) {
        status = 'Próxima';
      }
    }
    return { ...item, status };
  });

  const filtered = processedInspections.filter(item => {
    if (filterTarget !== 'all' && item.targetType !== filterTarget) return false;
    return true;
  });

  const overdueCount = processedInspections.filter(i => i.status === 'Vencida').length;
  const upcomingCount = processedInspections.filter(i => i.status === 'Próxima').length;

  const handleOpenCreate = () => {
    setTitle('');
    setTargetType('Sumideros y bocas de tormenta');
    setNeighborhood('Quilmes Centro');
    setLocation('');
    setFrequency('Quincenal');
    setResponsibleInspector(currentUser.name);
    setResponsibleArea('Dirección de Hidráulica, Sumideros y Pluviales');
    setNextScheduledDate(new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const items = checklistItemsText
      .split('\n')
      .map(i => i.trim())
      .filter(Boolean)
      .map(item => ({ item, checked: false }));

    const newInspection: PreventiveInspection = {
      id: `PREV-2027-00${inspections.length + 1}`,
      title,
      targetType,
      neighborhood,
      location,
      coordinates: { lat: -34.724, lng: -58.254 },
      frequency,
      responsibleInspector,
      responsibleArea,
      nextScheduledDate,
      status: 'Al día',
      checklist: items.length > 0 ? items : [{ item: 'Inspección visual general', checked: false }]
    };

    onSaveInspection(newInspection);
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Prevención y Resiliencia Urbana
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">Programa de Inspecciones Preventivas</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Mantenimiento Preventivo de Infraestructura Crítica
            </h1>
          </div>

          {currentUser.role !== 'INTENDENTE' && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-300" />
              <span>Programar Inspección</span>
            </button>
          )}
        </div>

        {/* Status Alert Ticker */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Al día: {processedInspections.length - overdueCount - upcomingCount}</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Próximas (menos de 5 días): {upcomingCount}</span>
          </div>

          {overdueCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-900 font-bold">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>¡Atención! Vencidas: {overdueCount}</span>
            </div>
          )}

          <div className="ml-auto">
            <select
              value={filterTarget}
              onChange={(e) => setFilterTarget(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium text-xs"
            >
              <option value="all">Todos los tipos de infraestructura</option>
              <option value="Sumideros y bocas de tormenta">Sumideros y bocas de tormenta</option>
              <option value="Drenajes pluviales">Drenajes pluviales</option>
              <option value="Calles y losas de hormigón">Calles y losas de hormigón</option>
              <option value="Plazas y juegos infantiles">Plazas y juegos infantiles</option>
              <option value="Mobiliario urbano">Mobiliario urbano</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inspections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const completedCount = item.checklist.filter(c => c.checked).length;
          const percentComplete = Math.round((completedCount / item.checklist.length) * 100);

          return (
            <div
              key={item.id}
              className={`bg-white border rounded-xl p-5 shadow-xs flex flex-col justify-between ${
                item.status === 'Vencida' ? 'border-rose-300 ring-1 ring-rose-100' :
                item.status === 'Próxima' ? 'border-amber-300' :
                'border-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {item.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    item.status === 'Vencida' ? 'bg-rose-100 text-rose-800' :
                    item.status === 'Próxima' ? 'bg-amber-100 text-amber-800' :
                    'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.status === 'Vencida' ? 'ALERTA: VENCIDA' : item.status === 'Próxima' ? 'PRÓXIMA A EJECUTAR' : 'AL DÍA'}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">
                  {item.title}
                </h3>

                <div className="mt-1 text-xs text-purple-900 font-medium">
                  {item.targetType} · Frecuencia: <span className="font-bold">{item.frequency}</span>
                </div>

                <div className="mt-2 text-xs text-slate-600 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{item.location} ({item.neighborhood})</span>
                </div>

                {/* Progress bar of checklist */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">Progreso de Lista de Chequeo</span>
                    <span className="font-mono font-bold text-slate-900">{completedCount}/{item.checklist.length} ({percentComplete}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${percentComplete === 100 ? 'bg-emerald-500' : 'bg-purple-800'}`}
                      style={{ width: `${percentComplete}%` }}
                    />
                  </div>
                </div>

                {/* Checklist items */}
                <div className="mt-3 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Puntos de Control In Situ
                  </span>
                  {item.checklist.map((c, idx) => (
                    <div
                      key={idx}
                      onClick={() => onToggleChecklistItem(item.id, idx)}
                      className="flex items-start gap-2 text-xs cursor-pointer hover:text-purple-900 group"
                    >
                      {c.checked ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <Square className="w-4 h-4 text-slate-400 shrink-0 mt-0.5 group-hover:text-purple-800" />
                      )}
                      <span className={`text-slate-800 ${c.checked ? 'line-through text-slate-400' : ''}`}>
                        {c.item}
                      </span>
                    </div>
                  ))}
                </div>

                {item.notes && (
                  <p className="mt-2 text-xs text-slate-500 italic bg-amber-50/50 p-2 rounded border border-amber-100">
                    "{item.notes}"
                  </p>
                )}
              </div>

              {/* Card Footer with Responsible and Dates */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-800">{item.responsibleInspector}</span>
                </div>

                <div className="flex items-center gap-2 font-mono">
                  <span>Próx: <strong className="text-slate-900">{item.nextScheduledDate}</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Program Inspection Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Programar Rutina de Mantenimiento Preventivo
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título del Programa *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Ej: Inspección semanal de sumideros en Av. Calchaquí"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Infraestructura</label>
                  <select
                    value={targetType}
                    onChange={(e) => setTargetType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Sumideros y bocas de tormenta">Sumideros y bocas de tormenta</option>
                    <option value="Drenajes pluviales">Drenajes pluviales</option>
                    <option value="Calles y losas de hormigón">Calles y losas de hormigón</option>
                    <option value="Plazas y juegos infantiles">Plazas y juegos infantiles</option>
                    <option value="Mobiliario urbano">Mobiliario urbano</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Frecuencia</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Semanal">Semanal</option>
                    <option value="Quincenal">Quincenal</option>
                    <option value="Mensual">Mensual</option>
                    <option value="Bimestral">Bimestral</option>
                    <option value="Trimestral">Trimestral</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Localidad / Barrio</label>
                  <select
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
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
                  <label className="block font-semibold text-slate-700 mb-1">Ubicación / Tramo</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                    placeholder="Ej: Corredor Av. Mitre"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Inspector a Cargo</label>
                  <input
                    type="text"
                    value={responsibleInspector}
                    onChange={(e) => setResponsibleInspector(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Próxima Fecha</label>
                  <input
                    type="date"
                    value={nextScheduledDate}
                    onChange={(e) => setNextScheduledDate(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Puntos de la Lista de Chequeo (uno por línea)
                </label>
                <textarea
                  rows={4}
                  value={checklistItemsText}
                  onChange={(e) => setChecklistItemsText(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5 text-cyan-300" />
                  <span>Guardar Rutina Preventiva</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
