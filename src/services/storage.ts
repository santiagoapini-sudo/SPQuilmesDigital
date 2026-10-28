import { 
  Intervention, 
  Cuadrilla, 
  HeavyResource, 
  PreventiveInspection, 
  UserProfile, 
  UserRole,
  AuditRecord 
} from '../types';
import { 
  INITIAL_INTERVENTIONS, 
  INITIAL_CUADRILLAS, 
  INITIAL_RESOURCES, 
  INITIAL_PREVENTIVE, 
  INITIAL_USERS 
} from '../data/seedData';

const STORAGE_KEYS = {
  INTERVENTIONS: 'quilmes360_interventions',
  CUADRILLAS: 'quilmes360_cuadrillas',
  RESOURCES: 'quilmes360_resources',
  PREVENTIVE: 'quilmes360_preventive',
  CURRENT_USER: 'quilmes360_current_user',
  AUDIT: 'quilmes360_audit_log',
  LAST_UPDATED: 'quilmes360_last_updated'
};

type StorageListener = () => void;
const listeners: Set<StorageListener> = new Set();

export const subscribeToStorage = (listener: StorageListener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const notifyListeners = () => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());
  } catch (e) {
    console.warn('LocalStorage error', e);
  }
  listeners.forEach(cb => cb());
};

