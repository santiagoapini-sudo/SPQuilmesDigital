import React, { useState } from 'react';
import { 
  Intervention, 
  InterventionCategory, 
  InterventionStatus, 
  PriorityLevel, 
  QuilmesNeighborhood, 
  UserProfile 
} from '../../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCheck, 
  AlertCircle,
  FileSpreadsheet,
  Layers,
  ChevronRight
} from 'lucide-react';

interface InterventionsListProps {
  interventions: Intervention[];
  onSelectIntervention: (id: string) => void;
  onEditIntervention: (intervention: Intervention) => void;
  onDeleteIntervention: (id: string) => void;
  onOpenNewModal: () => void;
  currentUser: UserProfile;
}

export const InterventionsList: React.FC<InterventionsListProps> = ({
  interventions,
  onSelectIntervention,
  onEditIntervention,
  onDeleteIntervention,
  onOpenNewModal,
  currentUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filtered = interventions.filter(item => {
    // Search
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      item.id.toLowerCase().includes(term) ||
      item.title.toLowerCase().includes(term) ||
      item.address.toLowerCase().includes(term) ||
      item.neighborhood.toLowerCase().includes(term) ||
      (item.cuadrillaName && item.cuadrillaName.toLowerCase().includes(term));

    if (!matchesSearch) return false;
    if (selectedStatus !== 'all' && item.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
    if (selectedNeighborhood !== 'all' && item.neighborhood !== selectedNeighborhood) return false;

    return true;
  });

  const getPriorityStyle = (p: PriorityLevel) => {
    switch (p) {
      case 'Crítica':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Alta':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Media':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Baja':
        return 'text-slate-700 bg-slate-100 border-slate-200';
    }
  };

  const getStatusStyle = (s: InterventionStatus) => {
    if (s === 'Verificada y cerrada') {
      return 'text-emerald-800 bg-emerald-50 border-emerald-200';
    }
    if (s === 'Finalizada, pendiente de verificación') {
      return 'text-purple-800 bg-purple-50 border-purple-200';
    }
    if (s === 'En ejecución') {
      return 'text-cyan-800 bg-cyan-50 border-cyan-200';
    }
    if (s === 'Pendiente de materiales' || s === 'Suspendida') {
      return 'text-rose-800 bg-rose-50 border-rose-200';
    }
    return 'text-slate-700 bg-slate-100 border-slate-200';
  };

  return (
    <div className="space-y-4">
      
      {/* Top Action Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Registro de Obras
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">Intervenciones Operativas</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight mt-1">
              Catálogo de Intervenciones Municipales
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tabla
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`px-3 py-1.5 rounded-md transition-colors ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tarjetas
              </button>
            </div>

            {currentUser.role !== 'INTENDENTE' && (
              <button
                onClick={onOpenNewModal}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-900 hover:bg-purple-950 rounded-lg shadow-xs transition-colors shrink-0"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-300" />
                <span>Nueva intervención</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
          
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por código, calle, barrio o cuadrilla..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600 placeholder:text-slate-400"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-purple-600 font-medium"
            >
              <option value="all">Todos los estados</option>
              <option value="Registrada">Registrada</option>
              <option value="Pendiente de evaluación">Pendiente de evaluación</option>
              <option value="Programada">Programada</option>
              <option value="Asignada">Asignada</option>
              <option value="En ejecución">En ejecución</option>
              <option value="Pendiente de materiales">Pendiente de materiales</option>
              <option value="Finalizada, pendiente de verificación">Finalizada (a verificar)</option>
              <option value="Verificada y cerrada">Verificada y cerrada</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-purple-600 font-medium"
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

          {/* Priority Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-purple-600 font-medium"
            >
              <option value="all">Todas las prioridades</option>
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </select>
          </div>

          {/* Neighborhood Filter */}
          <div>
            <select
              value={selectedNeighborhood}
              onChange={(e) => setSelectedNeighborhood(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-purple-600 font-medium"
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

        </div>

        {/* Counter of results */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
          <span>Mostrando <strong className="font-mono text-slate-800">{filtered.length}</strong> de {interventions.length} intervenciones registradas</span>
          {(searchTerm || selectedStatus !== 'all' || selectedCategory !== 'all' || selectedPriority !== 'all' || selectedNeighborhood !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedStatus('all');
                setSelectedCategory('all');
                setSelectedPriority('all');
                setSelectedNeighborhood('all');
              }}
              className="text-purple-800 hover:underline font-semibold"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Main View: Table Mode */}
      {viewMode === 'table' ? (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No se encontraron intervenciones con los filtros seleccionados.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <th className="py-3 px-3.5">ID / Fecha</th>
                    <th className="py-3 px-3.5">Obra / Ubicación</th>
                    <th className="py-3 px-3.5">Categoría</th>
                    <th className="py-3 px-3.5">Prioridad</th>
                    <th className="py-3 px-3.5">Cuadrilla Asignada</th>
                    <th className="py-3 px-3.5">Estado</th>
                    <th className="py-3 px-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                      onClick={() => onSelectIntervention(item.id)}
                    >
                      {/* ID and Date */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className="font-mono font-bold text-purple-950 text-xs">
                          {item.id}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(item.registrationDate).toLocaleDateString('es-AR')}
                        </div>
                      </td>

                      {/* Title & Address */}
                      <td className="py-3 px-3.5 max-w-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{item.address} · {item.neighborhood}</span>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3.5 whitespace-nowrap text-slate-700 font-medium">
                        {item.category}
                      </td>

                      {/* Priority */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded border ${getPriorityStyle(item.priority)}`}>
                          {item.priority}
                        </span>
                      </td>

                      {/* Cuadrilla */}
                      <td className="py-3 px-3.5 text-slate-700 max-w-[180px] truncate">
                        {item.cuadrillaName ? (
                          <span className="font-medium text-slate-800">{item.cuadrillaName}</span>
                        ) : (
                          <span className="text-slate-400 italic">Sin asignar</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className={`inline-block px-2 py-0.5 text-[10px] font-semibold rounded border ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td 
                        className="py-3 px-3.5 text-right whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectIntervention(item.id)}
                            className="p-1.5 text-slate-600 hover:text-purple-900 hover:bg-purple-50 rounded transition-colors"
                            title="Ver detalles e historial"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {currentUser.role !== 'INTENDENTE' && (
                            <button
                              onClick={() => onEditIntervention(item)}
                              className="p-1.5 text-slate-600 hover:text-cyan-800 hover:bg-cyan-50 rounded transition-colors"
                              title="Editar intervención"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {currentUser.role === 'ADMINISTRADOR' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Confirmas la eliminación de la intervención ${item.id}?`)) {
                                  onDeleteIntervention(item.id);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded transition-colors"
                              title="Eliminar intervención (solo Administrador)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Cards Mode */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectIntervention(item.id)}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-mono font-bold text-purple-950 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                    {item.id}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${getPriorityStyle(item.priority)}`}>
                    {item.priority}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                  {item.description}
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.address} ({item.neighborhood})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Prog: {item.scheduledDate || 'Sin programar'}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${getStatusStyle(item.status)}`}>
                  {item.status}
                </span>

                <span className="text-xs font-semibold text-purple-900 flex items-center gap-1">
                  Ver detalle <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
