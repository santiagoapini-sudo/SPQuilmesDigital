// GeoJSON Polygons for the 11 Contiguous Operational Zones of Partido de Quilmes
// Tiled seamlessly across the entire Quilmes territory with no gaps, matching the municipal GIS layout.

export interface QuilmesZoneFeature {
  id: string;
  name: string;
  delegacion: string;
  cuadrillaAsignada: string;
  turno: 'Mañana' | 'Tarde' | 'Noche' | 'Diferenciada';
  color: string;
  fillColor: string;
  bachesCount: number;
  sumiderosCount: number;
  plazasCount: number;
  coordinates: [number, number][]; // [lng, lat]
}

export const QUILMES_OPERATIONAL_ZONES: QuilmesZoneFeature[] = [
  {
    id: 'ZONA-01',
    name: 'Bernal Este & Don Bosco Costero',
    delegacion: 'Delegación Bernal Este / Don Bosco',
    cuadrillaAsignada: 'Cuadrilla 01 (Desobstrucción Pluvial)',
    turno: 'Tarde',
    color: '#16a34a',
    fillColor: '#86efac',
    bachesCount: 8,
    sumiderosCount: 98,
    plazasCount: 5,
    coordinates: [
      [-58.2780, -34.6990],
      [-58.2480, -34.7080],
      [-58.2620, -34.7200],
      [-58.2850, -34.7120],
      [-58.2910, -34.7070],
      [-58.2780, -34.6990]
    ]
  },
  {
    id: 'ZONA-02',
    name: 'Bernal Oeste (Mauriño / Cerrito)',
    delegacion: 'Delegación Bernal Oeste',
    cuadrillaAsignada: 'Cuadrilla 01 (Pluviales) / Cuadrilla 06 (Saneamiento)',
    turno: 'Mañana',
    color: '#dc2626',
    fillColor: '#fca5a5',
    bachesCount: 26,
    sumiderosCount: 135,
    plazasCount: 4,
    coordinates: [
      [-58.2910, -34.7070],
      [-58.2850, -34.7120],
      [-58.2620, -34.7200],
      [-58.2750, -34.7300],
      [-58.3050, -34.7250],
      [-58.3210, -34.7180],
      [-58.3050, -34.7070],
      [-58.2910, -34.7070]
    ]
  },
  {
    id: 'ZONA-03',
    name: 'Quilmes Centro y Casco Histórico',
    delegacion: 'Delegación Quilmes Centro',
    cuadrillaAsignada: 'Cuadrilla 03 (Bacheo Asfáltico)',
    turno: 'Noche',
    color: '#7c3aed',
    fillColor: '#c4b5fd',
    bachesCount: 14,
    sumiderosCount: 142,
    plazasCount: 6,
    coordinates: [
      [-58.2620, -34.7200],
      [-58.2430, -34.7250],
      [-58.2520, -34.7400],
      [-58.2700, -34.7350],
      [-58.2620, -34.7200]
    ]
  },
  {
    id: 'ZONA-04',
    name: 'Quilmes Este & La Ribera',
    delegacion: 'Delegación Quilmes Este',
    cuadrillaAsignada: 'Cuadrilla 05 (Plazas y Paseos)',
    turno: 'Diferenciada',
    color: '#0891b2',
    fillColor: '#67e8f9',
    bachesCount: 12,
    sumiderosCount: 88,
    plazasCount: 7,
    coordinates: [
      [-58.2480, -34.7080],
      [-58.2320, -34.7180],
      [-58.2190, -34.7330],
      [-58.2350, -34.7420],
      [-58.2430, -34.7250],
      [-58.2620, -34.7200],
      [-58.2480, -34.7080]
    ]
  },
  {
    id: 'ZONA-05',
    name: 'Quilmes Oeste Norte (Corredor 12 de Octubre)',
    delegacion: 'Delegación Quilmes Oeste',
    cuadrillaAsignada: 'Cuadrilla 03 (Bacheo) / Cuadrilla 02 (Pluviales)',
    turno: 'Mañana',
    color: '#ea580c',
    fillColor: '#fdba74',
    bachesCount: 22,
    sumiderosCount: 185,
    plazasCount: 4,
    coordinates: [
      [-58.2750, -34.7300],
      [-58.2700, -34.7350],
      [-58.2820, -34.7480],
      [-58.3180, -34.7380],
      [-58.3050, -34.7250],
      [-58.2750, -34.7300]
    ]
  },
  {
    id: 'ZONA-06',
    name: 'Quilmes Oeste Sur (Amoedo / Calchaquí Sur)',
    delegacion: 'Delegación Quilmes Oeste',
    cuadrillaAsignada: 'Cuadrilla 04 (Calzadas de Hormigón)',
    turno: 'Noche',
    color: '#2563eb',
    fillColor: '#93c5fd',
    bachesCount: 18,
    sumiderosCount: 160,
    plazasCount: 5,
    coordinates: [
      [-58.2700, -34.7350],
      [-58.2520, -34.7400],
      [-58.2650, -34.7560],
      [-58.2950, -34.7580],
      [-58.2820, -34.7480],
      [-58.2700, -34.7350]
    ]
  },
  {
    id: 'ZONA-07',
    name: 'Ezpeleta Este (Corredor Av. Mitre Sur)',
    delegacion: 'Delegación Ezpeleta',
    cuadrillaAsignada: 'Cuadrilla 04 (Hormigonado)',
    turno: 'Diferenciada',
    color: '#0d9488',
    fillColor: '#5eead4',
    bachesCount: 15,
    sumiderosCount: 110,
    plazasCount: 3,
    coordinates: [
      [-58.2430, -34.7250],
      [-58.2350, -34.7420],
      [-58.2190, -34.7330],
      [-58.2100, -34.7480],
      [-58.2250, -34.7560],
      [-58.2520, -34.7520],
      [-58.2520, -34.7400],
      [-58.2430, -34.7250]
    ]
  },
  {
    id: 'ZONA-08',
    name: 'Ezpeleta Oeste (República de Francia)',
    delegacion: 'Delegación Ezpeleta Oeste',
    cuadrillaAsignada: 'Cuadrilla 02 (Drenajes Pluviales)',
    turno: 'Tarde',
    color: '#4f46e5',
    fillColor: '#a5b4fc',
    bachesCount: 20,
    sumiderosCount: 125,
    plazasCount: 3,
    coordinates: [
      [-58.2520, -34.7400],
      [-58.2520, -34.7520],
      [-58.2250, -34.7560],
      [-58.2430, -34.7630],
      [-58.2690, -34.7690],
      [-58.2650, -34.7560],
      [-58.2520, -34.7400]
    ]
  },
  {
    id: 'ZONA-09',
    name: 'Villa La Florida (Camino Gral. Belgrano / 844)',
    delegacion: 'Delegación Villa La Florida',
    cuadrillaAsignada: 'Cuadrilla 02 (Pluviales) / Cuadrilla 06 (Saneamiento)',
    turno: 'Mañana',
    color: '#d97706',
    fillColor: '#fde68a',
    bachesCount: 16,
    sumiderosCount: 115,
    plazasCount: 3,
    coordinates: [
      [-58.2950, -34.7580],
      [-58.2650, -34.7560],
      [-58.2690, -34.7690],
      [-58.2890, -34.7740],
      [-58.3080, -34.7660],
      [-58.2950, -34.7580]
    ]
  },
  {
    id: 'ZONA-10',
    name: 'San Francisco Solano Norte (Av. 844 Centro)',
    delegacion: 'Delegación San Francisco Solano',
    cuadrillaAsignada: 'Cuadrilla 03 (Bacheo) / Cuadrilla 05 (Plazas)',
    turno: 'Tarde',
    color: '#059669',
    fillColor: '#a7f3d0',
    bachesCount: 28,
    sumiderosCount: 170,
    plazasCount: 5,
    coordinates: [
      [-58.3180, -34.7380],
      [-58.2820, -34.7480],
      [-58.2950, -34.7580],
      [-58.3080, -34.7660],
      [-58.3300, -34.7750],
      [-58.3380, -34.7620],
      [-58.3210, -34.7410],
      [-58.3180, -34.7380]
    ]
  },
  {
    id: 'ZONA-11',
    name: 'San Francisco Solano Sur (Cuenca Alta Las Piedras)',
    delegacion: 'Delegación San Francisco Solano',
    cuadrillaAsignada: 'Cuadrilla 02 (Desobstrucción Cuenca Alta)',
    turno: 'Noche',
    color: '#e11d48',
    fillColor: '#fda4af',
    bachesCount: 31,
    sumiderosCount: 195,
    plazasCount: 6,
    coordinates: [
      [-58.3300, -34.7750],
      [-58.3080, -34.7660],
      [-58.2890, -34.7740],
      [-58.3120, -34.7860],
      [-58.3340, -34.7950],
      [-58.3490, -34.7820],
      [-58.3380, -34.7620],
      [-58.3300, -34.7750]
    ]
  }
];

