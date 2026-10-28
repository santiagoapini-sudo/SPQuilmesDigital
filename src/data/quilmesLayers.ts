export interface GisLayer {
  id: string;
  name: string;
  description: string;
  type: 'polygon' | 'linestring' | 'points' | 'kml';
  color: string;
  weight?: number;
  fillOpacity?: number;
  visible: boolean;
  geoJsonData: any;
  isCustom?: boolean;
}

// Bounding box for Partido de Quilmes
export const QUILMES_BBOX = {
  southWest: [-34.812, -58.355] as [number, number],
  northEast: [-34.670, -58.190] as [number, number],
  center: [-34.730, -58.270] as [number, number]
};

import { QUILMES_EXACT_PERIMETER_COORDS, QUILMES_CITY_BOUNDARY_GEOJSON, QUILMES_86_ZONES, QuilmesCityZone } from './quilmesCityMap';

export { QUILMES_EXACT_PERIMETER_COORDS, QUILMES_CITY_BOUNDARY_GEOJSON, QUILMES_86_ZONES };
export type { QuilmesCityZone };

// Exact 196-point Perimeter Polygon Coordinates of the Ciudad de Quilmes in [lng, lat]
export const QUILMES_PERIMETER_COORDS: [number, number][] = QUILMES_EXACT_PERIMETER_COORDS;

// Official Boundary GeoJSON
export const QUILMES_BOUNDARY_GEOJSON = QUILMES_CITY_BOUNDARY_GEOJSON;

// Major Pluvial Basins & Streams in Quilmes (Arroyo Las Piedras & Arroyo San Francisco)
export const QUILMES_PLUVIAL_BASINS_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Arroyo Las Piedras (Cuenca Crítica)",
        tipo: "Drenaje Pluvial Abierto",
        intervencion: "Supervisión permanente y limpieza de fondo"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-58.3400, -34.7870],
          [-58.3280, -34.7750],
          [-58.3150, -34.7600],
          [-58.3010, -34.7480],
          [-58.2880, -34.7350],
          [-58.2750, -34.7220]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Arroyo San Francisco (Aliviador)",
        tipo: "Cuenca Pluvial",
        intervencion: "Mantenimiento preventivo contra anegamientos"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-58.3250, -34.7890],
          [-58.3100, -34.7760],
          [-58.2950, -34.7630],
          [-58.2800, -34.7500],
          [-58.2650, -34.7380]
        ]
      }
    }
  ]
};

// Priority Heavy Traffic & Transit Corridors (Bacheo & Calzadas)
export const QUILMES_CORRIDORS_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        name: "Corredor Av. Calchaquí (Ruta Provincial 36)",
        longitud: "11.2 km",
        tipo: "Tránsito Pesado y Transporte Público"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-58.2950, -34.7120],
          [-58.2870, -34.7280],
          [-58.2790, -34.7450],
          [-58.2700, -34.7620],
          [-58.2600, -34.7700]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Corredor Av. Bartolomé Mitre",
        longitud: "7.8 km",
        tipo: "Troncal Comercial y Conectividad Norte-Sur"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-58.2740, -34.7060],
          [-58.2650, -34.7200],
          [-58.2560, -34.7350],
          [-58.2430, -34.7550],
          [-58.2320, -34.7630]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Corredor Av. 844 (Eje Comercial Solano)",
        longitud: "5.4 km",
        tipo: "Conexión Este-Oeste Solano / Florida"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-58.3450, -34.7800],
          [-58.3280, -34.7760],
          [-58.3100, -34.7720],
          [-58.2920, -34.7680]
        ]
      }
    }
  ]
};

// Initial preset layers for the municipal GIS
export const INITIAL_GIS_LAYERS: GisLayer[] = [
  {
    id: 'layer-quilmes-boundary',
    name: 'Límite Oficial del Partido de Quilmes',
    description: 'Perímetro jurisdiccional oficial que aísla el territorio de Quilmes de partidos vecinos.',
    type: 'polygon',
    color: '#6b21a8', // Institutional violet
    weight: 3,
    fillOpacity: 0.05,
    visible: true,
    geoJsonData: QUILMES_BOUNDARY_GEOJSON
  },
  {
    id: 'layer-pluvial-basins',
    name: 'Cuencas Hídricas y Aliviadores Pluviales',
    description: 'Trazas de los arroyos Las Piedras, San Francisco y aliviadores costeros para prevención de anegamientos.',
    type: 'linestring',
    color: '#0891b2', // Tech turquoise / cyan
    weight: 3.5,
    fillOpacity: 0,
    visible: true,
    geoJsonData: QUILMES_PLUVIAL_BASINS_GEOJSON
  },
  {
    id: 'layer-priority-corridors',
    name: 'Corredores Viales Prioritarios (Bacheo 2027)',
    description: 'Avenidas Calchaquí, Mitre y 844 sujetas a mantenimiento intensivo de calzada.',
    type: 'linestring',
    color: '#d97706', // Amber
    weight: 3,
    fillOpacity: 0,
    visible: false,
    geoJsonData: QUILMES_CORRIDORS_GEOJSON
  }
];
