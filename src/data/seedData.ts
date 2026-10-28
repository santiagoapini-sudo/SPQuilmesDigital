import { 
  Intervention, 
  Cuadrilla, 
  HeavyResource, 
  PreventiveInspection, 
  UserProfile 
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'USR-ADMIN',
    name: 'Gestión Operativa',
    email: 'gestion@quilmes.gov.ar',
    role: 'ADMINISTRADOR',
    area: 'Secretaría de Servicios Públicos',
  },
  {
    id: 'USR-LECTOR',
    name: 'Modo Lectura',
    email: 'consulta@quilmes.gov.ar',
    role: 'LECTOR',
    area: 'Supervisión Institucional (Solo Consulta)',
  }
];

export const INITIAL_CUADRILLAS: Cuadrilla[] = [
  {
    id: 'CUAD-01',
    name: 'Cuadrilla 01 — Desobstrucción Pluvial Norte',
    lead: 'Héctor Cardozo',
    specialty: 'Sumideros y bocas de tormenta',
    membersCount: 4,
    membersNames: ['Héctor Cardozo', 'Rubén Paz', 'Cristian Domínguez', 'Esteban Ríos'],
    vehiclePlate: 'AF-302-QM',
    vehicleModel: 'Camión Desobstructor Hidrocinético Ford Cargo',
    status: 'En campo',
    zoneAssigned: 'Bernal Este',
    phone: '11-4253-9801'
  },
  {
    id: 'CUAD-02',
    name: 'Cuadrilla 02 — Desobstrucción Pluvial Sur y Oeste',
    lead: 'Jorge Almirón',
    specialty: 'Drenajes pluviales',
    membersCount: 5,
    membersNames: ['Jorge Almirón', 'Diego Morales', 'Ariel Gómez', 'Walter Solís', 'Facundo Blanco'],
    vehiclePlate: 'AE-899-QL',
    vehicleModel: 'Camión Hidrojet Mercedes-Benz Atego',
    status: 'En campo',
    zoneAssigned: 'San Francisco Solano',
    phone: '11-4253-9802'
  },
  {
    id: 'CUAD-03',
    name: 'Cuadrilla 03 — Bacheo Asfáltico en Caliente',
    lead: 'Martín Romero',
    specialty: 'Bacheo',
    membersCount: 6,
    membersNames: ['Martín Romero', 'Sergio Maidana', 'Hugo Cabrera', 'Pablo Navarro', 'Leandro Ferreyra', 'Gustavo Ortiz'],
    vehiclePlate: 'AD-441-BA',
    vehicleModel: 'Camión con Termotanque Asfáltico y Minipala',
    status: 'En campo',
    zoneAssigned: 'Quilmes Oeste',
    phone: '11-4253-9803'
  },
  {
    id: 'CUAD-04',
    name: 'Cuadrilla 04 — Hormigonado y Calzadas de Avenidas',
    lead: 'Enrique Báez',
    specialty: 'Reparación de calzadas',
    membersCount: 7,
    membersNames: ['Enrique Báez', 'Ramón Duarte', 'Matías Silva', 'Claudio Díaz', 'Daniel Ojeda', 'Mariano Luna', 'Rodrigo Vega'],
    vehiclePlate: 'AF-712-KZ',
    vehicleModel: 'Camión Mixer Hormigonero y Volcador',
    status: 'Disponible',
    zoneAssigned: 'Ezpeleta Este',
    phone: '11-4253-9804'
  },
  {
    id: 'CUAD-05',
    name: 'Cuadrilla 05 — Mantenimiento Integral de Plazas',
    lead: 'Silvia Godoy',
    specialty: 'Plazas y espacios públicos',
    membersCount: 5,
    membersNames: ['Silvia Godoy', 'Carla Pereyra', 'Norberto Ruiz', 'Gonzalo Godoy', 'Tamara Méndez'],
    vehiclePlate: 'AC-503-PQ',
    vehicleModel: 'Furgón Utilitario Iveco Daily',
    status: 'En campo',
    zoneAssigned: 'Quilmes Centro',
    phone: '11-4253-9805'
  },
  {
    id: 'CUAD-06',
    name: 'Cuadrilla 06 — Saneamiento y Fumigación Preventiva',
    lead: 'Andrés Villalba',
    specialty: 'Fumigación',
    membersCount: 4,
    membersNames: ['Andrés Villalba', 'Marcos Giménez', 'Nicolás Leguizamón', 'Federico Prado'],
    vehiclePlate: 'AF-114-QM',
    vehicleModel: 'Pickup Hilux 4x4 con Termonebulizador ULV',
    status: 'Disponible',
    zoneAssigned: 'Villa La Florida',
    phone: '11-4253-9806'
  }
];

