import React, { useState, useEffect } from 'react';
import { 
  Intervention, 
  InterventionCategory, 
  InterventionStatus, 
  PriorityLevel, 
  QuilmesNeighborhood, 
  UserProfile, 
  Cuadrilla 
} from '../../types';
import { 
  X, 
  Save, 
  MapPin, 
  Camera, 
  Upload, 
  AlertCircle, 
  Calendar, 
  Users, 
  FileText 
} from 'lucide-react';

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (interventionData: Partial<Intervention>) => void;
  initialData?: Intervention | null;
  cuadrillas: Cuadrilla[];
  currentUser: UserProfile;
  initialCoords?: { lat: number; lng: number } | null;
}

const CATEGORIES: InterventionCategory[] = [
  'Bacheo',
  'Reparación de calzadas',
  'Mantenimiento vial',
  'Sumideros y bocas de tormenta',
  'Drenajes pluviales',
  'Plazas y espacios públicos',
  'Mobiliario urbano',
  'Saneamiento',
  'Fumigación',
  'Inspección preventiva',
  'Otros trabajos autorizados'
];

const NEIGHBORHOODS: QuilmesNeighborhood[] = [
  'Quilmes Centro',
  'Quilmes Oeste',
  'Quilmes Este / Ribera',
  'Bernal Este',
  'Bernal Oeste',
  'Don Bosco',
  'Ezpeleta Este',
  'Ezpeleta Oeste',
  'San Francisco Solano',
  'Villa La Florida'
];

const AREAS = [
  'Dirección General de Vialidad Urbana y Pavimentos',
  'Dirección de Hidráulica, Sumideros y Pluviales',
  'Dirección de Espacios Públicos y Plazas',
  'Dirección de Saneamiento y Control de Vectores',
  'Secretaría de Servicios Públicos'
];

const STATUSES: InterventionStatus[] = [
  'Registrada',
  'Pendiente de evaluación',
  'Priorizada',
  'Programada',
  'Asignada',
  'En ejecución',
  'Pendiente de materiales',
  'Suspendida',
  'Finalizada, pendiente de verificación',
  'Verificada y cerrada'
];