export interface GisPointFeature {
  id: string;
  name: string;
  type: 'sumidero' | 'bache' | 'plaza' | 'bomba' | 'obrador' | 'microbasural' | 'voluminoso' | 'ecopunto';
  lat: number;
  lng: number;
  address: string;
  zonaId: string;
  status: 'operativo' | 'en_obra' | 'requiere_atencion';
  details: string;
}

export const QUILMES_GIS_POINTS: GisPointFeature[] = [
  // Microbasurales y Puntos Críticos (Relevamiento y Erradicación)
  { id: 'MIC-001', name: 'Microbasural Calle 162 y Zapiola', type: 'microbasural', lat: -34.7180, lng: -58.2980, address: 'Calle 162 y Zapiola, Bernal Oeste', zonaId: 'ZONA-02', status: 'requiere_atencion', details: 'Erradicación de microbasural crónico. Requiere batea roll-off y pala mecánica.' },
  { id: 'MIC-002', name: 'Basural Agustín Pedemonte', type: 'microbasural', lat: -34.7290, lng: -58.3090, address: 'Agustín Pedemonte y Camino General Belgrano, Quilmes Oeste', zonaId: 'ZONA-05', status: 'requiere_atencion', details: 'Saneamiento perimetral con intervención diaria de cuadrilla municipal.' },
  { id: 'MIC-003', name: 'Microbasural Puente Mauriño', type: 'microbasural', lat: -34.7120, lng: -58.2910, address: 'Puente Miguel Ángel Mauriño, Bernal Oeste', zonaId: 'ZONA-02', status: 'en_obra', details: 'Colocación de cámaras de monitoreo, desmalezado y recuperación del espacio.' },
  { id: 'MIC-004', name: 'Microbasural Cnel. Lynch', type: 'microbasural', lat: -34.7200, lng: -58.3240, address: 'Cnel. Lynch y Mauriño, límite Bernal Oeste', zonaId: 'ZONA-02', status: 'requiere_atencion', details: 'Batea roll-off fija instalada para descarte de vecinos y comercios.' },

  // Sectores de Residuos Voluminosos y Montículos (S1 - S4)
  { id: 'VOL-001', name: 'Sector Voluminosos S1 (Don Bosco)', type: 'voluminoso', lat: -34.7040, lng: -58.2830, address: 'Av. San Martín y Chiclana, Don Bosco', zonaId: 'ZONA-01', status: 'operativo', details: 'Circuito programado de recolección de ramas, chatarra y escombros: Lunes y Jueves.' },
  { id: 'VOL-002', name: 'Sector Voluminosos S2 (Ribera de Bernal)', type: 'voluminoso', lat: -34.6950, lng: -58.2700, address: 'Parque Lineal Don Bosco Raúl Alfonsín, Ribera de Bernal', zonaId: 'z_ribera_bernal', status: 'operativo', details: 'Mantenimiento de pastizales y recolección de restos de poda costera.' },
  { id: 'VOL-003', name: 'Sector Voluminosos S3 (Quilmes Centro)', type: 'voluminoso', lat: -34.7240, lng: -58.2520, address: 'Pringles y Humberto Primo, Quilmes Centro', zonaId: 'ZONA-03', status: 'operativo', details: 'Retiro programado de residuos voluminosos y cacharros.' },
  { id: 'VOL-004', name: 'Sector Voluminosos S4 (Ribera del Uno)', type: 'voluminoso', lat: -34.7480, lng: -58.2250, address: 'Ribera del Uno, Av. Florencio Varela y Autopista, Ezpeleta', zonaId: 'z_ribera_uno', status: 'operativo', details: 'Cuadrilla de desmalezado, zanjeo y saneamiento ribereño.' },

  // Ecopuntos y Puntos Verdes
  { id: 'ECO-001', name: 'Ecopunto Plaza Conesa', type: 'ecopunto', lat: -34.7250, lng: -58.2595, address: 'Conesa y Moreno, Quilmes Centro', zonaId: 'ZONA-03', status: 'operativo', details: 'Recepción de cartón, plástico, vidrio y metal reciclable. Lunes a Sábado de 08:00 a 18:00 hs.' },
  { id: 'ECO-002', name: 'Ecopunto Pejerrey Club (Ribera)', type: 'ecopunto', lat: -34.7160, lng: -58.2410, address: 'Av. Cervantes y Av. Otamendi, La Ribera de Quilmes', zonaId: 'ZONA-04', status: 'operativo', details: 'Estación de reciclaje costera abierta a toda la comunidad ribereña.' },
  { id: 'ECO-003', name: 'Ecopunto Parque Lineal Don Bosco', type: 'ecopunto', lat: -34.7010, lng: -58.2780, address: 'Caseros y Parque Lineal, Don Bosco', zonaId: 'ZONA-01', status: 'operativo', details: 'Punto verde con recepción de reciclables y promotores ambientales.' },

  // Sumideros y Bocas de Tormenta estratégicos
  { id: 'SUM-001', name: 'Sumidero S-104 (Doble Reja)', type: 'sumidero', lat: -34.7225, lng: -58.2570, address: 'Av. Mitre y Alsina, Quilmes Centro', zonaId: 'ZONA-03', status: 'operativo', details: 'Cámara decantadora limpia el 20/10/2026. Capacidad 100%.' },
  { id: 'SUM-002', name: 'Boca de Tormenta BT-212', type: 'sumidero', lat: -34.7290, lng: -58.2610, address: 'Av. Hipólito Yrigoyen y Rivadavia', zonaId: 'ZONA-03', status: 'en_obra', details: 'Reemplazo de losa perimetral de captación pluvial.' },
  { id: 'SUM-003', name: 'Sumidero Calchaquí C-88', type: 'sumidero', lat: -34.7350, lng: -58.2830, address: 'Av. Calchaquí y Rodolfo López, Quilmes Oeste', zonaId: 'ZONA-05', status: 'requiere_atencion', details: 'Sedimentos acumulados luego de la última tormenta.' },
  { id: 'SUM-004', name: 'Sumidero Solano 844', type: 'sumidero', lat: -34.7730, lng: -58.3180, address: 'Av. 844 y Calle 893, Solano', zonaId: 'ZONA-10', status: 'operativo', details: 'Conducto de alivio conectado a la cuenca San Francisco.' },
  { id: 'SUM-005', name: 'Sumidero Bernal Centro', type: 'sumidero', lat: -34.7080, lng: -58.2790, address: 'Belgrano y Zapiola, Bernal', zonaId: 'ZONA-01', status: 'operativo', details: 'Cámara de inspección verificada por Cuadrilla 01.' },
  { id: 'SUM-006', name: 'Sumidero Ezpeleta Mitre', type: 'sumidero', lat: -34.7460, lng: -58.2380, address: 'Av. Mitre y Rep. de Francia, Ezpeleta', zonaId: 'ZONA-07', status: 'requiere_atencion', details: 'Reja metálica descalzada por tránsito pesado.' },

  // Baches y Obras Viales
  { id: 'BAC-001', name: 'Bacheo Calzada Hormigón', type: 'bache', lat: -34.7310, lng: -58.2760, address: 'Av. 12 de Octubre y Andrés Baranda, Quilmes Oeste', zonaId: 'ZONA-05', status: 'en_obra', details: 'Apertura de 18 m² de calzada H-30. Fraguado en curso.' },
  { id: 'BAC-002', name: 'Reparación Carpeta Asfáltica', type: 'bache', lat: -34.7180, lng: -58.2520, address: 'Lavalle y Garibaldi, Quilmes Centro', zonaId: 'ZONA-03', status: 'requiere_atencion', details: 'Fresa y recarpeteo de 25 metros lineales programado.' },
  { id: 'BAC-003', name: 'Bache Urgente Corredor Mitre', type: 'bache', lat: -34.7410, lng: -58.2410, address: 'Av. Mitre y Hernández, Ezpeleta', zonaId: 'ZONA-07', status: 'en_obra', details: 'Intervención con asfalto caliente 160°C.' },
  { id: 'BAC-004', name: 'Hormigonado Solano', type: 'bache', lat: -34.7800, lng: -58.3260, address: 'Calle 844 y 897, Solano Centro', zonaId: 'ZONA-11', status: 'operativo', details: 'Losa habilitada al tránsito el 22/10/2026.' },

  // Plazas y Espacios Públicos
  { id: 'PLZ-001', name: 'Plaza San Martín (Catedral)', type: 'plaza', lat: -34.7210, lng: -58.2540, address: 'Mitre y Rivadavia, Quilmes Centro', zonaId: 'ZONA-03', status: 'operativo', details: 'Mantenimiento integral de luminarias LED y canteros.' },
  { id: 'PLZ-002', name: 'Plaza Conesa', type: 'plaza', lat: -34.7245, lng: -58.2590, address: 'Conesa y Moreno, Quilmes Centro', zonaId: 'ZONA-03', status: 'operativo', details: 'Poda correctiva y puesta en valor de juegos infantiles.' },
  { id: 'PLZ-003', name: 'Plaza del Maestro', type: 'plaza', lat: -34.7110, lng: -58.2810, address: 'Independencia y Carabelas, Bernal', zonaId: 'ZONA-01', status: 'operativo', details: 'Corte de césped semanal por Cuadrilla 05.' },
  { id: 'PLZ-004', name: 'Parque de la Ciudad', type: 'plaza', lat: -34.7430, lng: -58.2680, address: 'Vicente López y Smith, Quilmes Oeste', zonaId: 'ZONA-06', status: 'operativo', details: 'Pista de atletismo y circuito aeróbico municipal.' },
  { id: 'PLZ-005', name: 'Plaza Yapeyú', type: 'plaza', lat: -34.7760, lng: -58.3220, address: 'Av. 844 y Calle 895, Solano', zonaId: 'ZONA-10', status: 'operativo', details: 'Recambio de bancos y cestos antivandálicos.' },

  // Estaciones de Bombeo Pluvial
  { id: 'BMB-001', name: 'Estación de Bombeo Ribera Norte', type: 'bomba', lat: -34.7140, lng: -58.2380, address: 'Av. Otamendi y Costanera, Quilmes Este', zonaId: 'ZONA-04', status: 'operativo', details: '4 electrobombas sumergibles operando al 100% de caudal.' },
  { id: 'BMB-002', name: 'Aliviador Bajo Vías San Martín', type: 'bomba', lat: -34.7070, lng: -58.2840, address: 'Paso Bajo Nivel San Martín, Bernal', zonaId: 'ZONA-01', status: 'operativo', details: 'Sensores de nivel pluvial activos con alerta automática.' },
  { id: 'BMB-003', name: 'Bomba Cuenca Arroyo Las Piedras', type: 'bomba', lat: -34.7860, lng: -58.3320, address: 'Arroyo Las Piedras y Calle 850, Solano', zonaId: 'ZONA-11', status: 'operativo', details: 'Generador diésel de respaldo probado el 24/10/2026.' },

  // Obradores Centrales y Bases Operativas
  { id: 'OBR-001', name: 'Obrador Central Servicios Públicos', type: 'obrador', lat: -34.7335, lng: -58.2675, address: 'Av. 12 de Octubre y Mosconi, Quilmes Oeste', zonaId: 'ZONA-05', status: 'operativo', details: 'Base central de camiones desobstructores, hidrogrúas y motoniveladoras.' },
  { id: 'OBR-002', name: 'Base Operativa Solano / La Florida', type: 'obrador', lat: -34.7700, lng: -58.3150, address: 'Camino Gral. Belgrano y 844', zonaId: 'ZONA-09', status: 'operativo', details: 'Despacho de Cuadrilla 02 (Pluviales Sur) y Cuadrilla 04.' }
];
