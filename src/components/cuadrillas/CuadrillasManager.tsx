import React, { useState } from 'react';
import { 
  Cuadrilla, 
  Intervention, 
  InterventionCategory, 
  QuilmesNeighborhood, 
  UserProfile 
} from '../../types';
import { 
  Users, 
  Plus, 
  Truck, 
  Phone, 
  MapPin, 
  Wrench, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Edit2,
  Trash2,
  X,
  Save,
  Check
} from 'lucide-react';

interface CuadrillasManagerProps {
  cuadrillas: Cuadrilla[];
  interventions: Intervention[];
  onSaveCuadrilla: (cuadrilla: Cuadrilla) => void;
  onDeleteCuadrilla: (id: string) => void;
  onSelectIntervention: (id: string) => void;
  currentUser: UserProfile;
}

const SPECIALTIES: InterventionCategory[] = [
  'Bacheo',
  'Reparación de calzadas',
  'Mantenimiento vial',
  'Sumideros y bocas de tormenta',
  'Drenajes pluviales',
  'Plazas y espacios públicos',
  'Mobiliario urbano',
  'Saneamiento',
  'Fumigación'
];

export const CuadrillasManager: React.FC<CuadrillasManagerProps> = ({
  cuadrillas,
  interventions,
  onSaveCuadrilla,
  onDeleteCuadrilla,
  onSelectIntervention,
  currentUser
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCuadrilla, setEditingCuadrilla] = useState<Cuadrilla | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [lead, setLead] = useState('');
  const [specialty, setSpecialty] = useState<InterventionCategory>('Bacheo');
  const [membersText, setMembersText] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [status, setStatus] = useState<'Disponible' | 'En campo' | 'Mantenimiento' | 'Guardia activa'>('Disponible');
  const [zoneAssigned, setZoneAssigned] = useState<QuilmesNeighborhood>('Quilmes Centro');
  const [phone, setPhone] = useState('11-4253-9800');

  const handleOpenCreate = () => {
    setEditingCuadrilla(null);
    setName(`Cuadrilla 0${cuadrillas.length + 1} — `);
    setLead('');
    setSpecialty('Bacheo');
    setMembersText('');
    setVehicleModel('');
    setVehiclePlate('');
    setStatus('Disponible');
    setZoneAssigned('Quilmes Centro');
    setPhone('11-4253-9800');
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Cuadrilla) => {
    setEditingCuadrilla(c);
    setName(c.name);
    setLead(c.lead);
    setSpecialty(c.specialty);
    setMembersText(c.membersNames.join(', '));
    setVehicleModel(c.vehicleModel || '');
    setVehiclePlate(c.vehiclePlate || '');
    setStatus(c.status);
    setZoneAssigned(c.zoneAssigned || 'Quilmes Centro');
    setPhone(c.phone || '');
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const membersArray = membersText
      .split(',')
      .map(m => m.trim())
      .filter(Boolean);

    const cuadrillaData: Cuadrilla = {
      id: editingCuadrilla?.id || `CUAD-0${cuadrillas.length + 1}`,
      name,
      lead,
      specialty,
      membersCount: membersArray.length || 1,
      membersNames: membersArray.length ? membersArray : [lead],
      vehicleModel,
      vehiclePlate,
      status,
      zoneAssigned,
      phone
    };

    onSaveCuadrilla(cuadrillaData);
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
                Recursos Humanos y Logística
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">Cuadrillas Operativas de Quilmes</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Organización y Despliegue de Cuadrillas
            </h1>
          </div>

          {currentUser.role !== 'INTENDENTE' && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-300" />
              <span>Registrar Cuadrilla</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid of Cuadrillas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cuadrillas.map((c) => {
          // Find all interventions assigned to this cuadrilla
          const assignedInterventions = interventions.filter(i => i.cuadrillaId === c.id);
          const activeInterventions = assignedInterventions.filter(i => 
            i.status === 'En ejecución' || i.status === 'Programada' || i.status === 'Asignada'
          );

          // Workload risk check
          const hasOverload = activeInterventions.length >= 3;

          return (
            <div
              key={c.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {c.id}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.status === 'En campo' ? 'bg-cyan-100 text-cyan-800' :
                    c.status === 'Disponible' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">
                  {c.name}
                </h3>

                <div className="mt-1 text-xs text-purple-800 font-medium">
                  Especialidad: {c.specialty}
                </div>

                {/* Details list */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Responsable / Capataz:</span>
                    <span className="font-semibold text-slate-800">{c.lead}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Integrantes:</span>
                    <span className="font-semibold text-slate-800">{c.membersCount} operarios</span>
                  </div>

                  {c.vehicleModel && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Vehículo / Maquinaria:</span>
                      <span className="font-medium text-slate-700 text-right truncate max-w-[180px]">
                        {c.vehicleModel} ({c.vehiclePlate})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Zona Preferencial:</span>
                    <span className="font-medium text-slate-700">{c.zoneAssigned || 'Partido completo'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Contacto operativo:</span>
                    <span className="font-mono text-slate-700">{c.phone}</span>
                  </div>
                </div>

                {/* Overload Alert Warning */}
                {hasOverload && (
                  <div className="mt-2.5 p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                    <span>Carga elevada: {activeInterventions.length} tareas activas asignadas.</span>
                  </div>
                )}

                {/* Assigned Active Tasks */}
                <div className="mt-3 pt-2.5 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    Misiones Asignadas ({activeInterventions.length})
                  </div>

                  {activeInterventions.length === 0 ? (
                    <div className="text-[11px] text-slate-400 italic py-1">
                      Sin obras en curso asignadas actualmente
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {activeInterventions.slice(0, 3).map((work) => (
                        <div
                          key={work.id}
                          onClick={() => onSelectIntervention(work.id)}
                          className="p-1.5 bg-slate-50 hover:bg-purple-50 rounded text-xs cursor-pointer flex items-center justify-between group transition-colors"
                        >
                          <span className="truncate text-slate-800 group-hover:text-purple-900 font-medium">
                            {work.title}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 shrink-0 ml-1">
                            {work.id}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action footer */}
              {currentUser.role !== 'INTENDENTE' && (
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 text-slate-600 hover:text-purple-900 hover:bg-purple-50 rounded transition-colors text-xs flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  {currentUser.role === 'ADMINISTRADOR' && (
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Confirmas eliminar la ${c.name}?`)) {
                          onDeleteCuadrilla(c.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Cuadrilla Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingCuadrilla ? `Editar ${editingCuadrilla.name}` : 'Registrar Nueva Cuadrilla Operativa'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre de la Cuadrilla *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ej: Cuadrilla 07 — Bacheo Rápido"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Capataz / Responsable *</label>
                  <input
                    type="text"
                    value={lead}
                    onChange={(e) => setLead(e.target.value)}
                    required
                    placeholder="Nombre del capataz"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Especialidad *</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value as InterventionCategory)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    {SPECIALTIES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Integrantes del Equipo (separados por coma)
                </label>
                <input
                  type="text"
                  value={membersText}
                  onChange={(e) => setMembersText(e.target.value)}
                  placeholder="Juan Pérez, Carlos Gómez, Mario Soto..."
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vehículo / Maquinaria</label>
                  <input
                    type="text"
                    value={vehicleModel}
                    onChange={(e) => setVehicleModel(e.target.value)}
                    placeholder="Ej: Camión Ford Cargo"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patente</label>
                  <input
                    type="text"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    placeholder="AF-123-ZZ"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estado</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="En campo">En campo</option>
                    <option value="Guardia activa">Guardia activa</option>
                    <option value="Mantenimiento">Mantenimiento</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teléfono de guardia</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
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
                  <span>Guardar Cuadrilla</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
