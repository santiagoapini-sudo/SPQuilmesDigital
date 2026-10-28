import React, { useState, useEffect } from 'react';
import { 
  Intervention, 
  Cuadrilla, 
  HeavyResource, 
  PreventiveInspection, 
  UserProfile, 
  AuditRecord, 
  InterventionStatus 
} from './types';
import { 
  initializeStorage, 
  subscribeToStorage, 
  getInterventions, 
  getCuadrillas, 
  getResources, 
  getPreventiveInspections, 
  getCurrentUser, 
  getAuditLog, 
  getLastUpdated, 
  saveIntervention, 
  verifyIntervention, 
  deleteIntervention, 
  saveCuadrilla, 
  deleteCuadrilla, 
  saveResource, 
  savePreventiveInspection, 
  toggleChecklistItem 
} from './services/storage';

import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ExecutiveDashboard } from './components/dashboard/ExecutiveDashboard';
import { OperativeMap } from './components/map/OperativeMap';
import { InterventionsList } from './components/interventions/InterventionsList';
import { InterventionModal } from './components/interventions/InterventionModal';
import { InterventionDetailModal } from './components/interventions/InterventionDetailModal';
import { WorkAgenda } from './components/agenda/WorkAgenda';
import { CuadrillasManager } from './components/cuadrillas/CuadrillasManager';
import { RecursosManager } from './components/recursos/RecursosManager';
import { PreventiveMaintenance } from './components/preventivo/PreventiveMaintenance';
import { IntendenteCockpit } from './components/intendente/IntendenteCockpit';
import { ReportsGenerator } from './components/informes/ReportsGenerator';
import { ConfigAndArchitecture } from './components/configuracion/ConfigAndArchitecture';