// Safe JSON parser
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (err) {
    console.error(`Error reading ${key}`, err);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error saving ${key}`, err);
  }
}

// Initialize default data if not present
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.INTERVENTIONS)) {
    safeSet(STORAGE_KEYS.INTERVENTIONS, INITIAL_INTERVENTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.CUADRILLAS)) {
    safeSet(STORAGE_KEYS.CUADRILLAS, INITIAL_CUADRILLAS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
    safeSet(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  }
  if (!localStorage.getItem(STORAGE_KEYS.PREVENTIVE)) {
    safeSet(STORAGE_KEYS.PREVENTIVE, INITIAL_PREVENTIVE);
  }
  const storedUser = safeGet<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
  if (!storedUser || !INITIAL_USERS.some(u => u.id === storedUser.id)) {
    safeSet(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]); // Default to Gestión Operativa
  }
  if (!localStorage.getItem(STORAGE_KEYS.AUDIT)) {
    const initialAudits: AuditRecord[] = [
      {
        id: 'AUD-001',
        timestamp: new Date().toISOString(),
        userId: 'USR-ADMIN',
        userName: 'Gestión Operativa',
        userRole: 'ADMINISTRADOR',
        action: 'Inicialización de plataforma',
        details: 'Carga inicial del Plan Quilmes 2027 — Servicios Públicos Quilmes.'
      }
    ];
    safeSet(STORAGE_KEYS.AUDIT, initialAudits);
  }
  if (!localStorage.getItem(STORAGE_KEYS.LAST_UPDATED)) {
    localStorage.setItem(STORAGE_KEYS.LAST_UPDATED, new Date().toISOString());
  }
};

// AUDIT LOG
export const getAuditLog = (): AuditRecord[] => {
  return safeGet<AuditRecord[]>(STORAGE_KEYS.AUDIT, []);
};

export const recordAudit = (action: string, details: string, user: UserProfile) => {
  const audits = getAuditLog();
  const record: AuditRecord = {
    id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action,
    details
  };
  audits.unshift(record);
  safeSet(STORAGE_KEYS.AUDIT, audits.slice(0, 200)); // keep last 200
  notifyListeners();
  return record;
};

// USER PROFILE
export const getCurrentUser = (): UserProfile => {
  return safeGet<UserProfile>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
};

export const setCurrentUser = (user: UserProfile) => {
  safeSet(STORAGE_KEYS.CURRENT_USER, user);
  notifyListeners();
};

export const getAllUsers = (): UserProfile[] => {
  return INITIAL_USERS;
};

// INTERVENTIONS
export const getInterventions = (): Intervention[] => {
  return safeGet<Intervention[]>(STORAGE_KEYS.INTERVENTIONS, INITIAL_INTERVENTIONS);
};

export const getInterventionById = (id: string): Intervention | undefined => {
  const list = getInterventions();
  return list.find(item => item.id === id);
};

export const saveIntervention = (data: Partial<Intervention> & { id?: string }, user: UserProfile): Intervention => {
  const list = getInterventions();
  const now = new Date().toISOString();

  let savedItem: Intervention;

  if (data.id && list.some(item => item.id === data.id)) {
    // Update existing
    const existingIndex = list.findIndex(item => item.id === data.id);
    const existing = list[existingIndex];
    
    // Check if status changed
    const statusChanged = data.status && data.status !== existing.status;

    const auditEntry: AuditRecord = {
      id: `HIS-${Date.now()}`,
      timestamp: now,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: statusChanged ? `Cambio de estado a: ${data.status}` : 'Edición de datos',
      details: data.observations || `Modificación efectuada por ${user.name} (${user.role})`
    };

    savedItem = {
      ...existing,
      ...data,
      history: [auditEntry, ...(existing.history || [])]
    };

    list[existingIndex] = savedItem;
    recordAudit(`Actualización de Intervención ${savedItem.id}`, `Categoría: ${savedItem.category} - Estado: ${savedItem.status}`, user);
  } else {
    // Create new
    const nextNum = list.length + 101;
    const newId = data.id || `INT-2027-0${nextNum}`;
    
    const auditEntry: AuditRecord = {
      id: `HIS-${Date.now()}`,
      timestamp: now,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'Creación de intervención',
      details: `Registrada formalmente en sistema por ${user.name}`
    };

    savedItem = {
      id: newId,
      title: data.title || `${data.category || 'Intervención'} en ${data.address || 'Quilmes'}`,
      registrationDate: now,
      responsibleArea: data.responsibleArea || 'Secretaría de Servicios Públicos',
      category: data.category || 'Bacheo',
      description: data.description || '',
      address: data.address || '',
      neighborhood: data.neighborhood || 'Quilmes Centro',
      coordinates: data.coordinates || { lat: -34.724, lng: -58.254 },
      priority: data.priority || 'Media',
      responsiblePerson: data.responsiblePerson || user.name,
      cuadrillaId: data.cuadrillaId,
      cuadrillaName: data.cuadrillaName,
      scheduledDate: data.scheduledDate,
      estimatedCompletionDate: data.estimatedCompletionDate,
      completionDate: data.completionDate,
      status: data.status || 'Registrada',
      photos: data.photos || { before: [], during: [], after: [] },
      observations: data.observations || '',
      materialsUsed: data.materialsUsed || [],
      equipmentAssigned: data.equipmentAssigned || [],
      verification: data.verification || { verified: false },
      history: [auditEntry]
    };

    list.unshift(savedItem);
    recordAudit(`Nueva Intervención ${savedItem.id}`, `Creada en ${savedItem.neighborhood} (${savedItem.category})`, user);
  }

  safeSet(STORAGE_KEYS.INTERVENTIONS, list);
  notifyListeners();
  return savedItem;
};

// Verification procedure: cannot just change status; MUST record verifiedBy, verifiedByRole, verifiedAt, notes, and certificate
export const verifyIntervention = (
  id: string, 
  verificationData: { 
    verifiedBy: string; 
    verifiedByRole: UserRole; 
    notes: string; 
    certificateNumber?: string 
  }, 
  user: UserProfile
): boolean => {
  const list = getInterventions();
  const index = list.findIndex(item => item.id === id);
  if (index === -1) return false;

  const item = list[index];
  const now = new Date().toISOString();

  const auditEntry: AuditRecord = {
    id: `HIS-VERIF-${Date.now()}`,
    timestamp: now,
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'Verificación técnica oficial aprobada',
    details: `Certificado: ${verificationData.certificateNumber || 'S/N'}. Dictamen: ${verificationData.notes}. Inspeccionado por: ${verificationData.verifiedBy} (${verificationData.verifiedByRole})`
  };

  item.status = 'Verificada y cerrada';
  item.verification = {
    verified: true,
    verifiedBy: verificationData.verifiedBy,
    verifiedByRole: verificationData.verifiedByRole,
    verifiedAt: now,
    notes: verificationData.notes,
    certificateNumber: verificationData.certificateNumber || `CERT-Q-${Date.now().toString().slice(-6)}`
  };
  item.history = [auditEntry, ...(item.history || [])];

  list[index] = item;
  safeSet(STORAGE_KEYS.INTERVENTIONS, list);
  recordAudit(`Verificación oficial de ${item.id}`, `Aprobada por ${verificationData.verifiedBy}`, user);
  notifyListeners();
  return true;
};

// Delete intervention
export const deleteIntervention = (id: string, user: UserProfile): boolean => {
  const list = getInterventions();
  const filtered = list.filter(item => item.id !== id);
  if (filtered.length === list.length) return false;

  safeSet(STORAGE_KEYS.INTERVENTIONS, filtered);
  recordAudit(`Eliminación de Intervención ${id}`, `Eliminada por ${user.name}`, user);
  notifyListeners();
  return true;
};

// CUADRILLAS
export const getCuadrillas = (): Cuadrilla[] => {
  return safeGet<Cuadrilla[]>(STORAGE_KEYS.CUADRILLAS, INITIAL_CUADRILLAS);
};

export const saveCuadrilla = (cuadrilla: Cuadrilla, user: UserProfile) => {
  const list = getCuadrillas();
  const index = list.findIndex(c => c.id === cuadrilla.id);
  if (index >= 0) {
    list[index] = cuadrilla;
    recordAudit(`Edición de Cuadrilla ${cuadrilla.name}`, `Modificada por ${user.name}`, user);
  } else {
    list.push(cuadrilla);
    recordAudit(`Alta de Cuadrilla ${cuadrilla.name}`, `Creada por ${user.name}`, user);
  }
  safeSet(STORAGE_KEYS.CUADRILLAS, list);
  notifyListeners();
};

export const deleteCuadrilla = (id: string, user: UserProfile) => {
  const list = getCuadrillas().filter(c => c.id !== id);
  safeSet(STORAGE_KEYS.CUADRILLAS, list);
  recordAudit(`Baja de Cuadrilla ${id}`, `Eliminada por ${user.name}`, user);
  notifyListeners();
};

// HEAVY RESOURCES
export const getResources = (): HeavyResource[] => {
  return safeGet<HeavyResource[]>(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
};

export const saveResource = (resource: HeavyResource, user: UserProfile) => {
  const list = getResources();
  const index = list.findIndex(r => r.id === resource.id);
  if (index >= 0) {
    list[index] = resource;
  } else {
    list.push(resource);
  }
  safeSet(STORAGE_KEYS.RESOURCES, list);
  recordAudit(`Actualización de Maquinaria ${resource.name}`, `Estado: ${resource.status}`, user);
  notifyListeners();
};

// PREVENTIVE INSPECTIONS
export const getPreventiveInspections = (): PreventiveInspection[] => {
  return safeGet<PreventiveInspection[]>(STORAGE_KEYS.PREVENTIVE, INITIAL_PREVENTIVE);
};

export const savePreventiveInspection = (inspection: PreventiveInspection, user: UserProfile) => {
  const list = getPreventiveInspections();
  const index = list.findIndex(p => p.id === inspection.id);
  if (index >= 0) {
    list[index] = inspection;
  } else {
    list.push(inspection);
  }
  safeSet(STORAGE_KEYS.PREVENTIVE, list);
  recordAudit(`Mantenimiento Preventivo: ${inspection.title}`, `Próxima fecha: ${inspection.nextScheduledDate}`, user);
  notifyListeners();
};

export const toggleChecklistItem = (inspectionId: string, itemIndex: number, user: UserProfile) => {
  const list = getPreventiveInspections();
  const inspection = list.find(p => p.id === inspectionId);
  if (!inspection || !inspection.checklist[itemIndex]) return;

  inspection.checklist[itemIndex].checked = !inspection.checklist[itemIndex].checked;
  safeSet(STORAGE_KEYS.PREVENTIVE, list);
  recordAudit(`Checklist preventivo ${inspection.id}`, `Ítem ${itemIndex + 1} actualizado por ${user.name}`, user);
  notifyListeners();
};

// LAST UPDATED
export const getLastUpdated = (): string => {
  return localStorage.getItem(STORAGE_KEYS.LAST_UPDATED) || new Date().toISOString();
};

// RESET & BACKUP EXPORTS
export const resetToSeedData = (user: UserProfile) => {
  safeSet(STORAGE_KEYS.INTERVENTIONS, INITIAL_INTERVENTIONS);
  safeSet(STORAGE_KEYS.CUADRILLAS, INITIAL_CUADRILLAS);
  safeSet(STORAGE_KEYS.RESOURCES, INITIAL_RESOURCES);
  safeSet(STORAGE_KEYS.PREVENTIVE, INITIAL_PREVENTIVE);
  recordAudit('Restablecimiento de datos', 'Se restauraron los datos iniciales de prueba Plan 2027', user);
  notifyListeners();
};

export const exportDataJSON = (): string => {
  const data = {
    exportDate: new Date().toISOString(),
    system: 'QUILMES 360 - Secretaría de Servicios Públicos',
    plan: 'Plan 2027',
    interventions: getInterventions(),
    cuadrillas: getCuadrillas(),
    resources: getResources(),
    preventive: getPreventiveInspections(),
    audit: getAuditLog()
  };
  return JSON.stringify(data, null, 2);
};

export const importDataJSON = (jsonString: string, user: UserProfile): boolean => {
  try {
    const parsed = JSON.parse(jsonString);
    if (parsed.interventions && Array.isArray(parsed.interventions)) {
      safeSet(STORAGE_KEYS.INTERVENTIONS, parsed.interventions);
    }
    if (parsed.cuadrillas && Array.isArray(parsed.cuadrillas)) {
      safeSet(STORAGE_KEYS.CUADRILLAS, parsed.cuadrillas);
    }
    if (parsed.resources && Array.isArray(parsed.resources)) {
      safeSet(STORAGE_KEYS.RESOURCES, parsed.resources);
    }
    if (parsed.preventive && Array.isArray(parsed.preventive)) {
      safeSet(STORAGE_KEYS.PREVENTIVE, parsed.preventive);
    }
    recordAudit('Restauración de copia de seguridad', 'Importación de archivo JSON efectuada con éxito', user);
    notifyListeners();
    return true;
  } catch (e) {
    console.error('Error importing JSON', e);
    return false;
  }
};