export const INITIAL_RESOURCES: HeavyResource[] = [
  {
    id: 'REC-01',
    name: 'Desobstructor Pluvial Hidrocinético 01',
    type: 'Camión Desobstructor',
    internalCode: 'DES-01',
    licensePlate: 'AF-302-QM',
    status: 'En servicio',
    assignedCuadrillaId: 'CUAD-01',
    responsibleArea: 'Dirección de Hidráulica, Sumideros y Pluviales',
    lastMaintenance: '2026-09-12',
    nextMaintenance: '2026-11-12'
  },
  {
    id: 'REC-02',
    name: 'Camión Hidrojet Desobstructor 02',
    type: 'Camión Desobstructor',
    internalCode: 'DES-02',
    licensePlate: 'AE-899-QL',
    status: 'En servicio',
    assignedCuadrillaId: 'CUAD-02',
    responsibleArea: 'Dirección de Hidráulica, Sumideros y Pluviales',
    lastMaintenance: '2026-08-20',
    nextMaintenance: '2026-10-25'
  },
  {
    id: 'REC-03',
    name: 'Termotanque Bacheador de Asfalto en Caliente',
    type: 'Termotanque de Asfalto',
    internalCode: 'TER-03',
    licensePlate: 'AD-441-BA',
    status: 'En servicio',
    assignedCuadrillaId: 'CUAD-03',
    responsibleArea: 'Dirección General de Vialidad Urbana y Pavimentos',
    lastMaintenance: '2026-09-01',
    nextMaintenance: '2026-12-01'
  },
  {
    id: 'REC-04',
    name: 'Motoniveladora Caterpillar 140M',
    type: 'Motoniveladora',
    internalCode: 'MOT-01',
    licensePlate: 'MUN-Q-018',
    status: 'Operativo',
    responsibleArea: 'Dirección General de Vialidad Urbana y Pavimentos',
    lastMaintenance: '2026-07-15',
    nextMaintenance: '2026-10-30'
  },
  {
    id: 'REC-05',
    name: 'Rodillo Compactador Tandem Vibratorio',
    type: 'Rodillo Compactador',
    internalCode: 'ROD-02',
    licensePlate: 'MUN-Q-022',
    status: 'En servicio',
    assignedCuadrillaId: 'CUAD-03',
    responsibleArea: 'Dirección General de Vialidad Urbana y Pavimentos',
    lastMaintenance: '2026-08-10',
    nextMaintenance: '2026-11-10'
  },
  {
    id: 'REC-06',
    name: 'Retroexcavadora Oruga Hidráulica New Holland',
    type: 'Retroexcavadora',
    internalCode: 'RET-01',
    licensePlate: 'MUN-Q-031',
    status: 'Operativo',
    responsibleArea: 'Dirección de Hidráulica, Sumideros y Pluviales',
    lastMaintenance: '2026-09-18',
    nextMaintenance: '2026-12-18'
  },
  {
    id: 'REC-07',
    name: 'Camión con Termonebulizador ULV Pesado',
    type: 'Fumigadora ULV Móvil',
    internalCode: 'FUM-01',
    licensePlate: 'AF-114-QM',
    status: 'Operativo',
    assignedCuadrillaId: 'CUAD-06',
    responsibleArea: 'Dirección de Saneamiento y Control de Vectores',
    lastMaintenance: '2026-09-25',
    nextMaintenance: '2026-11-25'
  }
];

