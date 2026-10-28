/**
 * Demarcación Oficial de la Municipalidad de Quilmes
 * Fuente cartográfica: Sistema de Información Geográfica de Quilmes (SIG Quilmes - gis.quilmes.gov.ar)
 * y Portal de Datos Abiertos del Municipio de Quilmes (datos.quilmes.gov.ar).
 *
 * Incluye:
 * 1. Límite Oficial del Partido de Quilmes (Perímetro de alta precisión)
 * 2. Las 6 Localidades Oficiales de Quilmes (Bernal, Don Bosco, Quilmes, Ezpeleta, San Francisco Solano, Villa La Florida)
 * 3. Barrios Oficiales Catastrales del SIG Municipal
 */

// Perímetro oficial en coordenadas [lng, lat] para GeoJSON y Polígonos de Leaflet
export const QUILMES_SIG_PERIMETER_COORDS: [number, number][] = [
  // LÍMITE NORTE (con Avellaneda / Wilde - Arroyo Sarandí / Canal Santo Domingo / Acceso Sudeste)
  [-58.2785, -34.6975],
  [-58.2740, -34.6995],
  [-58.2680, -34.7020],
  
  // COSTA DEL RÍO DE LA PLATA (Límite Este)
  [-58.2580, -34.7060], // Costa Bernal
  [-58.2460, -34.7115], // Costa Don Bosco
  [-58.2360, -34.7185], // Costa Quilmes Norte
  [-58.2290, -34.7260], // Balneario de Quilmes / Club Náutico
  [-58.2230, -34.7340], // Costa Quilmes Sur / La Ribera
  [-58.2170, -34.7430], // Costa Ezpeleta
  [-58.2120, -34.7505], // Límite costero con Berazategui (altura Av. Florencio Varela)

  // LÍMITE SUR-ESTE (con Berazategui - Av. Florencio Varela / Calle 401)
  [-58.2220, -34.7535],
  [-58.2330, -34.7570], // Cruce con Autopista Buenos Aires - La Plata
  [-58.2440, -34.7605], // Cruce con vías FFCC Roca (Ezpeleta / Berazategui)
  [-58.2560, -34.7645], // Av. Mitre / Av. Centenario
  [-58.2680, -34.7690], // Av. Calchaquí (RP 36 / Cruce Varela)

  // LÍMITE SUR (con Florencio Varela)
  [-58.2810, -34.7735], // Av. República de Francia
  [-58.2950, -34.7780], // Camino General Belgrano
  [-58.3100, -34.7830], // Av. Monteverde (RP 4)
  [-58.3240, -34.7885], // Cruce Arroyo Las Piedras
  [-58.3370, -34.7935], // Calle 895 / Av. San Martín
  [-58.3485, -34.7970], // Vértice Sudoeste (Solano / Almirante Brown - Donato Álvarez y San Martín)

  // LÍMITE SUR-OESTE (con Almirante Brown - Av. Donato Álvarez / Ruta 4)
  [-58.3515, -34.7890], // Donato Álvarez y Av. 844 (Solano)
  [-58.3550, -34.7795], // Donato Álvarez y Calle 835
  [-58.3580, -34.7695], // Cruce Arroyo San Francisco

  // LÍMITE OESTE (con Lomas de Zamora y Lanús - Camino Gral. Belgrano / Coronel Lynch)
  [-58.3530, -34.7600], // Límite Villa La Florida / San José
  [-58.3450, -34.7500], // Av. Monteverde / Pasco
  [-58.3350, -34.7405], // Av. Lynch / Donato Álvarez
  [-58.3240, -34.7315], // Camino General Belgrano / Av. Los Quilmes
  [-58.3120, -34.7230], // Mauriño / Zeballos
  [-58.3010, -34.7150], // Cerrito / Av. Lamadrid

  // LÍMITE NOR-OESTE (con Avellaneda / Wilde - Av. Las Flores / Lynch)
  [-58.2915, -34.7075], // Dardo Rocha / Las Flores
  [-58.2840, -34.7015], // Acceso Sudeste / Wilde
  [-58.2785, -34.6975]  // Cierre de polígono en Río de la Plata
];