export default function App() {
  // Initialize storage on first load
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentUser, setCurrentUserState] = useState<UserProfile>(getCurrentUser());
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [cuadrillas, setCuadrillas] = useState<Cuadrilla[]>([]);
  const [resources, setResources] = useState<HeavyResource[]>([]);
  const [preventive, setPreventive] = useState<PreventiveInspection[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());

  // UI state
  const [activeSection, setActiveSection] = useState<string>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modals state
  const [selectedInterventionId, setSelectedInterventionId] = useState<string | null>(null);
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [mapCoordHint, setMapCoordHint] = useState<{ lat: number; lng: number } | null>(null);

  // Sync state from storage
  const syncData = () => {
    setCurrentUserState(getCurrentUser());
    setInterventions(getInterventions());
    setCuadrillas(getCuadrillas());
    setResources(getResources());
    setPreventive(getPreventiveInspections());
    setAuditLogs(getAuditLog());
    setLastUpdated(getLastUpdated());
  };

  useEffect(() => {
    initializeStorage();
    syncData();
    setIsInitialized(true);

    const unsubscribe = subscribeToStorage(() => {
      syncData();
    });

    return () => unsubscribe();
  }, []);

  // Compute counts for navigation badges
  const pendingCount = interventions.filter(i => 
    i.status === 'Registrada' || i.status === 'Pendiente de evaluación' || i.status === 'Priorizada'
  ).length;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueInspections = preventive.filter(p => p.nextScheduledDate < todayStr).length;

  // Selected item detail
  const currentSelectedIntervention = interventions.find(i => i.id === selectedInterventionId) || null;

  // Handlers
  const handleOpenNewModal = (coords?: { lat: number; lng: number }) => {
    setEditingIntervention(null);
    setMapCoordHint(coords || null);
    setNewModalOpen(true);
  };

  const handleEditIntervention = (item: Intervention) => {
    setEditingIntervention(item);
    setMapCoordHint(null);
    setNewModalOpen(true);
  };

  const handleSaveIntervention = (data: Partial<Intervention>) => {
    saveIntervention(data, currentUser);
  };

  const handleVerifyIntervention = (id: string, notes: string, certNumber?: string) => {
    verifyIntervention(id, {
      verifiedBy: currentUser.name,
      verifiedByRole: currentUser.role,
      notes,
      certificateNumber: certNumber
    }, currentUser);
  };

  const handleUpdateStatus = (id: string, newStatus: InterventionStatus, notes?: string) => {
    saveIntervention({ id, status: newStatus, observations: notes }, currentUser);
  };

  const handleDeleteIntervention = (id: string) => {
    deleteIntervention(id, currentUser);
    if (selectedInterventionId === id) {
      setSelectedInterventionId(null);
    }
  };

  const handleReschedule = (id: string, newDate: string, delayReason?: string) => {
    saveIntervention({ id, scheduledDate: newDate, delayReason }, currentUser);
  };

  const handleSaveCuadrilla = (c: Cuadrilla) => {
    saveCuadrilla(c, currentUser);
  };

  const handleDeleteCuadrilla = (id: string) => {
    deleteCuadrilla(id, currentUser);
  };

  const handleSaveResource = (r: HeavyResource) => {
    saveResource(r, currentUser);
  };

  const handleSavePreventive = (p: PreventiveInspection) => {
    savePreventiveInspection(p, currentUser);
  };

  const handleToggleChecklistItem = (id: string, index: number) => {
    toggleChecklistItem(id, index, currentUser);
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center text-xs text-slate-500 font-mono">
        Cargando QUILMES 360...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        currentUser={currentUser}
        activeSection={activeSection}
        onOpenNewModal={() => handleOpenNewModal()}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onNavigate={setActiveSection}
      />

      <div className="flex-1 flex w-full">
        
        {/* Left Sidebar - Displayed on all modules, collapsible/hidden on desktop during mapa mode for full-viewport GIS */}
        {activeSection !== 'mapa' ? (
          <Sidebar
            activeSection={activeSection}
            onNavigate={setActiveSection}
            currentUser={currentUser}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            counts={{
              interventionsTotal: interventions.length,
              pendingCount,
              overdueInspections
            }}
          />
        ) : (
          mobileMenuOpen && (
            <Sidebar
              activeSection={activeSection}
              onNavigate={setActiveSection}
              currentUser={currentUser}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
              counts={{
                interventionsTotal: interventions.length,
                pendingCount,
                overdueInspections
              }}
            />
          )
        )}

        {/* Content Area */}
        {activeSection === 'mapa' ? (
          <div className="flex-1 h-[calc(100vh-4rem)] flex flex-col min-w-0 bg-slate-100 w-full">
            <OperativeMap
              interventions={interventions}
              onSelectIntervention={setSelectedInterventionId}
              onOpenNewModalWithCoords={(lat, lng) => handleOpenNewModal({ lat, lng })}
            />
          </div>
        ) : (
          <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-w-0 w-full">
          
          {/* Module 1: Panel Ejecutivo */}
          {activeSection === 'dashboard' && (
            <ExecutiveDashboard
              interventions={interventions}
              lastUpdated={lastUpdated}
              onSelectIntervention={setSelectedInterventionId}
              onNavigate={setActiveSection}
              onOpenNewModal={() => handleOpenNewModal()}
              currentUser={currentUser}
            />
          )}

          {/* Module 2: Mapa Operativo */}
          {activeSection === 'mapa' && (
            <OperativeMap
              interventions={interventions}
              onSelectIntervention={setSelectedInterventionId}
              onOpenNewModalWithCoords={(lat, lng) => handleOpenNewModal({ lat, lng })}
            />
          )}

          {/* Module 3: Intervenciones */}
          {activeSection === 'intervenciones' && (
            <InterventionsList
              interventions={interventions}
              onSelectIntervention={setSelectedInterventionId}
              onEditIntervention={handleEditIntervention}
              onDeleteIntervention={handleDeleteIntervention}
              onOpenNewModal={() => handleOpenNewModal()}
              currentUser={currentUser}
            />
          )}

          {/* Module 4: Agenda de Trabajos */}
          {activeSection === 'agenda' && (
            <WorkAgenda
              interventions={interventions}
              cuadrillas={cuadrillas}
              onSelectIntervention={setSelectedInterventionId}
              onReschedule={handleReschedule}
              currentUser={currentUser}
            />
          )}

          {/* Module 5: Cuadrillas */}
          {activeSection === 'cuadrillas' && (
            <CuadrillasManager
              cuadrillas={cuadrillas}
              interventions={interventions}
              onSaveCuadrilla={handleSaveCuadrilla}
              onDeleteCuadrilla={handleDeleteCuadrilla}
              onSelectIntervention={setSelectedInterventionId}
              currentUser={currentUser}
            />
          )}

          {/* Module 6: Recursos y Maquinaria */}
          {activeSection === 'recursos' && (
            <RecursosManager
              resources={resources}
              cuadrillas={cuadrillas}
              onSaveResource={handleSaveResource}
              currentUser={currentUser}
            />
          )}

          {/* Module 7: Mantenimiento Preventivo */}
          {activeSection === 'preventivo' && (
            <PreventiveMaintenance
              inspections={preventive}
              onSaveInspection={handleSavePreventive}
              onToggleChecklistItem={handleToggleChecklistItem}
              currentUser={currentUser}
            />
          )}

          {/* Module 8: Tablero para el Intendente */}
          {activeSection === 'intendente' && (
            <IntendenteCockpit
              interventions={interventions}
              currentUser={currentUser}
              lastUpdated={lastUpdated}
            />
          )}

          {/* Module 9: Informes y Estadísticas */}
          {activeSection === 'informes' && (
            <ReportsGenerator
              interventions={interventions}
              cuadrillas={cuadrillas}
              currentUser={currentUser}
            />
          )}

          {/* Module 10: Usuarios y Configuración */}
          {activeSection === 'configuracion' && (
            <ConfigAndArchitecture
              currentUser={currentUser}
              auditLogs={auditLogs}
            />
          )}
        </main>
        )}
      </div>

      {/* Global Modals */}

      {/* New / Edit Intervention Modal */}
      <InterventionModal
        isOpen={newModalOpen}
        onClose={() => setNewModalOpen(false)}
        onSave={handleSaveIntervention}
        initialData={editingIntervention}
        cuadrillas={cuadrillas}
        currentUser={currentUser}
        initialCoords={mapCoordHint}
      />

      {/* Intervention Detail & Verification Modal */}
      <InterventionDetailModal
        intervention={currentSelectedIntervention}
        isOpen={!!selectedInterventionId}
        onClose={() => setSelectedInterventionId(null)}
        onVerify={handleVerifyIntervention}
        onUpdateStatus={handleUpdateStatus}
        onEdit={(item) => {
          setSelectedInterventionId(null);
          handleEditIntervention(item);
        }}
        currentUser={currentUser}
      />

    </div>
  );
}