export const INITIAL_PREVENTIVE: PreventiveInspection[] = [
  {
    id: 'PREV-2027-001',
    title: 'Relevamiento y Limpieza de Sumideros Troncales de Av. Calchaquí',
    targetType: 'Sumideros y bocas de tormenta',
    neighborhood: 'Quilmes Oeste',
    location: 'Av. Calchaquí e/ Av. 12 de Octubre y Av. Zapiola',
    coordinates: { lat: -34.7312, lng: -58.2915 },
    frequency: 'Semanal',
    responsibleInspector: 'Lucas Quiroga',
    responsibleArea: 'Dirección de Hidráulica, Sumideros y Pluviales',
    nextScheduledDate: '2026-10-20',
    lastCompletedDate: '2026-10-13',
    status: 'Al día',
    checklist: [
      { item: 'Comprobación de rejillas de captación superficial', checked: true },
      { item: 'Medición de sedimentos acumulados en cámara decantadora', checked: true },
      { item: 'Verificación del conducto de enlace al nexo principal', checked: true },
      { item: 'Limpieza con tobera de alta presión efectuada', checked: true }
    ],
    notes: 'Flujo correcto. Sin acumulación de sedimentos tras la última precipitación.'
  },
  {
    id: 'PREV-2027-002',
    title: 'Inspección Preventiva de Drenajes en Bajo Vías de San Martín',
    targetType: 'Drenajes pluviales',
    neighborhood: 'Bernal Este',
    location: 'Paso Bajo Vías San Martín y Ramal La Plata',
    coordinates: { lat: -34.7088, lng: -58.2789 },
    frequency: 'Quincenal',
    responsibleInspector: 'Lucas Quiroga',
    responsibleArea: 'Dirección de Hidráulica, Sumideros y Pluviales',
    nextScheduledDate: '2026-10-18',
    lastCompletedDate: '2026-10-04',
    status: 'Próxima',
    checklist: [
      { item: 'Prueba de bombas de achique automáticas', checked: true },
      { item: 'Estado de rejas de contención de sólidos gruesos', checked: true },
      { item: 'Inspección de tablero eléctrico y grupo electrógeno auxiliar', checked: false },
      { item: 'Comprobación de sensores de nivel hidrométrico', checked: false }
    ],
    notes: 'Programar para el fin de semana revisión de sensor de nivel con técnicos electromecánicos.'
  },
  {
    id: 'PREV-2027-003',
    title: 'Control Estructural de Pavimentos de Hormigón en Corredor Av. Mitre',
    targetType: 'Calles y losas de hormigón',
    neighborhood: 'Ezpeleta Este',
    location: 'Av. Mitre desde Florencio Varela hasta Hernández',
    coordinates: { lat: -34.7482, lng: -58.2435 },
    frequency: 'Mensual',
    responsibleInspector: 'Ing. Marcelo Varela',
    responsibleArea: 'Dirección General de Vialidad Urbana y Pavimentos',
    nextScheduledDate: '2026-10-14',
    lastCompletedDate: '2026-09-14',
    status: 'Vencida',
    checklist: [
      { item: 'Sellado de juntas de dilatación térmica', checked: false },
      { item: 'Detección de escalonamiento de losas de calzada', checked: false },
      { item: 'Medición de fisuras longitudinales críticas', checked: false },
      { item: 'Determinación de paños a demoler y repavimentar', checked: false }
    ],
    notes: '¡Alerta de vencimiento! Se requiere movilizar equipo de inspección de calzada.'
  },
  {
    id: 'PREV-2027-004',
    title: 'Mantenimiento Preventivo de Mobiliario y Juegos en Plaza Conesa',
    targetType: 'Plazas y juegos infantiles',
    neighborhood: 'Quilmes Centro',
    location: 'Conesa, Moreno, Lavalle y Colón',
    coordinates: { lat: -34.7215, lng: -58.2575 },
    frequency: 'Quincenal',
    responsibleInspector: 'Silvia Godoy',
    responsibleArea: 'Dirección de Espacios Públicos y Plazas',
    nextScheduledDate: '2026-10-22',
    lastCompletedDate: '2026-10-08',
    status: 'Al día',
    checklist: [
      { item: 'Revisión de anclajes de hamacas y trepadores', checked: true },
      { item: 'Pintura y tratamiento anticorrosivo de bancos metálicos', checked: true },
      { item: 'Inspección de tapas de cámaras de alumbrado', checked: true },
      { item: 'Estado de solado de caucho amortiguante', checked: true }
    ],
    notes: 'Juegos en excelente condición. Reposición de dos tablones de madera en banco central.'
  }
];

