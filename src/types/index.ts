export type UserRole = 
  | 'ADMINISTRADOR'
  | 'LECTOR'
  | 'INTENDENTE';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  area: string;
  avatarUrl?: string;
}

export type InterventionCategory = 
  | 'Bacheo'
  | 'Reparación de calzadas'
  | 'Mantenimiento vial'
  | 'Sumideros y bocas de tormenta'
  | 'Drenajes pluviales'
  | 'Plazas y espacios públicos'
  | 'Mobiliario urbano'
  | 'Saneamiento'
  | 'Fumigación'
  | 'Inspección preventiva'
  | 'Otros trabajos autorizados';

export type PriorityLevel = 'Crítica' | 'Alta' | 'Media' | 'Baja';

export type InterventionStatus = 
  | 'Registrada'
  | 'Pendiente de evaluación'
  | 'Priorizada'
  | 'Programada'
  | 'Asignada'
  | 'En ejecución'
  | 'Pendiente de materiales'
  | 'Suspendida'
  | 'Finalizada, pendiente de verificación'
  | 'Verificada y cerrada';

export type QuilmesNeighborhood = 
  | 'Quilmes Centro'
  | 'Quilmes Oeste'
  | 'Quilmes Este / Ribera'
  | 'Bernal Este'
  | 'Bernal Oeste'
  | 'Don Bosco'
  | 'Ezpeleta Este'
  | 'Ezpeleta Oeste'
  | 'San Francisco Solano'
  | 'Villa La Florida';

export interface AuditRecord {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
}

export interface VerificationInfo {
  verified: boolean;
  verifiedBy?: string;
  verifiedByRole?: UserRole;
  verifiedAt?: string;
  notes?: string;
  certificateNumber?: string;
}

export interface Intervention {
  id: string; // e.g. INT-2027-0104
  title: string;
  registrationDate: string; // ISO string
  responsibleArea: string; // Dirección General de Vialidad / Dirección de Hidráulica y Pluviales / Dirección de Espacios Públicos y Plazas / Dirección de Saneamiento
  category: InterventionCategory;
  description: string;
  address: string;
  neighborhood: QuilmesNeighborhood;
  coordinates: {
    lat: number;
    lng: number;
  };
  priority: PriorityLevel;
  responsiblePerson: string;
  cuadrillaId?: string;
  cuadrillaName?: string;
  scheduledDate?: string;
  estimatedCompletionDate?: string;
  completionDate?: string;
  status: InterventionStatus;
  photos: {
    before?: string[];
    during?: string[];
    after?: string[];
  };
  observations: string;
  delayReason?: string;
  verification: VerificationInfo;
  history: AuditRecord[];
  materialsUsed?: string[];
  equipmentAssigned?: string[];
}

export interface Cuadrilla {
  id: string;
  name: string;
  lead: string;
  specialty: InterventionCategory;
  membersCount: number;
  membersNames: string[];
  vehiclePlate?: string;
  vehicleModel?: string;
  status: 'Disponible' | 'En campo' | 'Mantenimiento' | 'Guardia activa';
  currentInterventionId?: string;
  zoneAssigned?: QuilmesNeighborhood;
  phone: string;
}

export interface HeavyResource {
  id: string;
  name: string;
  type: 'Camión Desobstructor' | 'Motoniveladora' | 'Retroexcavadora' | 'Rodillo Compactador' | 'Termotanque de Asfalto' | 'Hidroelevador' | 'Camión Volcador' | 'Fumigadora ULV Móvil';
  internalCode: string;
  licensePlate: string;
  status: 'Operativo' | 'En servicio' | 'En mantenimiento' | 'Fuera de servicio';
  assignedCuadrillaId?: string;
  responsibleArea: string;
  lastMaintenance: string;
  nextMaintenance: string;
}

export interface PreventiveInspection {
  id: string; // PREV-2027-001
  title: string;
  targetType: 'Sumideros y bocas de tormenta' | 'Drenajes pluviales' | 'Calles y losas de hormigón' | 'Plazas y juegos infantiles' | 'Mobiliario urbano';
  neighborhood: QuilmesNeighborhood;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  frequency: 'Semanal' | 'Quincenal' | 'Mensual' | 'Bimestral' | 'Trimestral';
  responsibleInspector: string;
  responsibleArea: string;
  nextScheduledDate: string;
  lastCompletedDate?: string;
  status: 'Al día' | 'Próxima' | 'Vencida';
  checklist: {
    item: string;
    checked: boolean;
  }[];
  notes?: string;
}
