import React, { useState } from 'react';
import { HeavyResource, Cuadrilla, UserProfile } from '../../types';
import { 
  Truck, 
  Wrench, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Calendar, 
  Layers, 
  ShieldCheck,
  Edit2,
  X,
  Save
} from 'lucide-react';

interface RecursosManagerProps {
  resources: HeavyResource[];
  cuadrillas: Cuadrilla[];
  onSaveResource: (res: HeavyResource) => void;
  currentUser: UserProfile;
}

export const RecursosManager: React.FC<RecursosManagerProps> = ({
  resources,
  cuadrillas,
  onSaveResource,
  currentUser
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingResource, setEditingResource] = useState<HeavyResource | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<any>('Camión Desobstructor');
  const [internalCode, setInternalCode] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [status, setStatus] = useState<any>('Operativo');
  const [assignedCuadrillaId, setAssignedCuadrillaId] = useState('');
  const [responsibleArea, setResponsibleArea] = useState('Dirección General de Vialidad Urbana y Pavimentos');
  const [lastMaintenance, setLastMaintenance] = useState('');
  const [nextMaintenance, setNextMaintenance] = useState('');

  const filtered = resources.filter(r => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    return true;
  });

  const handleOpenCreate = () => {
    setEditingResource(null);
    setName('');
    setType('Camión Desobstructor');
    setInternalCode(`MAQ-0${resources.length + 1}`);
    setLicensePlate('AF-000-QM');
    setStatus('Operativo');
    setAssignedCuadrillaId('');
    setResponsibleArea('Dirección General de Vialidad Urbana y Pavimentos');
    setLastMaintenance(new Date().toISOString().split('T')[0]);
    setNextMaintenance('2026-12-01');
    setModalOpen(true);
  };

  const handleOpenEdit = (r: HeavyResource) => {
    setEditingResource(r);
    setName(r.name);
    setType(r.type);
    setInternalCode(r.internalCode);
    setLicensePlate(r.licensePlate);
    setStatus(r.status);
    setAssignedCuadrillaId(r.assignedCuadrillaId || '');
    setResponsibleArea(r.responsibleArea);
    setLastMaintenance(r.lastMaintenance);
    setNextMaintenance(r.nextMaintenance);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const resData: HeavyResource = {
      id: editingResource?.id || `REC-0${resources.length + 1}`,
      name,
      type,
      internalCode,
      licensePlate,
      status,
      assignedCuadrillaId: assignedCuadrillaId || undefined,
      responsibleArea,
      lastMaintenance,
      nextMaintenance
    };
    onSaveResource(resData);
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
                Parque Automotor y Maquinaria Pesada
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">Equipamiento Municipal</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Inventario de Flota y Maquinaria Pesada
            </h1>
          </div>

          {currentUser.role !== 'INTENDENTE' && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-cyan-300" />
              <span>Registrar Unidad</span>
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">Todos los tipos de equipo</option>
              <option value="Camión Desobstructor">Camión Desobstructor</option>
              <option value="Termotanque de Asfalto">Termotanque de Asfalto</option>
              <option value="Motoniveladora">Motoniveladora</option>
              <option value="Retroexcavadora">Retroexcavadora</option>
              <option value="Rodillo Compactador">Rodillo Compactador</option>
              <option value="Fumigadora ULV Móvil">Fumigadora ULV Móvil</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium"
            >
              <option value="all">Todos los estados</option>
              <option value="Operativo">Operativo</option>
              <option value="En servicio">En servicio</option>
              <option value="En mantenimiento">En mantenimiento</option>
              <option value="Fuera de servicio">Fuera de servicio</option>
            </select>
          </div>

          <span className="text-slate-400 ml-auto font-mono text-[11px]">
            {filtered.length} unidades activas
          </span>
        </div>
      </div>

      {/* Resource Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => {
          const assignedCuad = cuadrillas.find(c => c.id === r.assignedCuadrillaId);

          return (
            <div
              key={r.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                    {r.internalCode}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    r.status === 'En servicio' ? 'bg-cyan-100 text-cyan-800' :
                    r.status === 'Operativo' ? 'bg-emerald-100 text-emerald-800' :
                    r.status === 'En mantenimiento' ? 'bg-amber-100 text-amber-800' :
                    'bg-rose-100 text-rose-800'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">
                  {r.name}
                </h3>

                <div className="text-xs text-slate-500 mt-0.5">
                  Tipo: <strong className="text-slate-700">{r.type}</strong> · Patente: <span className="font-mono">{r.licensePlate}</span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Área Destino:</span>
                    <span className="font-medium text-slate-800 truncate max-w-[170px] text-right">
                      {r.responsibleArea.replace('Dirección General de ', 'Dir. ')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Cuadrilla Asignada:</span>
                    <span className="font-semibold text-purple-900">
                      {assignedCuad ? assignedCuad.name.split('—')[0] : 'Parque libre'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Último Service:</span>
                    <span className="font-mono text-slate-700">{r.lastMaintenance}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Próximo Service:</span>
                    <span className="font-mono font-bold text-slate-800">{r.nextMaintenance}</span>
                  </div>
                </div>
              </div>

              {currentUser.role !== 'INTENDENTE' && (
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => handleOpenEdit(r)}
                    className="p-1.5 text-slate-600 hover:text-purple-900 hover:bg-purple-50 rounded transition-colors text-xs flex items-center gap-1"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Actualizar Estado</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit/Create Resource Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingResource ? `Editar ${editingResource.name}` : 'Registrar Nueva Unidad al Parque'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nombre o Modelo del Equipo *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ej: Camión Desobstructor Hidrocinético 03"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Maquinaria</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Camión Desobstructor">Camión Desobstructor</option>
                    <option value="Termotanque de Asfalto">Termotanque de Asfalto</option>
                    <option value="Motoniveladora">Motoniveladora</option>
                    <option value="Retroexcavadora">Retroexcavadora</option>
                    <option value="Rodillo Compactador">Rodillo Compactador</option>
                    <option value="Fumigadora ULV Móvil">Fumigadora ULV Móvil</option>
                    <option value="Camión Volcador">Camión Volcador</option>
                    <option value="Hidroelevador">Hidroelevador</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Código Interno</label>
                  <input
                    type="text"
                    value={internalCode}
                    onChange={(e) => setInternalCode(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patente / Dominio</label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estado de Operatividad</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="Operativo">Operativo</option>
                    <option value="En servicio">En servicio</option>
                    <option value="En mantenimiento">En mantenimiento</option>
                    <option value="Fuera de servicio">Fuera de servicio</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cuadrilla Asignada</label>
                <select
                  value={assignedCuadrillaId}
                  onChange={(e) => setAssignedCuadrillaId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                >
                  <option value="">-- Sin cuadrilla fija (Parque libre) --</option>
                  {cuadrillas.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Último Mantenimiento</label>
                  <input
                    type="date"
                    value={lastMaintenance}
                    onChange={(e) => setLastMaintenance(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Próximo Service</label>
                  <input
                    type="date"
                    value={nextMaintenance}
                    onChange={(e) => setNextMaintenance(e.target.value)}
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
                  <span>Guardar Unidad</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
