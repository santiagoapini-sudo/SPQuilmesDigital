import { kml } from '@tmcw/togeojson';
import JSZip from 'jszip';

export interface ParsedGisResult {
  success: boolean;
  name: string;
  featureCount: number;
  geoJson: GeoJSON.FeatureCollection | null;
  error?: string;
  geometryTypes?: string[];
}

/**
 * Validates and sanitizes a GeoJSON object so Leaflet's L.geoJSON never crashes
 */
function sanitizeFeatureCollection(raw: any, fallbackName: string): ParsedGisResult {
  if (!raw) {
    return {
      success: false,
      name: fallbackName,
      featureCount: 0,
      geoJson: null,
      error: 'El archivo no contiene datos espaciales legibles.'
    };
  }

  let features: any[] = [];
  if (raw.type === 'FeatureCollection' && Array.isArray(raw.features)) {
    features = raw.features;
  } else if (raw.type === 'Feature') {
    features = [raw];
  } else if (raw.type && raw.coordinates) {
    // Single bare geometry (Point, Polygon, etc.)
    features = [{
      type: 'Feature',
      geometry: raw,
      properties: { name: fallbackName }
    }];
  } else if (Array.isArray(raw)) {
    features = raw.filter((item: any) => item && item.geometry);
  }

  // Filter out features with missing or null geometries (common in Google My Maps folders/styles)
  const validFeatures = features.filter((f: any) => {
    if (!f || typeof f !== 'object') return false;
    if (!f.geometry || typeof f.geometry !== 'object') return false;
    const geomType = f.geometry.type;
    const coords = f.geometry.coordinates;
    if (!geomType || coords === undefined || coords === null) return false;
    if (Array.isArray(coords) && coords.length === 0) return false;
    return true;
  });

  if (validFeatures.length === 0) {
    return {
      success: false,
      name: fallbackName,
      featureCount: 0,
      geoJson: null,
      error: 'No se encontraron geometrías válidas (polígonos, líneas o puntos con coordenadas) en la capa.'
    };
  }

  const geomTypes = Array.from(new Set(validFeatures.map((f: any) => f.geometry.type)));

  const cleanCollection: GeoJSON.FeatureCollection = {
    type: 'FeatureCollection',
    features: validFeatures.map((f: any, idx: number) => {
      const props = f.properties || {};
      return {
        type: 'Feature',
        id: f.id || `feat-${idx}`,
        geometry: f.geometry,
        properties: {
          name: props.name || props.nombre || props.Name || `Elemento ${idx + 1}`,
          description: props.description || props.descripcion || props.desc || '',
          ...props
        }
      };
    })
  };

  return {
    success: true,
    name: fallbackName,
    featureCount: validFeatures.length,
    geoJson: cleanCollection,
    geometryTypes: geomTypes
  };
}

/**
 * Parses a KML string (from Google My Maps, Google Earth, or QGIS)
 * and converts it into a clean GeoJSON FeatureCollection.
 */
export function parseKmlStringToGeoJson(kmlText: string, layerName = 'Capa KML'): ParsedGisResult {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(kmlText, 'text/xml');

    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      return {
        success: false,
        name: layerName,
        featureCount: 0,
        geoJson: null,
        error: 'El archivo KML contiene etiquetas o formato XML no válido.'
      };
    }

    const docName = xmlDoc.querySelector('Document > name, kml > Document > name, Folder > name')?.textContent?.trim() || layerName;
    const rawGeo = kml(xmlDoc);

    return sanitizeFeatureCollection(rawGeo, docName);
  } catch (err: any) {
    return {
      success: false,
      name: layerName,
      featureCount: 0,
      geoJson: null,
      error: err?.message || 'Error al procesar el archivo KML.'
    };
  }
}

/**
 * Parses raw GeoJSON string (from export or copy-paste)
 */
export function parseGeoJsonString(geoJsonText: string, layerName = 'Capa GeoJSON'): ParsedGisResult {
  try {
    const parsed = JSON.parse(geoJsonText);
    return sanitizeFeatureCollection(parsed, layerName);
  } catch {
    return {
      success: false,
      name: layerName,
      featureCount: 0,
      geoJson: null,
      error: 'El texto no es un formato GeoJSON / JSON válido.'
    };
  }
}

/**
 * Universal file parser: handles .kml, .kmz (zipped), and .geojson/.json files
 */
export async function parseUploadedGisFile(file: File, defaultLayerName?: string): Promise<ParsedGisResult> {
  const fileName = file.name.toLowerCase();
  const baseName = defaultLayerName || file.name.replace(/\.[^/.]+$/, '');

  // 1. Check if KMZ (Google Earth / My Maps zipped format)
  if (fileName.endsWith('.kmz')) {
    try {
      const zip = new JSZip();
      const zipContents = await zip.loadAsync(file);
      
      // Look for doc.kml or any .kml file inside
      let kmlEntry = zipContents.file('doc.kml');
      if (!kmlEntry) {
        // find first file ending with .kml
        const kmlFiles = Object.keys(zipContents.files).filter(name => name.toLowerCase().endsWith('.kml'));
        if (kmlFiles.length > 0) {
          kmlEntry = zipContents.file(kmlFiles[0]);
        }
      }

      if (!kmlEntry) {
        return {
          success: false,
          name: baseName,
          featureCount: 0,
          geoJson: null,
          error: 'El archivo KMZ no contiene ningún archivo .kml en su interior.'
        };
      }

      const kmlString = await kmlEntry.async('text');
      return parseKmlStringToGeoJson(kmlString, baseName);
    } catch (err: any) {
      return {
        success: false,
        name: baseName,
        featureCount: 0,
        geoJson: null,
        error: `No se pudo descomprimir el archivo KMZ: ${err?.message || 'archivo corrupto'}`
      };
    }
  }

  // 2. Read as text
  const text = await file.text();
  const trimmed = text.trim();

  // 3. If looks like JSON / GeoJSON
  if (fileName.endsWith('.geojson') || fileName.endsWith('.json') || trimmed.startsWith('{') || trimmed.startsWith('[')) {
    const result = parseGeoJsonString(trimmed, baseName);
    if (result.success) return result;
  }

  // 4. Default to KML parser
  return parseKmlStringToGeoJson(trimmed, baseName);
}