export const INITIAL_INTERVENTIONS: Intervention[] = [
  {
    id: 'INT-2027-0101',
    title: 'Bacheo asfáltico en caliente y fresado de calzada en Av. Mitre',
    registrationDate: '2026-10-10T08:30:00Z',
    responsibleArea: 'Dirección General de Vialidad Urbana y Pavimentos',
    category: 'Bacheo',
    description: 'Demolición de paño asfáltico deformado con baches profundos generados por tránsito pesado. Fresado de base, colocación de emulsión asfáltica y carpeta en caliente de 7 cm compactada con rodillo.',
    address: 'Av. Mitre y Brandsen',
    neighborhood: 'Quilmes Centro',
    coordinates: { lat: -34.7238, lng: -58.2541 },
    priority: 'Crítica',
    responsiblePerson: 'Ing. Marcelo Varela',
    cuadrillaId: 'CUAD-03',
    cuadrillaName: 'Cuadrilla 03 — Bacheo Asfáltico en Caliente',
    scheduledDate: '2026-10-12',
    estimatedCompletionDate: '2026-10-13',
    completionDate: '2026-10-13T17:00:00Z',
    status: 'Verificada y cerrada',
    photos: {
      before: [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
      ],
      during: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80'
      ],
      after: [
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80'
      ]
    },
    observations: 'Trabajo ejecutado en horario diurno con reducción de calzada en coordinación con Tránsito Quilmes. Compactación al 98% de densidad requerida.',
    materialsUsed: ['Asfalto en caliente CAC 10 (14 Tn)', 'Emulsión catiónica de rotura rápida (350 L)', 'Piedra granítica partida 6-19'],
    equipmentAssigned: ['Termotanque asfáltico AD-441-BA', 'Rodillo compactador tándem ROD-02', 'Fresadora de pavimento Wirtgen'],
    verification: {
      verified: true,
      verifiedBy: 'Lucas Quiroga',
      verifiedByRole: 'SUPERVISOR',
      verifiedAt: '2026-10-14T11:20:00Z',
      notes: 'Superficie lisa y alineada a cota de desagüe de cuneta. Certificado de calidad conforme.',
      certificateNumber: 'CERT-VIAL-2026-0891'
    },
    history: [
      {
        id: 'HIS-01',
        timestamp: '2026-10-10T08:30:00Z',
        userId: 'USR-04',
        userName: 'Ing. Marcelo Varela',
        userRole: 'DIRECTOR',
        action: 'Creación de intervención',
        details: 'Registro inicial por reporte de deterioro avanzado en Av. Mitre.'
      },
      {
        id: 'HIS-02',
        timestamp: '2026-10-10T14:00:00Z',
        userId: 'USR-04',
        userName: 'Ing. Marcelo Varela',
        userRole: 'DIRECTOR',
        action: 'Asignación y programación',
        details: 'Asignada a Cuadrilla 03 para el 12 de octubre.'
      },
      {
        id: 'HIS-03',
        timestamp: '2026-10-13T17:15:00Z',
        userId: 'USR-07',
        userName: 'Martín Romero',
        userRole: 'OPERADOR',
        action: 'Finalización de obra en campo',
        details: 'Carga de fotografías del después y solicitud de verificación técnica.'
      },
      {
        id: 'HIS-04',
        timestamp: '2026-10-14T11:20:00Z',
        userId: 'USR-06',
        userName: 'Lucas Quiroga',
        userRole: 'SUPERVISOR',
        action: 'Verificación y cierre oficial',
        details: 'Inspección técnica in situ completada. Estado cambiado a Verificada y cerrada.'
      }
    ]
  },
  {
    id: 'INT-2027-0102',
    title: 'Desobstrucción hidrocinética de 8 sumideros en nexo pluvial Bernal',
    registrationDate: '2026-10-12T09:15:00Z',
    responsibleArea: 'Dirección de Hidráulica, Sumideros y Pluviales',
    category: 'Sumideros y bocas de tormenta',
    description: 'Limpieza mecánica y aspiración de lodos con camión desobstructor en sumideros y cañería nexo de 600 mm para evitar anegamientos en cruce céntrico de Bernal.',
    address: 'Av. San Martín y Zapiola',
    neighborhood: 'Bernal Este',
    coordinates: { lat: -34.7075, lng: -58.2810 },
    priority: 'Alta',
    responsiblePerson: 'Dra. Patricia Benítez',
    cuadrillaId: 'CUAD-01',
    cuadrillaName: 'Cuadrilla 01 — Desobstrucción Pluvial Norte',
    scheduledDate: '2026-10-14',
    status: 'Finalizada, pendiente de verificación',
    photos: {
      before: [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'
      ],
      during: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
      ],
      after: []
    },
    observations: 'Se extrajeron 3 m³ de residuos áridos y ramas acumuladas. Conducto liberado al 100% de sección hidráulica.',
    materialsUsed: ['Agua a presión 180 bar', 'Cámara de inspección nueva prefabricada'],
    equipmentAssigned: ['Camión Desobstructor AF-302-QM'],
    verification: {
      verified: false
    },
    history: [
      {
        id: 'HIS-05',
        timestamp: '2026-10-12T09:15:00Z',
        userId: 'USR-05',
        userName: 'Dra. Patricia Benítez',
        userRole: 'DIRECTOR',
        action: 'Creación de intervención',
        details: 'Ingreso al plan operativo preventivo por alerta meteorológica.'
      },
      {
        id: 'HIS-06',
        timestamp: '2026-10-14T16:45:00Z',
        userId: 'USR-06',
        userName: 'Lucas Quiroga',
        userRole: 'SUPERVISOR',
        action: 'Pase a pendiente de verificación',
        details: 'Cuadrilla 01 reporta finalización de tareas de bombeo y lavado.'
      }
    ]
  },
  {
    id: 'INT-2027-0103',
    title: 'Reparación de calzada de hormigón H-30 en cruce de Solano',
    registrationDate: '2026-10-11T11:00:00Z',
    responsibleArea: 'Dirección General de Vialidad Urbana y Pavimentos',
    category: 'Reparación de calzadas',
    description: 'Rotura de losa de hormigón con hundimiento. Demolición neumática, compactación de base suelo-cemento y colado de hormigón con aditivo acelerante de fragüe.',
    address: 'Av. 844 y Calle 893',
    neighborhood: 'San Francisco Solano',
    coordinates: { lat: -34.7785, lng: -58.3150 },
    priority: 'Alta',
    responsiblePerson: 'Ing. Marcelo Varela',
    cuadrillaId: 'CUAD-04',
    cuadrillaName: 'Cuadrilla 04 — Hormigonado y Calzadas de Avenidas',
    scheduledDate: '2026-10-15',
    estimatedCompletionDate: '2026-10-18',
    status: 'En ejecución',
    photos: {
      before: [
        'https://images.unsplash.com/photo-1584463699028-eb2874136e0d?auto=format&fit=crop&w=600&q=80'
      ],
      during: [
        'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=600&q=80'
      ],
      after: []
    },
    observations: 'Encofrado perimetral finalizado. Colado de primera etapa de 18 m² ejecutada. Vallado y balizamiento nocturno colocado.',
    materialsUsed: ['Hormigón H-30 (12 m³)', 'Malla electrosoldada Q-188', 'Pasadores de acero liso de 16 mm'],
    equipmentAssigned: ['Camión Mixer AF-712-KZ', 'Martillo neumático compresor Atlas Copco'],
    verification: {
      verified: false
    },
    history: [
      {
        id: 'HIS-07',
        timestamp: '2026-10-11T11:00:00Z',
        userId: 'USR-04',
        userName: 'Ing. Marcelo Varela',
        userRole: 'DIRECTOR',
        action: 'Creación de intervención',
        details: 'Generada a partir de inspección vial de corredores comerciales.'
      },
      {
        id: 'HIS-08',
        timestamp: '2026-10-15T08:00:00Z',
        userId: 'USR-06',
        userName: 'Lucas Quiroga',
        userRole: 'SUPERVISOR',
        action: 'Inicio de obra en campo',
        details: 'Llegada de Cuadrilla 04 y comienzo de demolición controlada.'
      }
    ]
  },
  {
    id: 'INT-2027-0104',
    title: 'Puesta en valor de mobiliario urbano y luminarias en Plaza Conesa',
    registrationDate: '2026-10-09T14:30:00Z',
    responsibleArea: 'Dirección de Espacios Públicos y Plazas',
    category: 'Plazas y espacios públicos',
    description: 'Pintura de bancos coloniales, reposición de listones antivandálicos, mantenimiento de bebederos de agua potable, puesta a punto de juegos inclusivos y reparación de columnas de alumbrado peatonal.',
    address: 'Plaza Conesa (Conesa y Moreno)',
    neighborhood: 'Quilmes Centro',
    coordinates: { lat: -34.7210, lng: -58.2570 },
    priority: 'Media',
    responsiblePerson: 'Silvia Godoy',
    cuadrillaId: 'CUAD-05',
    cuadrillaName: 'Cuadrilla 05 — Mantenimiento Integral de Plazas',
    scheduledDate: '2026-10-16',
    estimatedCompletionDate: '2026-10-19',
    status: 'Programada',
    photos: {
      before: [
        'https://images.unsplash.com/photo-1568832359672-e36cf5d74f54?auto=format&fit=crop&w=600&q=80'
      ],
      during: [],
      after: []
    },
    observations: 'Requerimiento de pintura poliuretánica verde institucional y piezas de sujeción galvanizadas.',
    materialsUsed: ['Esmalte sintético triple acción', 'Listones de madera dura tratada', 'Bulonería cincada'],
    equipmentAssigned: ['Furgón Iveco Daily AC-503-PQ'],
    verification: {
      verified: false
    },
    history: [
      {
        id: 'HIS-09',
        timestamp: '2026-10-09T14:30:00Z',
        userId: 'USR-03',
        userName: 'Lic. Sebastián García',
        userRole: 'SECRETARIO',
        action: 'Priorización de obra',
        details: 'Aprobación dentro del Plan de Embellecimiento de Centralidades 2027.'
      }
    ]
  },
  {
    id: 'INT-2027-0105',
    title: 'Operativo de fumigación termonebulizada y control de larvas',
    registrationDate: '2026-10-13T16:00:00Z',
    responsibleArea: 'Dirección de Saneamiento y Control de Vectores',
    category: 'Fumigación',
    description: 'Fumigación espacial peridomiciliaria y aplicación de larvicidas biológicos BTI en zanjas a cielo abierto y canales de escurrimiento para prevención de mosquitos vectores del dengue.',
    address: 'Camino General Belgrano y Calle 849',
    neighborhood: 'Villa La Florida',
    coordinates: { lat: -34.7621, lng: -58.3025 },
    priority: 'Alta',
    responsiblePerson: 'Andrés Villalba',
    cuadrillaId: 'CUAD-06',
    cuadrillaName: 'Cuadrilla 06 — Saneamiento y Fumigación Preventiva',
    scheduledDate: '2026-10-17',
    status: 'Asignada',
    photos: {
      before: [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'
      ],
      during: [],
      after: []
    },
    observations: 'Se coordinó con el Centro de Gestión y Participación vecinal para difusión previa en altavoz móvil.',
    materialsUsed: ['Deltametrina concentrado emulsionable', 'Larvicida Bacillus thuringiensis israelensis'],
    equipmentAssigned: ['Camioneta Hilux con cañón ULV AF-114-QM'],
    verification: {
      verified: false
    },
    history: [
      {
        id: 'HIS-10',
        timestamp: '2026-10-13T16:00:00Z',
        userId: 'USR-03',
        userName: 'Lic. Sebastián García',
        userRole: 'SECRETARIO',
        action: 'Ingreso al cronograma de saneamiento',
        details: 'Turno matutino 06:30hs asignado a cuadrilla técnica.'
      }
    ]
  },
  {
    id: 'INT-2027-0106',
    title: 'Readecuación de aliviador pluvial y zanja colectora Namuncurá',
    registrationDate: '2026-10-05T10:15:00Z',
    responsibleArea: 'Dirección de Hidráulica, Sumideros y Pluviales',
    category: 'Drenajes pluviales',
    description: 'Perfilado de taludes de desagüe pluvial, colocación de caños de hormigón de 800 mm en cruces vehiculares y desmalezamiento de fondo de cuneta para acelerar descarga.',
    address: 'Namuncurá y Av. República de Francia',
    neighborhood: 'Ezpeleta Oeste',
    coordinates: { lat: -34.7540, lng: -58.2690 },
    priority: 'Crítica',
    responsiblePerson: 'Dra. Patricia Benítez',
    cuadrillaId: 'CUAD-02',
    cuadrillaName: 'Cuadrilla 02 — Desobstrucción Pluvial Sur y Oeste',
    scheduledDate: '2026-10-08',
    estimatedCompletionDate: '2026-10-10',
    status: 'Pendiente de materiales',
    photos: {
      before: [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'
      ],
      during: [],
      after: []
    },
    delayReason: 'Retraso de proveedor logístico en la entrega de 16 caños de hormigón premoldeado clase IV de 800 mm.',
    observations: 'Se realizó zanjeo previo con motoniveladora. A la espera de caños para completar cruce.',
    materialsUsed: ['Cama de arena de asiento', 'Caños de hormigón armado (pendientes)'],
    equipmentAssigned: ['Retroexcavadora RET-01'],
    verification: {
      verified: false
    },
    history: [
      {
        id: 'HIS-11',
        timestamp: '2026-10-05T10:15:00Z',
        userId: 'USR-05',
        userName: 'Dra. Patricia Benítez',
        userRole: 'DIRECTOR',
        action: 'Creación de intervención',
        details: 'Obra prioritaria para mitigar desbordes en tormentas convectivas.'
      },
      {
        id: 'HIS-12',
        timestamp: '2026-10-10T12:00:00Z',
        userId: 'USR-06',
        userName: 'Lucas Quiroga',
        userRole: 'SUPERVISOR',
        action: 'Cambio de estado: Pendiente de materiales',
        details: 'Aviso formal por falta de entrega de tubos en obrador Ezpeleta.'
      }
    ]
  },
  {
    id: 'INT-2027-0107',
    title: 'Reparación de reductores de velocidad y señalética vial en Don Bosco',
    registrationDate: '2026-10-14T11:45:00Z',
    responsibleArea: 'Dirección General de Vialidad Urbana y Pavimentos',
    category: 'Mantenimiento vial',
    description: 'Reconstrucción de lomo de burro de hormigón deteriorado, colocación de tachas reflectivas viales amarillas y repintado de cebrado reglamentario con pintura termoplástica.',
    address: 'Av. Caseros y Crámer',
    neighborhood: 'Don Bosco',
    coordinates: { lat: -34.7015, lng: -58.2930 },
    priority: 'Media',
    responsiblePerson: 'Ing. Marcelo Varela',
    cuadrillaId: 'CUAD-03',
    cuadrillaName: 'Cuadrilla 03 — Bacheo Asfáltico en Caliente',
    scheduledDate: '2026-10-21',
    status: 'Registrada',
    photos: {
      before: [
        'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80'
      ],
      during: [],
      after: []
    },
    observations: 'Reclamo vecinal ingresado a través del Centro de Atención Municipal para seguridad escolar.',
    materialsUsed: [],
    equipmentAssigned: [],
    verification: {
      verified: false
    },
    history: [
      {
        id: 'HIS-13',
        timestamp: '2026-10-14T11:45:00Z',
        userId: 'USR-01',
        userName: 'Ing. Carlos Mendoza',
        userRole: 'ADMINISTRADOR',
        action: 'Alta en sistema',
        details: 'Carga técnica con geolocalización verificada en Don Bosco.'
      }
    ]
  },
  {
    id: 'INT-2027-0108',
    title: 'Limpieza de cámara decantadora y desobstrucción en Ribera de Quilmes',
    registrationDate: '2026-10-08T09:00:00Z',
    responsibleArea: 'Dirección de Hidráulica, Sumideros y Pluviales',
    category: 'Drenajes pluviales',
    description: 'Mantenimiento preventivo en conducto de vertido del Río de la Plata. Retiro de juncos, botellas y sedimentos para asegurar desagüe libre con marea alta.',
    address: 'Av. Otamendi y Cervantes',
    neighborhood: 'Quilmes Este / Ribera',
    coordinates: { lat: -34.7180, lng: -58.2320 },
    priority: 'Alta',
    responsiblePerson: 'Dra. Patricia Benítez',
    cuadrillaId: 'CUAD-01',
    cuadrillaName: 'Cuadrilla 01 — Desobstrucción Pluvial Norte',
    scheduledDate: '2026-10-09',
    completionDate: '2026-10-11T15:30:00Z',
    status: 'Verificada y cerrada',
    photos: {
      before: [
        'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'
      ],
      during: [
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
      ],
      after: [
        'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?auto=format&fit=crop&w=600&q=80'
      ]
    },
    observations: 'Compuertas clapeta anti-retorno lubricadas y operativas ante sudestadas.',
    materialsUsed: ['Grasa de litio marina', 'Rejilla cincada de protección'],
    equipmentAssigned: ['Retroexcavadora Oruga RET-01', 'Camión Desobstructor AF-302-QM'],
    verification: {
      verified: true,
      verifiedBy: 'Lucas Quiroga',
      verifiedByRole: 'SUPERVISOR',
      verifiedAt: '2026-10-12T10:00:00Z',
      notes: 'Funcionamiento óptimo comprobado en bajante.',
      certificateNumber: 'CERT-HIDRO-2026-0312'
    },
    history: [
      {
        id: 'HIS-14',
        timestamp: '2026-10-08T09:00:00Z',
        userId: 'USR-05',
        userName: 'Dra. Patricia Benítez',
        userRole: 'DIRECTOR',
        action: 'Creación de intervención',
        details: 'Plan de defensas costeras y drenaje pluvial costero.'
      },
      {
        id: 'HIS-15',
        timestamp: '2026-10-12T10:00:00Z',
        userId: 'USR-06',
        userName: 'Lucas Quiroga',
        userRole: 'SUPERVISOR',
        action: 'Verificación oficial',
        details: 'Cierre de obra con informe técnico adjunto.'
      }
    ]
  }
];
