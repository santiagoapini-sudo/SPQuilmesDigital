import React, { useState } from 'react';
import { 
  Intervention, 
  UserProfile, 
  InterventionStatus 
} from '../../types';
import { 
  X, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  History, 
  Camera, 
  Wrench, 
  Printer, 
  CheckCheck,
  Truck,
  Layers,
  Edit3
} from 'lucide-react';

interface InterventionDetailModalProps {
  intervention: Intervention | null;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (id: string, notes: string, certificateNumber?: string) => void;
  onUpdateStatus: (id: string, newStatus: InterventionStatus, notes?: string) => void;
  onEdit: (intervention: Intervention) => void;
  currentUser: UserProfile;
}

export const InterventionDetailModal: React.FC<InterventionDetailModalProps> = ({
  intervention,
  isOpen,
  onClose,
  onVerify,
  onUpdateStatus,
  onEdit,
  currentUser
}) => {
  if (!isOpen || !intervention) return null;

  const [activeTab, setActiveTab] = useState<'info' | 'photos' | 'history' | 'verify'>('info');
  const [verificationNotes, setVerificationNotes] = useState('');
  const [certNumber, setCertNumber] = useState(`CERT-Q-${Date.now().toString().slice(-5)}`);
  const [quickStatusNotes, setQuickStatusNotes] = useState('');

  // Check if current user is authorized to perform technical verification
  const canVerify = currentUser.role === 'SUPERVISOR' || currentUser.role === 'DIRECTOR' || currentUser.role === 'ADMINISTRADOR';

  const handleVerificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationNotes.trim()) {
      alert('Por favor ingrese las observaciones del dictamen técnico.');
      return;
    }
    onVerify(intervention.id, verificationNotes, certNumber);
    setActiveTab('info');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-800">
                {intervention.id}
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-300">
                {intervention.neighborhood}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-1 line-clamp-1">
              {intervention.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Imprimir ficha técnica"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 px-6 bg-slate-50 text-xs font-medium gap-6 shrink-0">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'info'
                ? 'border-purple-900 text-purple-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Ficha General</span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`py-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'photos'
                ? 'border-purple-900 text-purple-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Registro Fotográfico</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'border-purple-900 text-purple-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial y Auditoría ({intervention.history?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('verify')}
            className={`py-3 border-b-2 font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'verify'
                ? 'border-purple-900 text-purple-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verificación Oficial</span>
            {intervention.verification?.verified && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* TAB 1: INFO GENERAL */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              
              {/* Status Header Badge Bar */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-semibold text-slate-500">Estado de la intervención</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm font-bold text-slate-900">{intervention.status}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      intervention.priority === 'Crítica' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      Prioridad {intervention.priority}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {currentUser.role !== 'INTENDENTE' && (
                    <button
                      onClick={() => onEdit(intervention)}
                      className="px-3 py-1.5 text-xs font-semibold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Editar Ficha</span>
                    </button>
                  )}

                  {/* Fast Status Progression Buttons based on current state */}
                  {intervention.status === 'Registrada' && (
                    <button
                      onClick={() => onUpdateStatus(intervention.id, 'Programada', 'Avanzado desde ficha rápida')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                    >
                      Programar Obra
                    </button>
                  )}

                  {intervention.status === 'Programada' && (
                    <button
                      onClick={() => onUpdateStatus(intervention.id, 'En ejecución', 'Comienzo de tareas en vía pública')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-cyan-700 hover:bg-cyan-800 rounded-lg transition-colors"
                    >
                      Iniciar en Campo
                    </button>
                  )}

                  {intervention.status === 'En ejecución' && (
                    <button
                      onClick={() => onUpdateStatus(intervention.id, 'Finalizada, pendiente de verificación', 'Obra finalizada por la cuadrilla')}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-800 hover:bg-purple-900 rounded-lg transition-colors"
                    >
                      Reportar Finalizada
                    </button>
                  )}
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-purple-900 border-b border-slate-100 pb-1.5">
                    Detalles Operativos
                  </h4>
                  
                  <div>
                    <span className="text-slate-400 block text-[10px]">Área Responsable</span>
                    <span className="font-semibold text-slate-800">{intervention.responsibleArea}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Categoría</span>
                    <span className="font-semibold text-slate-800">{intervention.category}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Ubicación y Barrio</span>
                    <span className="font-semibold text-slate-800">{intervention.address}</span>
                    <span className="text-slate-500 block text-[11px]">{intervention.neighborhood}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Georreferenciación</span>
                    <span className="font-mono text-slate-700">
                      Lat: {intervention.coordinates.lat} · Lng: {intervention.coordinates.lng}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 bg-white border border-slate-200 rounded-xl p-4">
                  <h4 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-purple-900 border-b border-slate-100 pb-1.5">
                    Recursos y Cronograma
                  </h4>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Cuadrilla Asignada</span>
                    <span className="font-semibold text-slate-800">
                      {intervention.cuadrillaName || 'Pendiente de asignación'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[10px]">Responsable Técnico</span>
                    <span className="font-semibold text-slate-800">{intervention.responsiblePerson}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fecha Programada</span>
                      <span className="font-semibold text-slate-800">{intervention.scheduledDate || 'S/D'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Fecha Finalización</span>
                      <span className="font-semibold text-slate-800">
                        {intervention.completionDate ? new Date(intervention.completionDate).toLocaleDateString('es-AR') : 'En curso'}
                      </span>
                    </div>
                  </div>

                  {intervention.delayReason && (
                    <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px]">
                      <strong>Motivo de demora:</strong> {intervention.delayReason}
                    </div>
                  )}
                </div>

              </div>

              {/* Description & Technical Observations */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                <div>
                  <h4 className="font-bold text-slate-900 text-xs mb-1">Descripción de la Tarea</h4>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {intervention.description}
                  </p>
                </div>

                {intervention.observations && (
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs mb-1">Observaciones en Campo</h4>
                    <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      "{intervention.observations}"
                    </p>
                  </div>
                )}

                {/* Materials & Equipment Tags */}
                {(intervention.materialsUsed?.length || intervention.equipmentAssigned?.length) ? (
                  <div className="pt-2 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
                    {intervention.materialsUsed && intervention.materialsUsed.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Materiales e Insumos</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {intervention.materialsUsed.map((m, i) => (
                            <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]">
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {intervention.equipmentAssigned && intervention.equipmentAssigned.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Equipos y Vehículos</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {intervention.equipmentAssigned.map((e, i) => (
                            <span key={i} className="px-2 py-0.5 bg-purple-50 text-purple-900 rounded text-[11px] font-medium border border-purple-200">
                              {e}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>

            </div>
          )}

          {/* TAB 2: PHOTOGRAPHS */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Evidencia Fotográfica de la Intervención
                  </h3>
                  <p className="text-xs text-slate-500">
                    Registro de etapas antes, durante la obra y resultado final verificado
                  </p>
                </div>
              </div>

              {/* Photos comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Antes */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                    <span className="text-xs font-bold text-slate-800">1. Antes del Inicio</span>
                    <span className="text-[10px] text-slate-500">{intervention.photos.before?.length || 0} fotos</span>
                  </div>
                  {(!intervention.photos.before || intervention.photos.before.length === 0) ? (
                    <div className="h-44 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                      Sin fotografía registrada
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {intervention.photos.before.map((url, i) => (
                        <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 group">
                          <img 
                            src={url} 
                            alt={`Antes ${i + 1}`} 
                            className="w-full h-44 object-cover group-hover:scale-102 transition-transform" 
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-slate-900/60 p-1 text-[10px] text-white text-center">
                            Estado previo al plan
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Durante */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                    <span className="text-xs font-bold text-slate-800">2. En Ejecución</span>
                    <span className="text-[10px] text-slate-500">{intervention.photos.during?.length || 0} fotos</span>
                  </div>
                  {(!intervention.photos.during || intervention.photos.during.length === 0) ? (
                    <div className="h-44 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                      Sin fotografía registrada
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {intervention.photos.during.map((url, i) => (
                        <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 group">
                          <img 
                            src={url} 
                            alt={`Durante ${i + 1}`} 
                            className="w-full h-44 object-cover group-hover:scale-102 transition-transform" 
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-cyan-900/60 p-1 text-[10px] text-white text-center">
                            Trabajo de cuadrilla en campo
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Después */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-3">
                    <span className="text-xs font-bold text-slate-800">3. Trabajo Finalizado</span>
                    <span className="text-[10px] text-slate-500">{intervention.photos.after?.length || 0} fotos</span>
                  </div>
                  {(!intervention.photos.after || intervention.photos.after.length === 0) ? (
                    <div className="h-44 border border-dashed border-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                      Sin fotografía registrada
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {intervention.photos.after.map((url, i) => (
                        <div key={i} className="relative rounded-lg overflow-hidden border border-slate-200 group">
                          <img 
                            src={url} 
                            alt={`Después ${i + 1}`} 
                            className="w-full h-44 object-cover group-hover:scale-102 transition-transform" 
                          />
                          <div className="absolute bottom-0 inset-x-0 bg-emerald-900/60 p-1 text-[10px] text-white text-center">
                            Obra completada
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: AUDIT & MODIFICATION HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Trazabilidad e Historial de Modificaciones
                </h3>
                <p className="text-xs text-slate-500">
                  Registro inalterable de auditoría: usuario, acción realizada y fecha/hora
                </p>
              </div>

              <div className="relative border-l-2 border-purple-200 ml-4 space-y-4 py-2">
                {intervention.history?.map((record) => (
                  <div key={record.id} className="relative pl-6 group">
                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-purple-800"></div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs">
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <span className="font-bold text-slate-900">{record.action}</span>
                        <span className="font-mono text-[10px] text-slate-400">
                          {new Date(record.timestamp).toLocaleString('es-AR')}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        {record.details}
                      </div>
                      <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1.5 pt-1 border-t border-slate-100">
                        <span className="font-semibold text-slate-700">{record.userName}</span>
                        <span>·</span>
                        <span className="text-purple-900 font-medium">{record.userRole}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: OFFICIAL VERIFICATION */}
          {activeTab === 'verify' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Protocolo Oficial de Verificación y Cierre
                </h3>
                <p className="text-xs text-slate-500">
                  Conforme a los estándares de la Secretaría de Servicios Públicos, una intervención NO se considera finalizada por mero cambio de estado; debe registrarse dictamen técnico formal.
                </p>
              </div>

              {intervention.verification?.verified ? (
                /* Already verified certificate view */
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5 text-xs text-emerald-950 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCheck className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-sm font-bold text-emerald-900">
                      Intervención Oficialmente Verificada y Cerrada
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-emerald-200">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">N° Certificado</span>
                      <span className="font-mono font-bold text-emerald-950 text-xs">
                        {intervention.verification.certificateNumber || 'CERT-VIAL-2027'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">Inspector Verificador</span>
                      <span className="font-semibold text-emerald-950">
                        {intervention.verification.verifiedBy} ({intervention.verification.verifiedByRole})
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 block">Fecha y Hora</span>
                      <span className="font-mono text-emerald-950">
                        {intervention.verification.verifiedAt ? new Date(intervention.verification.verifiedAt).toLocaleString('es-AR') : 'S/D'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-700 block">Dictamen Técnico</span>
                    <p className="mt-1 bg-white/80 p-2.5 rounded border border-emerald-200 text-slate-800">
                      "{intervention.verification.notes}"
                    </p>
                  </div>
                </div>
              ) : (
                /* Verification Form for Supervisors / Directors */
                <form onSubmit={handleVerificationSubmit} className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <ShieldCheck className="w-4 h-4 text-purple-800" />
                    <span>Acta de Conformidad y Cierre de Intervención</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Inspector que Certifica
                      </label>
                      <input
                        type="text"
                        disabled
                        value={`${currentUser.name} (${currentUser.role})`}
                        className="w-full text-xs px-3 py-2 bg-slate-200 border border-slate-300 rounded-lg text-slate-700 font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        N° de Acta / Certificado Municipal
                      </label>
                      <input
                        type="text"
                        value={certNumber}
                        onChange={(e) => setCertNumber(e.target.value)}
                        required
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Dictamen Técnico de la Verificación In Situ *
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describa el resultado de la inspección: calzada nivelada, conducto desobstruido a caudal libre, pintura uniforme, etc."
                      value={verificationNotes}
                      onChange={(e) => setVerificationNotes(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600"
                    />
                  </div>

                  {canVerify ? (
                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCheck className="w-4 h-4" />
                        <span>Aprobar Verificación y Cerrar Registro</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-700" />
                      <span>
                        Solo usuarios con rol <strong>SUPERVISOR</strong>, <strong>DIRECTOR</strong> o <strong>ADMINISTRADOR</strong> poseen facultades para emitir certificados de verificación. Cambia el rol en la barra superior para probar esta función.
                      </span>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs shrink-0">
          <span className="text-slate-500 font-medium">
            Secretaría de Servicios Públicos · Municipalidad de Quilmes
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