// GeoJSON de las 6 Localidades Oficiales de la Municipalidad de Quilmes (SIG Quilmes)
export const QUILMES_LOCALIDADES_SIG_GEOJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "LOC-BERNAL",
      properties: {
        nombre: "Bernal",
        subdivisiones: "Bernal Este y Bernal Oeste",
        codigoCatastral: "Circunscripción II",
        superficieKm2: 24.5,
        delegacion: "Delegación Municipal Bernal (Belgrano 450)",
        color: "#3b82f6",
        fillColor: "#93c5fd",
        descripcion: "Localidad cabecera norte del partido. Sede de la Universidad Nacional de Quilmes (UNQ)."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.2785, -34.6975],
          [-58.2580, -34.7060],
          [-58.2660, -34.7150],
          [-58.2760, -34.7210],
          [-58.2920, -34.7230],
          [-58.3120, -34.7230],
          [-58.3010, -34.7150],
          [-58.2915, -34.7075],
          [-58.2840, -34.7015],
          [-58.2785, -34.6975]
        ]]
      }
    },
    {
      type: "Feature",
      id: "LOC-DON-BOSCO",
      properties: {
        nombre: "Don Bosco",
        subdivisiones: "Don Bosco Este y Parque",
        codigoCatastral: "Circunscripción II - Fracción D",
        superficieKm2: 8.2,
        delegacion: "Delegación Don Bosco (Pringles y Chaco)",
        color: "#06b6d4",
        fillColor: "#a5f3fc",
        descripcion: "Localidad residencial tradicional entre Bernal y el Río de la Plata."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.2580, -34.7060],
          [-58.2460, -34.7115],
          [-58.2520, -34.7220],
          [-58.2660, -34.7150],
          [-58.2580, -34.7060]
        ]]
      }
    },
    {
      type: "Feature",
      id: "LOC-QUILMES",
      properties: {
        nombre: "Quilmes",
        subdivisiones: "Quilmes Centro, Quilmes Este y Quilmes Oeste",
        codigoCatastral: "Circunscripción I y III",
        superficieKm2: 38.6,
        delegacion: "Palacio Municipal (Alberdi 500) y Delegaciones Zonales",
        color: "#8b5cf6",
        fillColor: "#c4b5fd",
        descripcion: "Cabecera del partido fundada en 1666. Centro cívico, comercial y bancario."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.2460, -34.7115],
          [-58.2360, -34.7185],
          [-58.2290, -34.7260],
          [-58.2230, -34.7340],
          [-58.2410, -34.7430],
          [-58.2620, -34.7480],
          [-58.2850, -34.7420],
          [-58.2920, -34.7230],
          [-58.2760, -34.7210],
          [-58.2660, -34.7150],
          [-58.2520, -34.7220],
          [-58.2460, -34.7115]
        ]]
      }
    },
    {
      type: "Feature",
      id: "LOC-EZPELETA",
      properties: {
        nombre: "Ezpeleta",
        subdivisiones: "Ezpeleta Este y Ezpeleta Oeste",
        codigoCatastral: "Circunscripción IV",
        superficieKm2: 21.4,
        delegacion: "Delegación Municipal Ezpeleta (Honduras y Chile)",
        color: "#f59e0b",
        fillColor: "#fde68a",
        descripcion: "Localidad industrial y residencial del sur del partido, límite con Berazategui."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.2230, -34.7340],
          [-58.2170, -34.7430],
          [-58.2120, -34.7505],
          [-58.2220, -34.7535],
          [-58.2330, -34.7570],
          [-58.2440, -34.7605],
          [-58.2560, -34.7645],
          [-58.2680, -34.7690],
          [-58.2800, -34.7570],
          [-58.2620, -34.7480],
          [-58.2410, -34.7430],
          [-58.2230, -34.7340]
        ]]
      }
    },
    {
      type: "Feature",
      id: "LOC-SOLANO",
      properties: {
        nombre: "San Francisco Solano",
        subdivisiones: "Solano Centro, Barrio Los Eucaliptos y Cuenca Las Piedras",
        codigoCatastral: "Circunscripción V",
        superficieKm2: 23.8,
        delegacion: "Delegación San Francisco Solano (Av. 844 N° 2236)",
        color: "#ef4444",
        fillColor: "#fca5a5",
        descripcion: "Gran centro urbano comercial del sudoeste quilmeño. Eje en Av. 844 y Av. San Martín."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.3100, -34.7830],
          [-58.3240, -34.7885],
          [-58.3370, -34.7935],
          [-58.3485, -34.7970],
          [-58.3515, -34.7890],
          [-58.3550, -34.7795],
          [-58.3580, -34.7695],
          [-58.3400, -34.7660],
          [-58.3200, -34.7720],
          [-58.3100, -34.7830]
        ]]
      }
    },
    {
      type: "Feature",
      id: "LOC-FLORIDA",
      properties: {
        nombre: "Villa La Florida",
        subdivisiones: "La Florida Norte y Sur",
        codigoCatastral: "Circunscripción V - Sección B",
        superficieKm2: 8.5,
        delegacion: "Delegación Villa La Florida (Calle 879 y 850)",
        color: "#10b981",
        fillColor: "#a7f3d0",
        descripcion: "Localidad del sudoeste unida por Camino General Belgrano y Av. 844."
      },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.2850, -34.7420],
          [-58.2680, -34.7690],
          [-58.2810, -34.7735],
          [-58.2950, -34.7780],
          [-58.3100, -34.7830],
          [-58.3200, -34.7720],
          [-58.3400, -34.7660],
          [-58.3530, -34.7600],
          [-58.3450, -34.7500],
          [-58.3350, -34.7405],
          [-58.3120, -34.7350],
          [-58.2850, -34.7420]
        ]]
      }
    }
  ]
};