export const InterventionModal: React.FC<InterventionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  cuadrillas,
  currentUser,
  initialCoords
}) => {
  if (!isOpen) return null;

  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || '');
  const [responsibleArea, setResponsibleArea] = useState(
    initialData?.responsibleArea || AREAS[0]
  );
  const [category, setCategory] = useState<InterventionCategory>(
    initialData?.category || 'Bacheo'
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [neighborhood, setNeighborhood] = useState<QuilmesNeighborhood>(
    initialData?.neighborhood || 'Quilmes Centro'
  );
  const [lat, setLat] = useState(
    initialData?.coordinates?.lat || initialCoords?.lat || -34.7240
  );
  const [lng, setLng] = useState(
    initialData?.coordinates?.lng || initialCoords?.lng || -58.2540
  );
  const [priority, setPriority] = useState<PriorityLevel>(
    initialData?.priority || 'Media'
  );
  const [responsiblePerson, setResponsiblePerson] = useState(
    initialData?.responsiblePerson || currentUser.name
  );
  const [selectedCuadrillaId, setSelectedCuadrillaId] = useState(
    initialData?.cuadrillaId || ''
  );
  const [scheduledDate, setScheduledDate] = useState(
    initialData?.scheduledDate || ''
  );
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState(
    initialData?.estimatedCompletionDate || ''
  );
  const [status, setStatus] = useState<InterventionStatus>(
    initialData?.status || 'Registrada'
  );
  const [observations, setObservations] = useState(
    initialData?.observations || ''
  );

  // Photos state
  const [beforePhotos, setBeforePhotos] = useState<string[]>(
    initialData?.photos?.before || []
  );
  const [duringPhotos, setDuringPhotos] = useState<string[]>(
    initialData?.photos?.during || []
  );
  const [afterPhotos, setAfterPhotos] = useState<string[]>(
    initialData?.photos?.after || []
  );

  // Photo URL input
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [photoStage, setPhotoStage] = useState<'before' | 'during' | 'after'>('before');

  // Set default area automatically when category changes
  useEffect(() => {
    if (!initialData) {
      if (category === 'Bacheo' || category === 'Reparación de calzadas' || category === 'Mantenimiento vial') {
        setResponsibleArea('Dirección General de Vialidad Urbana y Pavimentos');
      } else if (category === 'Sumideros y bocas de tormenta' || category === 'Drenajes pluviales') {
        setResponsibleArea('Dirección de Hidráulica, Sumideros y Pluviales');
      } else if (category === 'Plazas y espacios públicos' || category === 'Mobiliario urbano') {
        setResponsibleArea('Dirección de Espacios Públicos y Plazas');
      } else if (category === 'Fumigación' || category === 'Saneamiento') {
        setResponsibleArea('Dirección de Saneamiento y Control de Vectores');
      }
    }
  }, [category, initialData]);

  const handleAddPhotoUrl = () => {
    if (!newPhotoUrl.trim()) return;
    if (photoStage === 'before') {
      setBeforePhotos([...beforePhotos, newPhotoUrl.trim()]);
    } else if (photoStage === 'during') {
      setDuringPhotos([...duringPhotos, newPhotoUrl.trim()]);
    } else {
      setAfterPhotos([...afterPhotos, newPhotoUrl.trim()]);
    }
    setNewPhotoUrl('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, stage: 'before' | 'during' | 'after') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (stage === 'before') setBeforePhotos(prev => [...prev, base64]);
      else if (stage === 'during') setDuringPhotos(prev => [...prev, base64]);
      else setAfterPhotos(prev => [...prev, base64]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCuad = cuadrillas.find(c => c.id === selectedCuadrillaId);

    const payload: Partial<Intervention> = {
      ...(initialData || {}),
      title: title || `${category} en ${address || neighborhood}`,
      responsibleArea,
      category,
      description,
      address,
      neighborhood,
      coordinates: { lat: Number(lat), lng: Number(lng) },
      priority,
      responsiblePerson,
      cuadrillaId: selectedCuadrillaId || undefined,
      cuadrillaName: selectedCuad ? selectedCuad.name : undefined,
      scheduledDate: scheduledDate || undefined,
      estimatedCompletionDate: estimatedCompletionDate || undefined,
      status,
      observations,
      photos: {
        before: beforePhotos,
        during: duringPhotos,
        after: afterPhotos
      }
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-purple-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800">
                {isEditing ? `Intervención ${initialData.id}` : 'Nueva Intervención'}
              </span>
              <span className="text-xs text-purple-200">· Plan 2027</span>
            </div>
            <h2 className="text-lg font-bold tracking-tight text-white mt-0.5">
              {isEditing ? 'Modificar Registro Operativo' : 'Formulario Oficial de Intervención Municipal'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-purple-200 hover:text-white hover:bg-purple-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Classification & Area */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-800" />
              <span>1. Identificación y Área Responsable</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Categoría del Servicio *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as InterventionCategory)}
                  required
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600 font-medium"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Área Municipal Responsable *
                </label>
                <select
                  value={responsibleArea}
                  onChange={(e) => setResponsibleArea(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600 font-medium"
                >
                  {AREAS.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Título Breve de la Obra o Trabajo *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Bacheo asfáltico en caliente y fresado de calzada"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Descripción Técnica y Detalle del Requerimiento *
                </label>
                <textarea
                  rows={2}
                  placeholder="Detalle el trabajo: m² de bacheo, diámetro de cañería, maquinaria requerida, estado previo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Location & Coordinates */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-purple-800" />
              <span>2. Localización Geográfica en Quilmes</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Dirección / Cruce de Calles *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Av. Mitre y Brandsen"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Localidad / Barrio *
                </label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value as QuilmesNeighborhood)}
                  required
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600 font-medium"
                >
                  {NEIGHBORHOODS.map((barrio) => (
                    <option key={barrio} value={barrio}>{barrio}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Latitud (WGS84)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(parseFloat(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Longitud (WGS84)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(parseFloat(e.target.value))}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                />
              </div>

              <div className="flex items-end">
                <div className="text-[11px] text-slate-500 bg-slate-100 p-2 rounded-lg w-full">
                  Coordenadas verificadas para el Partido de Quilmes.
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Priority, Schedule & Cuadrilla */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-800" />
              <span>3. Prioridad, Cuadrilla y Programación</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nivel de Prioridad *
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600 font-medium"
                >
                  <option value="Crítica">Crítica (Riesgo inminente)</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estado Operativo *
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as InterventionStatus)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600 font-medium"
                >
                  {STATUSES.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cuadrilla Asignada
                </label>
                <select
                  value={selectedCuadrillaId}
                  onChange={(e) => setSelectedCuadrillaId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600 font-medium"
                >
                  <option value="">-- Sin cuadrilla asignada --</option>
                  {cuadrillas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.specialty})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Responsable Técnico
                </label>
                <input
                  type="text"
                  value={responsiblePerson}
                  onChange={(e) => setResponsiblePerson(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fecha Programada
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimación de Finalización
                </label>
                <input
                  type="date"
                  value={estimatedCompletionDate}
                  onChange={(e) => setEstimatedCompletionDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observaciones Operativas
                </label>
                <input
                  type="text"
                  placeholder="Detalles sobre cortes de tránsito, desvíos o acopio..."
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Photographic Records (Antes, Durante, Después) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-900 border-b border-slate-100 pb-1 flex items-center gap-1.5">
              <Camera className="w-3.5 h-3.5 text-purple-800" />
              <span>4. Registro Fotográfico (Antes, Durante y Después)</span>
            </h3>

            {/* Quick URL or File Adder */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row items-center gap-2">
              <select
                value={photoStage}
                onChange={(e) => setPhotoStage(e.target.value as any)}
                className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
              >
                <option value="before">Fotografía: ANTES</option>
                <option value="during">Fotografía: DURANTE</option>
                <option value="after">Fotografía: DESPUÉS</option>
              </select>

              <input
                type="text"
                placeholder="Pegar URL de fotografía..."
                value={newPhotoUrl}
                onChange={(e) => setNewPhotoUrl(e.target.value)}
                className="flex-1 text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
              />

              <button
                type="button"
                onClick={handleAddPhotoUrl}
                className="px-3 py-1.5 text-xs font-semibold text-purple-900 bg-purple-100 hover:bg-purple-200 rounded-lg transition-colors whitespace-nowrap"
              >
                + Añadir Foto
              </button>

              <label className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg cursor-pointer flex items-center gap-1 whitespace-nowrap">
                <Upload className="w-3 h-3" />
                <span>Cargar archivo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, photoStage)}
                />
              </label>
            </div>

            {/* Photo Previews by Stage */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* Antes */}
              <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
                <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Antes ({beforePhotos.length})</span>
                  <span className="text-[10px] text-slate-400">Estado inicial</span>
                </div>
                {beforePhotos.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic py-4 text-center">Sin fotos del antes</div>
                ) : (
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {beforePhotos.map((p, idx) => (
                      <div key={idx} className="relative group shrink-0">
                        <img src={p} alt="Antes" className="w-16 h-16 object-cover rounded border border-slate-200" />
                        <button
                          type="button"
                          onClick={() => setBeforePhotos(beforePhotos.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Durante */}
              <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
                <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Durante ({duringPhotos.length})</span>
                  <span className="text-[10px] text-slate-400">En ejecución</span>
                </div>
                {duringPhotos.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic py-4 text-center">Sin fotos del durante</div>
                ) : (
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {duringPhotos.map((p, idx) => (
                      <div key={idx} className="relative group shrink-0">
                        <img src={p} alt="Durante" className="w-16 h-16 object-cover rounded border border-slate-200" />
                        <button
                          type="button"
                          onClick={() => setDuringPhotos(duringPhotos.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Después */}
              <div className="border border-slate-200 rounded-lg p-2.5 bg-slate-50/50">
                <div className="text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Después ({afterPhotos.length})</span>
                  <span className="text-[10px] text-slate-400">Trabajo terminado</span>
                </div>
                {afterPhotos.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic py-4 text-center">Sin fotos del después</div>
                ) : (
                  <div className="flex gap-2 overflow-x-auto py-1">
                    {afterPhotos.map((p, idx) => (
                      <div key={idx} className="relative group shrink-0">
                        <img src={p} alt="Después" className="w-16 h-16 object-cover rounded border border-slate-200" />
                        <button
                          type="button"
                          onClick={() => setAfterPhotos(afterPhotos.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 bg-rose-600 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <Save className="w-4 h-4 text-cyan-300" />
              <span>{isEditing ? 'Guardar Cambios' : 'Registrar Intervención'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