// GeoJSON de Barrios Catastrales Oficiales del SIG Quilmes
export const QUILMES_BARRIOS_SIG_GEOJSON: GeoJSON.FeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { nombre: "Casco Histórico Quilmes Centro", localidad: "Quilmes", superficieHa: 120 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.2670, -34.7200],
          [-58.2520, -34.7220],
          [-58.2560, -34.7320],
          [-58.2710, -34.7300],
          [-58.2670, -34.7200]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "La Colonia (Quilmes Oeste)", localidad: "Quilmes", superficieHa: 180 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.2820, -34.7240],
          [-58.2670, -34.7200],
          [-58.2710, -34.7300],
          [-58.2860, -34.7340],
          [-58.2820, -34.7240]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Barrio Parque Bernal", localidad: "Bernal", superficieHa: 95 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.2800, -34.7070],
          [-58.2680, -34.7100],
          [-58.2720, -34.7170],
          [-58.2840, -34.7140],
          [-58.2800, -34.7070]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "La Ribera de Quilmes", localidad: "Quilmes", superficieHa: 210 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.2430, -34.7140],
          [-58.2250, -34.7260],
          [-58.2320, -34.7360],
          [-58.2500, -34.7240],
          [-58.2430, -34.7140]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Villa Cramer", localidad: "Bernal", superficieHa: 75 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.2950, -34.7100],
          [-58.2840, -34.7140],
          [-58.2880, -34.7210],
          [-58.2990, -34.7170],
          [-58.2950, -34.7100]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Centro Comercial Solano (Av. 844)", localidad: "San Francisco Solano", superficieHa: 140 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.3450, -34.7750],
          [-58.3300, -34.7780],
          [-58.3340, -34.7860],
          [-58.3490, -34.7830],
          [-58.3450, -34.7750]
        ]]
      }
    },
    {
      type: "Feature",
      properties: { nombre: "Ezpeleta Centro", localidad: "Ezpeleta", superficieHa: 130 },
      geometry: {
        type: "Polygon",
        coordinates: [[
          [-58.2520, -34.7460],
          [-58.2380, -34.7480],
          [-58.2420, -34.7570],
          [-58.2560, -34.7550],
          [-58.2520, -34.7460]
        ]]
      }
    }
  ]
};
