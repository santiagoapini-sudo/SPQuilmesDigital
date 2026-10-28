import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Intervention, 
  InterventionCategory, 
  PriorityLevel, 
  QuilmesNeighborhood 
} from '../../types';
import { 
  MapPin, 
  Search, 
  Printer, 
  Download, 
  Eye, 
  EyeOff, 
  Layers, 
  Plus, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft,
  Wrench, 
  Droplet, 
  TreePine, 
  Bug, 
  ShieldCheck, 
  FileCode, 
  Upload, 
  X, 
  Home, 
  Check, 
  Building2, 
  Truck, 
  Calendar, 
  Users, 
  BarChart2, 
  Clock,
  Sparkles,
  Maximize2
} from 'lucide-react';
import { 
  QUILMES_GIS_POINTS, 
  GisPointFeature 
} from '../../data/quilmesZonificacion';
import { 
  QUILMES_BOUNDARY_GEOJSON, 
  QUILMES_PLUVIAL_BASINS_GEOJSON, 
  QUILMES_CORRIDORS_GEOJSON,
  QUILMES_BBOX,
  QUILMES_86_ZONES,
  QuilmesCityZone
} from '../../data/quilmesLayers';
import { parseKmlStringToGeoJson, parseGeoJsonString, parseUploadedGisFile } from '../../services/kmlParser';
import { QuilmesLogo } from '../common/QuilmesLogo';

interface OperativeMapProps {
  interventions: Intervention[];
  onSelectIntervention: (id: string) => void;
  onOpenNewModalWithCoords: (lat: number, lng: number, addressHint?: string) => void;
}

export const OperativeMap: React.FC<OperativeMapProps> = ({
  interventions,
  onSelectIntervention,
  onOpenNewModalWithCoords
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  // Layer Groups
  const maskLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const boundaryLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const zonesLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const corridorsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const basinsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const pointsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const interventionsMarkersRef = useRef<L.LayerGroup | null>(null);
  const customKmlGroupRef = useRef<L.LayerGroup | null>(null);

  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'capas' | 'dia' | 'cuadrillas' | 'analisis'>('capas');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [legendCollapsed, setLegendCollapsed] = useState(false);
  const [isolateQuilmes, setIsolateQuilmes] = useState(true); // Masks out neighboring municipalities
  const [didacticMode, setDidacticMode] = useState(true); // Super didactic mode for friendly exploration

  // Layer Toggles
  const [layerVisibility, setLayerVisibility] = useState({
    mask: true,
    boundary: true,
    zonas: true, // 88 Zonas de la Ciudad de Quilmes (incluyendo La Ribera de Bernal y Ribera del Uno)
    intervenciones: true,
    bacheoPuntos: true,
    sumiderosPuntos: true,
    arroyosCuencas: true,
    corredoresPesados: true,
    plazasPuntos: true,
    bombasPuntos: true,
    obradoresPuntos: true,
    microbasurales: true,
    voluminosos: true,
    ecopuntos: true
  });

  // Selected item modal / drawer
  const [selectedPoint, setSelectedPoint] = useState<GisPointFeature | null>(null);
  const [selectedInterventionItem, setSelectedInterventionItem] = useState<Intervention | null>(null);
  const [selectedZone, setSelectedZone] = useState<QuilmesCityZone | null>(null);
  const [clickCoord, setClickCoord] = useState<{ lat: number; lng: number } | null>(null);

  // KML Custom Layers
  const [kmlModalOpen, setKmlModalOpen] = useState(false);
  const [customKmlLayers, setCustomKmlLayers] = useState<any[]>([]);
  const [kmlTextInput, setKmlTextInput] = useState('');
  const [kmlLayerName, setKmlLayerName] = useState('');
  const [kmlColor, setKmlColor] = useState('#8b5cf6');
  const [kmlImportStatus, setKmlImportStatus] = useState<{ type: 'idle' | 'success' | 'error'; message?: string }>({ type: 'idle' });

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    const quilmesBounds = L.latLngBounds(QUILMES_BBOX.southWest, QUILMES_BBOX.northEast);

    const map = L.map(mapContainerRef.current, {
      center: QUILMES_BBOX.center,
      zoom: 13,
      minZoom: 11,
      maxZoom: 19,
      maxBounds: quilmesBounds,
      maxBoundsViscosity: 0.7,
      zoomControl: false
    });

    // Custom Zoom control at top-right
    L.control.zoom({ position: 'topright' }).addTo(map);

    // Standard OpenStreetMap - completely free, NO API KEY REQUIRED, crisp and complete!
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contribuyentes · Municipalidad de Quilmes (Plan 2027)',
      maxZoom: 19
    }).addTo(map);

    // Initialize layer groups in z-order
    maskLayerGroupRef.current = L.layerGroup().addTo(map);
    zonesLayerGroupRef.current = L.layerGroup().addTo(map);
    boundaryLayerGroupRef.current = L.layerGroup().addTo(map);
    corridorsLayerGroupRef.current = L.layerGroup().addTo(map);
    basinsLayerGroupRef.current = L.layerGroup().addTo(map);
    pointsLayerGroupRef.current = L.layerGroup().addTo(map);
    interventionsMarkersRef.current = L.layerGroup().addTo(map);
    customKmlGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // Click handler to register intervention
    map.on('click', (e: L.LeafletMouseEvent) => {
      setClickCoord({ lat: Number(e.latlng.lat.toFixed(5)), lng: Number(e.latlng.lng.toFixed(5)) });
    });

    // Trigger invalidateSize and fit bounds tightly to Quilmes after initial render
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(quilmesBounds, { padding: [20, 20] });
    }, 200);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Invalidate map size whenever sidebar toggles
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [sidebarOpen]);

  // 1. Quilmes Mask Layer (Completely covers neighboring municipalities with solid clean canvas)
  useEffect(() => {
    const maskGroup = maskLayerGroupRef.current;
    const map = mapInstanceRef.current;
    if (!maskGroup || !map) return;
    maskGroup.clearLayers();

    if (isolateQuilmes && layerVisibility.mask) {
      // Create dedicated maskPane above tile layers if it doesn't exist
      if (!map.getPane('maskPane')) {
        const maskPane = map.createPane('maskPane');
        maskPane.style.zIndex = '420';
        maskPane.style.pointerEvents = 'none';
      }

      // Large local bounding box around Greater Buenos Aires to avoid SVG world wrapping bugs
      const outerBox: [number, number][] = [
        [-34.20, -59.30], // NW (north of Tigre / San Fernando)
        [-34.20, -57.20], // NE (deep Río de la Plata)
        [-35.30, -57.20], // SE (south of Magdalena / La Plata)
        [-35.30, -59.30], // SW (southwest of Cañuelas)
        [-34.20, -59.30]  // Close ring
      ];

      // Inner Quilmes hole ring (in [lat, lng])
      const boundaryRing = QUILMES_BOUNDARY_GEOJSON.features[0].geometry.coordinates[0];
      const quilmesHole: [number, number][] = (boundaryRing as [number, number][]).map(c => [c[1], c[0]]);

      // Multi-ring polygon where ring 0 is outer box and ring 1 is the hole of Quilmes
      const maskPolygon = L.polygon([outerBox, quilmesHole], {
        pane: 'maskPane',
        fillColor: '#ffffff', // 100% pure white solid canvas
        fillOpacity: 1.0,     // 100% opaque: completely erases Avellaneda, Lanus, Banfield, Berazategui, Varela!
        stroke: true,
        color: '#6b21a8',     // Crisp institutional violet perimeter boundary
        weight: 3.5,
        opacity: 1.0,
        interactive: false
      });

      maskGroup.addLayer(maskPolygon);
    }
  }, [isolateQuilmes, layerVisibility.mask]);

  // 2. Update Zones Layer (All 86 official zones of the Ciudad de Quilmes matching the municipal GIS)
  useEffect(() => {
    const zonesGroup = zonesLayerGroupRef.current;
    if (!zonesGroup) return;
    zonesGroup.clearLayers();

    if (layerVisibility.zonas) {
      QUILMES_86_ZONES.forEach(zone => {
        const latLngs = zone.coordinates.map(c => [c[1], c[0]] as [number, number]);
        const polygon = L.polygon(latLngs, {
          color: zone.color,
          weight: 1.2,
          fillColor: zone.fillColor,
          fillOpacity: 0.32,
          opacity: 0.85
        });

        polygon.on('click', (e) => {
          L.DomEvent.stopPropagation(e);
          setSelectedZone(zone);
        });

        polygon.bindTooltip(`
          <div style="font-family: system-ui, sans-serif; font-size: 11px; padding: 2px;">
            <strong style="color: #1e1b4b; font-size: 12px;">${zone.name}</strong><br/>
            <span style="color: ${zone.color}; font-weight: 700;">Turno: ${zone.turno}</span><br/>
            <span style="color: #64748b; font-size: 10px;">Recorrido #${zone.recorrido}</span>
          </div>
        `, { sticky: true });

        zonesGroup.addLayer(polygon);
      });
    }
  }, [layerVisibility.zonas]);

  // 3. Update Corridors & Basins
  useEffect(() => {
    const corridorsGroup = corridorsLayerGroupRef.current;
    const basinsGroup = basinsLayerGroupRef.current;
    if (!corridorsGroup || !basinsGroup) return;
    corridorsGroup.clearLayers();
    basinsGroup.clearLayers();

    if (layerVisibility.corredoresPesados) {
      const geoLayer = L.geoJSON(QUILMES_CORRIDORS_GEOJSON as any, {
        style: () => ({
          color: '#d97706',
          weight: 3.5,
          opacity: 0.85
        })
      });
      corridorsGroup.addLayer(geoLayer);
    }

    if (layerVisibility.arroyosCuencas) {
      const geoLayer = L.geoJSON(QUILMES_PLUVIAL_BASINS_GEOJSON as any, {
        style: () => ({
          color: '#0284c7',
          weight: 3.5,
          opacity: 0.85,
          dashArray: '6, 4'
        })
      });
      basinsGroup.addLayer(geoLayer);
    }
  }, [layerVisibility.corredoresPesados, layerVisibility.arroyosCuencas]);

  // 4. Update Municipal Point Features (Sumideros, Baches, Plazas, Bombas, Obradores)
  useEffect(() => {
    const pointsGroup = pointsLayerGroupRef.current;
    if (!pointsGroup) return;
    pointsGroup.clearLayers();

    QUILMES_GIS_POINTS.forEach(point => {
      let isVisible = false;
      let badgeLabel = 'S';
      let iconColor = '#0284c7'; // cyan/blue for sumidero
      let bgColor = '#e0f2fe';

      if (point.type === 'sumidero' && layerVisibility.sumiderosPuntos) {
        isVisible = true;
        badgeLabel = 'S';
        iconColor = '#0284c7';
        bgColor = '#e0f2fe';
      } else if (point.type === 'bache' && layerVisibility.bacheoPuntos) {
        isVisible = true;
        badgeLabel = 'B';
        iconColor = '#ea580c';
        bgColor = '#ffedd5';
      } else if (point.type === 'plaza' && layerVisibility.plazasPuntos) {
        isVisible = true;
        badgeLabel = 'P';
        iconColor = '#16a34a';
        bgColor = '#dcfce7';
      } else if (point.type === 'bomba' && layerVisibility.bombasPuntos) {
        isVisible = true;
        badgeLabel = '⚡';
        iconColor = '#4f46e5';
        bgColor = '#e0e7ff';
      } else if (point.type === 'obrador' && layerVisibility.obradoresPuntos) {
        isVisible = true;
        badgeLabel = '🏢';
        iconColor = '#7c3aed';
        bgColor = '#ede9fe';
      } else if (point.type === 'microbasural' && layerVisibility.microbasurales) {
        isVisible = true;
        badgeLabel = '⚠️';
        iconColor = '#dc2626';
        bgColor = '#fee2e2';
      } else if (point.type === 'voluminoso' && layerVisibility.voluminosos) {
        isVisible = true;
        badgeLabel = '📦';
        iconColor = '#d97706';
        bgColor = '#fef3c7';
      } else if (point.type === 'ecopunto' && layerVisibility.ecopuntos) {
        isVisible = true;
        badgeLabel = '♻️';
        iconColor = '#15803d';
        bgColor = '#dcfce7';
      }

      if (!isVisible) return;

      const customHtmlIcon = L.divIcon({
        className: 'custom-gis-point-marker',
        html: `
          <div style="
            width: 24px; 
            height: 24px; 
            background: ${bgColor}; 
            border: 2px solid ${iconColor}; 
            border-radius: 50%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            font-size: 11px; 
            font-weight: 800; 
            color: ${iconColor}; 
            box-shadow: 0 2px 5px rgba(0,0,0,0.28);
            cursor: pointer;
            transition: transform 0.15s ease;
          " onmouseover="this.style.transform='scale(1.25)'" onmouseout="this.style.transform='scale(1)'">
            ${badgeLabel}
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([point.lat, point.lng], { icon: customHtmlIcon });
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedPoint(point);
      });
      marker.bindTooltip(`
        <div style="font-family: system-ui, sans-serif; font-size: 11px; padding: 2px;">
          <strong style="color: #0f172a;">${point.name}</strong><br/>
          <span style="color: #64748b;">${point.address}</span><br/>
          <span style="color: ${iconColor}; font-weight: 700; text-transform: uppercase; font-size: 10px;">${point.type} · ${point.status}</span>
        </div>
      `, { direction: 'top', offset: [0, -12] });

      pointsGroup.addLayer(marker);
    });
  }, [
    layerVisibility.sumiderosPuntos, 
    layerVisibility.bacheoPuntos, 
    layerVisibility.plazasPuntos, 
    layerVisibility.bombasPuntos, 
    layerVisibility.obradoresPuntos,
    layerVisibility.microbasurales,
    layerVisibility.voluminosos,
    layerVisibility.ecopuntos
  ]);

  // 5. Update Operational Interventions Markers
  useEffect(() => {
    const markersGroup = interventionsMarkersRef.current;
    if (!markersGroup) return;
    markersGroup.clearLayers();

    if (!layerVisibility.intervenciones) return;

    // Filter by active category pill
    const filteredInterventions = interventions.filter(item => {
      if (activeCategoryFilter === 'todos') return true;
      if (activeCategoryFilter === 'bacheo') return item.category === 'Bacheo' || item.category === 'Reparación de calzadas' || item.category === 'Mantenimiento vial';
      if (activeCategoryFilter === 'sumideros') return item.category === 'Sumideros y bocas de tormenta';
      if (activeCategoryFilter === 'pluviales') return item.category === 'Drenajes pluviales';
      if (activeCategoryFilter === 'plazas') return item.category === 'Plazas y espacios públicos' || item.category === 'Mobiliario urbano';
      if (activeCategoryFilter === 'fumigacion') return item.category === 'Fumigación' || item.category === 'Saneamiento';
      return true;
    });

    filteredInterventions.forEach(item => {
      if (!item.coordinates) return;

      let pinColor = '#7c3aed';
      if (item.priority === 'Crítica') pinColor = '#dc2626';
      else if (item.priority === 'Alta') pinColor = '#ea580c';
      else if (item.priority === 'Media') pinColor = '#0891b2';
      else if (item.priority === 'Baja') pinColor = '#16a34a';

      const markerHtml = `
        <div style="
          width: 28px;
          height: 28px;
          background-color: ${pinColor};
          border: 2px solid #ffffff;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        ">
          <div style="
            transform: rotate(45deg);
            width: 8px;
            height: 8px;
            background: white;
            border-radius: 50%;
          "></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-intervention-pin',
        html: markerHtml,
        iconSize: [28, 28],
        iconAnchor: [14, 28]
      });

      const marker = L.marker([item.coordinates.lat, item.coordinates.lng], { icon: customIcon });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setSelectedInterventionItem(item);
      });

      marker.bindTooltip(`
        <div style="font-family: system-ui, sans-serif; font-size: 11px;">
          <strong>#${item.id}</strong> · ${item.category}<br/>
          <span style="color: #64748b;">${item.address}</span><br/>
          <span style="color: ${pinColor}; font-weight: 700;">${item.priority} · ${item.status}</span>
        </div>
      `, { offset: [0, -20] });

      markersGroup.addLayer(marker);
    });
  }, [interventions, activeCategoryFilter, layerVisibility.intervenciones]);

  // 6. Update Custom KML Layers
  useEffect(() => {
    const customGroup = customKmlGroupRef.current;
    if (!customGroup) return;
    customGroup.clearLayers();

    customKmlLayers.forEach(layer => {
      if (!layer.visible || !layer.geoJson) return;

      try {
        const geoLayer = L.geoJSON(layer.geoJson as any, {
          filter: (feature) => {
            return Boolean(feature && feature.geometry && feature.geometry.type);
          },
          style: () => ({
            color: layer.color || '#8b5cf6',
            weight: 3.5,
            fillColor: layer.color || '#8b5cf6',
            fillOpacity: 0.35,
            opacity: 0.95
          }),
          pointToLayer: (_feature, latlng) => {
            const markerHtml = `
              <div style="
                width: 22px;
                height: 22px;
                background-color: ${layer.color || '#8b5cf6'};
                border: 2px solid #ffffff;
                border-radius: 50%;
                box-shadow: 0 2px 6px rgba(0,0,0,0.35);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
              ">
                <div style="width: 7px; height: 7px; background: white; border-radius: 50%;"></div>
              </div>
            `;
            const icon = L.divIcon({
              className: 'custom-kml-point',
              html: markerHtml,
              iconSize: [22, 22],
              iconAnchor: [11, 11]
            });
            return L.marker(latlng, { icon });
          },
          onEachFeature: (feature, l) => {
            const props = feature.properties || {};
            const title = props.name || props.nombre || props.Name || 'Elemento KML';
            const desc = props.description || props.descripcion || '';
            l.bindPopup(`
              <div style="font-size: 12px; font-family: system-ui, sans-serif; max-width: 260px; line-height: 1.4;">
                <div style="font-weight: 700; color: ${layer.color || '#4c1d95'}; margin-bottom: 4px; border-bottom: 1px solid #f1f5f9; padding-bottom: 4px;">
                  ${title}
                </div>
                ${desc ? `<div style="color: #334155; font-size: 11px; max-height: 180px; overflow-y: auto;">${desc}</div>` : ''}
                <div style="margin-top: 6px; font-size: 10px; color: #94a3b8; font-family: monospace;">
                  Capa: ${layer.name}
                </div>
              </div>
            `);
          }
        });

        customGroup.addLayer(geoLayer);
      } catch (err) {
        console.error('Error al agregar capa KML a Leaflet:', err);
      }
    });
  }, [customKmlLayers]);

  // Search Address / Point
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    const query = searchQuery.toLowerCase().trim();

    // Check zones
    const matchedZone = QUILMES_86_ZONES.find(z => 
      z.name.toLowerCase().includes(query) || z.turno.toLowerCase().includes(query)
    );
    if (matchedZone) {
      const center = matchedZone.coordinates[0];
      mapInstanceRef.current.flyTo([center[1], center[0]], 15, { duration: 1 });
      setSelectedZone(matchedZone);
      return;
    }

    // Check GIS Points
    const matchedPoint = QUILMES_GIS_POINTS.find(p => 
      p.name.toLowerCase().includes(query) || p.address.toLowerCase().includes(query)
    );
    if (matchedPoint) {
      mapInstanceRef.current.flyTo([matchedPoint.lat, matchedPoint.lng], 16, { duration: 1 });
      setSelectedPoint(matchedPoint);
      return;
    }

    // Check Interventions
    const matchedIntervention = interventions.find(i => 
      i.id.toLowerCase().includes(query) || 
      i.address.toLowerCase().includes(query) || 
      i.neighborhood.toLowerCase().includes(query) ||
      i.title.toLowerCase().includes(query)
    );
    if (matchedIntervention && matchedIntervention.coordinates) {
      mapInstanceRef.current.flyTo([matchedIntervention.coordinates.lat, matchedIntervention.coordinates.lng], 16, { duration: 1 });
      setSelectedInterventionItem(matchedIntervention);
      return;
    }

    // Known Quilmes Landmarks
    const landmarks: Record<string, [number, number]> = {
      'mitre': [-34.7225, -58.2570],
      'alsina': [-34.7225, -58.2570],
      'solano': [-34.7730, -58.3180],
      '844': [-34.7730, -58.3180],
      'bernal': [-34.7080, -58.2790],
      'ezpeleta': [-34.7460, -58.2380],
      'calchaqui': [-34.7350, -58.2830],
      'ribera': [-34.7140, -58.2380],
      'la florida': [-34.7700, -58.3150]
    };

    for (const [key, coords] of Object.entries(landmarks)) {
      if (query.includes(key)) {
        mapInstanceRef.current.flyTo(coords, 15, { duration: 1 });
        return;
      }
    }
  };

  // Reset to full view of Quilmes
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(QUILMES_BBOX.center, 13, { duration: 1 });
    }
  };

  // Handle KML / KMZ / GeoJSON File Upload
  const handleKmlFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setKmlImportStatus({ type: 'idle', message: 'Leyendo y validando capa geográfica...' });
      const result = await parseUploadedGisFile(file, kmlLayerName);

      if (!result.success || !result.geoJson) {
        setKmlImportStatus({ 
          type: 'error', 
          message: result.error || 'No se pudieron extraer geometrías válidas del archivo.' 
        });
        return;
      }

      const layerTitle = kmlLayerName.trim() || result.name || file.name.replace(/\.[^/.]+$/, '');
      const newLayer = {
        id: `kml-${Date.now()}`,
        name: layerTitle,
        color: kmlColor,
        geoJson: result.geoJson, // Pristine GeoJSON FeatureCollection
        visible: true,
        count: result.featureCount
      };

      setCustomKmlLayers(prev => [...prev, newLayer]);
      setKmlImportStatus({ 
        type: 'success', 
        message: `¡Capa "${layerTitle}" importada con éxito! (${result.featureCount} elementos espaciales añadidos).` 
      });

      // Zoom to new layer
      if (mapInstanceRef.current && result.geoJson) {
        try {
          const tempLayer = L.geoJSON(result.geoJson as any);
          const bounds = tempLayer.getBounds();
          if (bounds.isValid()) {
            mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
          }
        } catch (fitErr) {
          console.warn('No se pudo auto-centrar en la capa:', fitErr);
        }
      }
    } catch (err: any) {
      setKmlImportStatus({ 
        type: 'error', 
        message: `Error al procesar el archivo: ${err?.message || 'Formato no compatible'}` 
      });
    }
  };

  // Handle KML / GeoJSON Text Paste
  const handleKmlTextSubmit = () => {
    if (!kmlTextInput.trim()) return;
    try {
      const trimmed = kmlTextInput.trim();
      let result;
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        result = parseGeoJsonString(trimmed, kmlLayerName || 'Capa GeoJSON');
      } else {
        result = parseKmlStringToGeoJson(trimmed, kmlLayerName || 'Capa KML Google Maps');
      }

      if (!result.success || !result.geoJson) {
        setKmlImportStatus({ 
          type: 'error', 
          message: result.error || 'No se encontraron geometrías en el texto provisto.' 
        });
        return;
      }

      const layerTitle = kmlLayerName.trim() || result.name || 'Capa KML Google Maps';
      const newLayer = {
        id: `kml-${Date.now()}`,
        name: layerTitle,
        color: kmlColor,
        geoJson: result.geoJson,
        visible: true,
        count: result.featureCount
      };

      setCustomKmlLayers(prev => [...prev, newLayer]);
      setKmlImportStatus({ 
        type: 'success', 
        message: `¡Capa "${layerTitle}" agregada con éxito! (${result.featureCount} elementos).` 
      });
      setKmlTextInput('');

      if (mapInstanceRef.current && result.geoJson) {
        try {
          const tempLayer = L.geoJSON(result.geoJson as any);
          const bounds = tempLayer.getBounds();
          if (bounds.isValid()) {
            mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
          }
        } catch (fitErr) {
          console.warn('No se pudo auto-centrar:', fitErr);
        }
      }
    } catch (err: any) {
      setKmlImportStatus({ 
        type: 'error', 
        message: `Error al interpretar el texto: ${err?.message || 'Formato inválido'}` 
      });
    }
  };

  // Export current layers as GeoJSON
  const handleExportGeoJson = () => {
    const exportData = {
      type: "FeatureCollection",
      municipio: "Quilmes",
      secretaria: "Servicios Públicos",
      fecha: new Date().toISOString(),
      zones: QUILMES_86_ZONES,
      points: QUILMES_GIS_POINTS,
      interventions: interventions.filter(i => i.coordinates)
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quilmes360-gis-${new Date().toISOString().split('T')[0]}.geojson`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden bg-slate-50 font-sans">
      
      {/* 1. Single Streamlined Header Toolbar (Official Quilmes Violet & Green) */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 flex items-center justify-between gap-2 sm:gap-4 shrink-0 z-30 shadow-xs">
        
        {/* Official Institutional Brand */}
        <div className="shrink-0">
          <QuilmesLogo size="sm" showText={true} />
        </div>

        {/* Unified Search & Quick Category Filters */}
        <div className="flex-1 max-w-2xl mx-1 sm:mx-2 flex items-center gap-2">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-purple-700" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar barrio, calle o punto crítico (ej: Bernal, 162, Conesa)..."
              className="w-full text-xs pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Compact Category Selector in the same row */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
            {[
              { id: 'todos', label: 'Todas (88)' },
              { id: 'ribera', label: '🌊 Costa' },
              { id: 'microbasurales', label: '⚠️ Microbasurales' },
              { id: 'voluminosos', label: '📦 Voluminosos' },
              { id: 'bacheo', label: '🚧 Bacheo' },
              { id: 'sumideros', label: '💧 Sumideros' }
            ].map(filter => (
              <button
                key={filter.id}
                type="button"
                onClick={() => {
                  setActiveCategoryFilter(filter.id);
                  if (filter.id === 'ribera') {
                    const riberaZone = QUILMES_86_ZONES.find(z => z.id === 'z_ribera_bernal');
                    if (riberaZone && mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([-34.710, -58.245], 13.5, { duration: 0.8 });
                      setSelectedZone(riberaZone);
                    }
                  }
                }}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  activeCategoryFilter === filter.id
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Essential Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          
          {/* Toggle Solo Quilmes */}
          <button
            type="button"
            onClick={() => setIsolateQuilmes(!isolateQuilmes)}
            title="Aislar Partido de Quilmes"
            className={`px-2 py-1 text-xs font-bold rounded-lg flex items-center gap-1 border transition-colors ${
              isolateQuilmes 
                ? 'bg-purple-900 text-white border-purple-950 shadow-xs' 
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            <span className="hidden sm:inline">Solo Quilmes</span>
          </button>

          {/* Download Standalone HTML Pilot */}
          <a
            href="/quilmes_piloto.html"
            download="quilmes-360-piloto.html"
            title="Descargar mapa piloto en un único archivo HTML para presentar offline o compartir"
            className="px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Piloto HTML</span>
          </a>

          {/* Import KML Button */}
          <button
            type="button"
            onClick={() => setKmlModalOpen(true)}
            title="Cargar capas KML / GeoJSON"
            className="p-1.5 text-purple-950 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-purple-700" />
          </button>

          {/* Print Button */}
          <button
            type="button"
            onClick={() => window.print()}
            title="Imprimir mapa"
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors hidden sm:block"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Main Workspace: Sidebar Drawer + Map Canvas */}
      <div className="relative flex-1 flex overflow-hidden">

        {/* Floating Didactic Quick Atajos (Zero screen height lost) */}
        {didacticMode && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md border border-purple-200/90 rounded-full px-3 py-1 shadow-md flex items-center gap-2 max-w-[95vw] overflow-x-auto text-[11px]">
            <span className="font-extrabold text-purple-950 flex items-center gap-1 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Atajos:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto">
              {[
                { label: '🌊 Bernal Ribera', query: 'ribera de bernal', zoneId: 'z_ribera_bernal' },
                { label: '🏖️ Ezpeleta Ribera', query: 'ribera del uno', zoneId: 'z_ribera_uno' },
                { label: '⚠️ Microbasural 162', query: 'calle 162' },
                { label: '⚠️ Pedemonte', query: 'pedemonte' },
                { label: '📦 Voluminosos Don Bosco', query: 'don bosco' },
                { label: '📍 Plaza Conesa', query: 'plaza conesa' },
                { label: '🏛️ Quilmes Centro', query: 'quilmes centro' }
              ].map(chip => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setSearchQuery(chip.query);
                    if (chip.zoneId) {
                      const matched = QUILMES_86_ZONES.find(z => z.id === chip.zoneId);
                      if (matched && mapInstanceRef.current) {
                        const c = matched.coordinates[0];
                        mapInstanceRef.current.flyTo([c[1], c[0]], 14.5, { duration: 0.8 });
                        setSelectedZone(matched);
                        return;
                      }
                    }
                    const q = chip.query.toLowerCase();
                    const point = QUILMES_GIS_POINTS.find(p => p.name.toLowerCase().includes(q) || p.address.toLowerCase().includes(q));
                    if (point && mapInstanceRef.current) {
                      mapInstanceRef.current.flyTo([point.lat, point.lng], 16, { duration: 0.8 });
                      setSelectedPoint(point);
                    }
                  }}
                  className="px-2 py-0.5 rounded-full bg-slate-100 hover:bg-emerald-100 hover:text-emerald-950 text-slate-700 font-semibold border border-slate-200 whitespace-nowrap transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setDidacticMode(false)}
              className="text-slate-400 hover:text-slate-700 pl-1 font-bold text-xs shrink-0"
              title="Ocultar atajos flotantes"
            >
              ✕
            </button>
          </div>
        )}

        {/* Collapsible Left GIS Sidebar */}
        {sidebarOpen && (
          <aside className="w-72 sm:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto z-20 shadow-xs">
            
            {/* Sidebar Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 px-3 py-2 text-xs font-semibold bg-slate-50">
              <button
                type="button"
                onClick={() => setSidebarTab('capas')}
                className={`pb-1 px-1.5 border-b-2 transition-colors flex flex-col items-center ${
                  sidebarTab === 'capas' ? 'border-purple-800 text-purple-950 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4 mb-0.5" />
                <span>Capas</span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarTab('dia')}
                className={`pb-1 px-1.5 border-b-2 transition-colors flex flex-col items-center ${
                  sidebarTab === 'dia' ? 'border-purple-800 text-purple-950 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-4 h-4 mb-0.5" />
                <span>Día</span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarTab('cuadrillas')}
                className={`pb-1 px-1.5 border-b-2 transition-colors flex flex-col items-center ${
                  sidebarTab === 'cuadrillas' ? 'border-purple-800 text-purple-950 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Users className="w-4 h-4 mb-0.5" />
                <span>Cuadrillas</span>
              </button>

              <button
                type="button"
                onClick={() => setSidebarTab('analisis')}
                className={`pb-1 px-1.5 border-b-2 transition-colors flex flex-col items-center ${
                  sidebarTab === 'analisis' ? 'border-purple-800 text-purple-950 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <BarChart2 className="w-4 h-4 mb-0.5" />
                <span>Análisis</span>
              </button>
            </div>

            {/* Tab 1: CAPAS */}
            {sidebarTab === 'capas' && (
              <div className="p-3 space-y-4 text-xs">
                
                {/* Compliance Card */}
                <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between font-bold text-purple-950">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-purple-700" />
                      Plan Municipal Quilmes 2027
                    </span>
                    <span className="font-mono text-[10px] bg-purple-200 text-purple-950 px-1.5 py-0.5 rounded font-bold">
                      ACTIVO
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-900/80">
                    Supervisión integral de las 11 delegaciones territoriales sin mezcla con recolección domiciliaria GIRSU.
                  </p>
                  <label className="flex items-center gap-2 text-[11px] text-purple-950 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={isolateQuilmes}
                      onChange={(e) => setIsolateQuilmes(e.target.checked)}
                      className="rounded text-purple-900 focus:ring-purple-800"
                    />
                    <span className="font-semibold">Aislar polígono oficial de Quilmes</span>
                  </label>
                </div>

                {/* ZONIFICACIÓN DE LA CIUDAD DE QUILMES */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1 font-bold text-slate-700">
                      <span className="w-2 h-2 rounded-full bg-purple-700 inline-block"></span>
                      MAPA DE LA CIUDAD DE QUILMES
                    </span>
                    <span className="font-mono text-[10px] text-purple-900 bg-purple-100 font-bold px-1.5 py-0.2 rounded">88 Zonas</span>
                  </div>
                  <div className="space-y-1.5">
                    
                    {/* 88 Zonas de la Ciudad */}
                    <div className="p-2 rounded-lg border border-purple-200 bg-purple-50/40 hover:bg-purple-50 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLayerVisibility(p => ({ ...p, zonas: !p.zonas }))}
                          className="text-purple-700 hover:text-purple-900"
                        >
                          {layerVisibility.zonas ? <Eye className="w-4 h-4 text-purple-700" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                        </button>
                        <div>
                          <div className="font-bold text-slate-900">88 Zonas Territoriales</div>
                          <div className="text-[10px] text-slate-500">Mosaico 100% oficial con Costa y Ribera</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-purple-200 text-purple-950 rounded">88</span>
                    </div>

                    {/* Accesos a zonas costeras completadas */}
                    <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          const z = QUILMES_86_ZONES.find(item => item.id === 'z_ribera_bernal');
                          if (z && mapInstanceRef.current) {
                            mapInstanceRef.current.flyTo([-34.698, -58.272], 14, { duration: 0.8 });
                            setSelectedZone(z);
                          }
                        }}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-left transition-colors"
                      >
                        <div className="text-[10px] font-bold text-emerald-900 flex items-center gap-1">
                          <span>🌊</span> Bernal Ribera
                        </div>
                        <div className="text-[9px] text-emerald-700">Reserva y Costa</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const z = QUILMES_86_ZONES.find(item => item.id === 'z_ribera_uno');
                          if (z && mapInstanceRef.current) {
                            mapInstanceRef.current.flyTo([-34.750, -58.225], 14, { duration: 0.8 });
                            setSelectedZone(z);
                          }
                        }}
                        className="p-1.5 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg text-left transition-colors"
                      >
                        <div className="text-[10px] font-bold text-sky-900 flex items-center gap-1">
                          <span>🏖️</span> Ribera del Uno
                        </div>
                        <div className="text-[9px] text-sky-700">Ezpeleta Ribera</div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* SANEAMIENTO Y PUNTOS CRÍTICOS (GIRSU & AMBIENTE) */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500 inline-block"></span>
                    SANEAMIENTO Y PUNTOS CRÍTICOS
                  </div>
                  <div className="space-y-1.5">

                    {/* Microbasurales */}
                    <div className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLayerVisibility(p => ({ ...p, microbasurales: !p.microbasurales }))}
                          className="text-slate-400 hover:text-rose-700"
                        >
                          {layerVisibility.microbasurales ? <Eye className="w-4 h-4 text-rose-600" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="font-semibold text-slate-800">Microbasurales Críticos</div>
                          <div className="text-[10px] text-slate-500">Calle 162, Pedemonte, Mauriño</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-rose-50 text-rose-800 rounded">
                        {QUILMES_GIS_POINTS.filter(p => p.type === 'microbasural').length}
                      </span>
                    </div>

                    {/* Voluminosos */}
                    <div className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLayerVisibility(p => ({ ...p, voluminosos: !p.voluminosos }))}
                          className="text-slate-400 hover:text-amber-700"
                        >
                          {layerVisibility.voluminosos ? <Eye className="w-4 h-4 text-amber-600" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="font-semibold text-slate-800">Residuos Voluminosos (Sectores S)</div>
                          <div className="text-[10px] text-slate-500">Montículos y ramas programados</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-amber-50 text-amber-800 rounded">
                        {QUILMES_GIS_POINTS.filter(p => p.type === 'voluminoso').length}
                      </span>
                    </div>

                    {/* Ecopuntos */}
                    <div className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLayerVisibility(p => ({ ...p, ecopuntos: !p.ecopuntos }))}
                          className="text-slate-400 hover:text-emerald-700"
                        >
                          {layerVisibility.ecopuntos ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="font-semibold text-slate-800">Ecopuntos y Puntos Verdes</div>
                          <div className="text-[10px] text-slate-500">Recepción de reciclables</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 rounded">
                        {QUILMES_GIS_POINTS.filter(p => p.type === 'ecopunto').length}
                      </span>
                    </div>

                  </div>
                </div>

                {/* Group 1: VIALIDAD Y CALZADAS */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
                    VIALIDAD Y CALZADAS
                  </div>
                  <div className="space-y-1.5">

                    {/* Baches Relevados */}
                    <div className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLayerVisibility(p => ({ ...p, bacheoPuntos: !p.bacheoPuntos }))}
                          className="text-slate-400 hover:text-amber-700"
                        >
                          {layerVisibility.bacheoPuntos ? <Eye className="w-4 h-4 text-amber-600" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="font-semibold text-slate-800">Baches y Losas en Obra</div>
                          <div className="text-[10px] text-slate-500">Hormigonado y asfalto en caliente</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-amber-50 text-amber-800 rounded">
                        {QUILMES_GIS_POINTS.filter(p => p.type === 'bache').length}
                      </span>
                    </div>

                    {/* Corredores de Tránsito Pesado */}
                    <div className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLayerVisibility(p => ({ ...p, corredoresPesados: !p.corredoresPesados }))}
                          className="text-slate-400 hover:text-amber-700"
                        >
                          {layerVisibility.corredoresPesados ? <Eye className="w-4 h-4 text-amber-600" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="font-semibold text-slate-800">Corredores Viales Prioritarios</div>
                          <div className="text-[10px] text-slate-500">Av. Calchaquí, Mitre, 844</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-slate-100 text-slate-700 rounded">3</span>
                    </div>
                  </div>
                </div>

                {/* Group 2: HIDRÁULICA Y PLUVIALES */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block"></span>
                    HIDRÁULICA Y DRENAJES
                  </div>
                  <div className="space-y-1.5">
                    
                    {/* Sumideros */}
                    <div className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLayerVisibility(p => ({ ...p, sumiderosPuntos: !p.sumiderosPuntos }))}
                          className="text-slate-400 hover:text-cyan-700"
                        >
                          {layerVisibility.sumiderosPuntos ? <Eye className="w-4 h-4 text-cyan-600" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="font-semibold text-slate-800">Sumideros y Bocas de Tormenta</div>
                          <div className="text-[10px] text-slate-500">Cámaras y rejas pluviales</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-cyan-50 text-cyan-800 rounded">
                        {QUILMES_GIS_POINTS.filter(p => p.type === 'sumidero').length}
                      </span>
                    </div>

                    {/* Cuencas Hídricas */}
                    <div className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLayerVisibility(p => ({ ...p, arroyosCuencas: !p.arroyosCuencas }))}
                          className="text-slate-400 hover:text-blue-700"
                        >
                          {layerVisibility.arroyosCuencas ? <Eye className="w-4 h-4 text-blue-600" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="font-semibold text-slate-800">Arroyos Las Piedras y San Francisco</div>
                          <div className="text-[10px] text-slate-500">Cuencas críticas contra anegamientos</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-blue-50 text-blue-800 rounded">2</span>
                    </div>

                    {/* Estaciones de Bombeo */}
                    <div className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLayerVisibility(p => ({ ...p, bombasPuntos: !p.bombasPuntos }))}
                          className="text-slate-400 hover:text-indigo-700"
                        >
                          {layerVisibility.bombasPuntos ? <Eye className="w-4 h-4 text-indigo-600" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="font-semibold text-slate-800">Estaciones de Bombeo Pluvial</div>
                          <div className="text-[10px] text-slate-500">Ribera, Bernal y Solano</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-indigo-50 text-indigo-800 rounded">
                        {QUILMES_GIS_POINTS.filter(p => p.type === 'bomba').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Group 3: ESPACIOS PÚBLICOS & OBRADORES */}
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    ESPACIOS PÚBLICOS & LOGÍSTICA
                  </div>
                  <div className="space-y-1.5">
                    
                    {/* Plazas */}
                    <div className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLayerVisibility(p => ({ ...p, plazasPuntos: !p.plazasPuntos }))}
                          className="text-slate-400 hover:text-emerald-700"
                        >
                          {layerVisibility.plazasPuntos ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="font-semibold text-slate-800">Plazas y Paseos Barriales</div>
                          <div className="text-[10px] text-slate-500">Mantenimiento de canteros y césped</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-emerald-50 text-emerald-800 rounded">
                        {QUILMES_GIS_POINTS.filter(p => p.type === 'plaza').length}
                      </span>
                    </div>

                    {/* Obradores Centrales */}
                    <div className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 flex items-center justify-between transition-colors">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setLayerVisibility(p => ({ ...p, obradoresPuntos: !p.obradoresPuntos }))}
                          className="text-slate-400 hover:text-purple-700"
                        >
                          {layerVisibility.obradoresPuntos ? <Eye className="w-4 h-4 text-purple-700" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <div>
                          <div className="font-semibold text-slate-800">Bases y Obradores Operativos</div>
                          <div className="text-[10px] text-slate-500">Parque automotor y despacho</div>
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-purple-50 text-purple-900 rounded">
                        {QUILMES_GIS_POINTS.filter(p => p.type === 'obrador').length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Custom KML Layers Section */}
                {customKmlLayers.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-purple-600 inline-block"></span>
                      CAPAS KML PERSONALIZADAS
                    </div>
                    <div className="space-y-1.5">
                      {customKmlLayers.map(kml => (
                        <div key={kml.id} className="p-2 bg-purple-50/50 border border-purple-200 rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setCustomKmlLayers(prev => prev.map(l => l.id === kml.id ? { ...l, visible: !l.visible } : l));
                              }}
                              className="text-purple-700"
                            >
                              {kml.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
                            </button>
                            <span className="font-medium text-slate-800 truncate max-w-[140px]">{kml.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCustomKmlLayers(prev => prev.filter(l => l.id !== kml.id))}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: DÍA */}
            {sidebarTab === 'dia' && (
              <div className="p-3 space-y-3 text-xs">
                <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="font-bold text-purple-950">Agenda del Día</div>
                  <div className="text-[11px] text-purple-800">Intervenciones activas y planificadas</div>
                </div>
                <div className="space-y-2">
                  {interventions.slice(0, 6).map(i => (
                    <div
                      key={i.id}
                      onClick={() => setSelectedInterventionItem(i)}
                      className="p-2 bg-slate-50 hover:bg-purple-50 rounded-lg border border-slate-200 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between font-mono text-[11px]">
                        <span className="font-bold text-purple-950">#{i.id}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-white border border-slate-200 text-slate-700">
                          {i.priority}
                        </span>
                      </div>
                      <div className="text-xs font-medium text-slate-800 mt-1">{i.category}</div>
                      <div className="text-[11px] text-slate-500 truncate">{i.address}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: ZONAS Y CUADRILLAS */}
            {sidebarTab === 'cuadrillas' && (
              <div className="p-3 space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">88 Zonas de la Ciudad</span>
                  <span className="text-[10px] font-mono text-purple-900 bg-purple-100 px-1.5 py-0.5 rounded font-bold">100% Cobertura</span>
                </div>
                <div className="space-y-1.5 max-h-[480px] overflow-y-auto pr-1">
                  {QUILMES_86_ZONES.map(zone => (
                    <div 
                      key={zone.id} 
                      onClick={() => {
                        setSelectedZone(zone);
                        const center = zone.coordinates[0];
                        if (center && mapInstanceRef.current) {
                          mapInstanceRef.current.flyTo([center[1], center[0]], 15, { duration: 0.8 });
                        }
                      }}
                      className="p-2 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/15" 
                          style={{ backgroundColor: zone.color }} 
                        />
                        <div>
                          <div className="font-semibold text-slate-800">{zone.name}</div>
                          <div className="text-[10px] text-slate-500">Recorrido #{zone.recorrido}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: zone.fillColor, color: '#1e1b4b' }}>
                        {zone.turno}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: ANÁLISIS */}
            {sidebarTab === 'analisis' && (
              <div className="p-3 space-y-3 text-xs">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <div className="font-bold text-slate-800">Cobertura Territorial</div>
                  <div className="text-[11px] text-slate-500">Área Oficial: 125 km²</div>
                  <div className="text-[11px] text-slate-500">Población beneficiada: ~700.000 hab.</div>
                </div>
                <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg space-y-1">
                  <div className="font-bold text-purple-950">Turnos Operativos</div>
                  <div className="text-[11px] text-slate-600">• Mañana: 06:00 a 14:00 hs</div>
                  <div className="text-[11px] text-slate-600">• Tarde: 14:00 a 22:00 hs</div>
                  <div className="text-[11px] text-slate-600">• Noche: 22:00 a 06:00 hs (Avenidas céntricas)</div>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Toggle Sidebar Button */}
        <button
          type="button"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title={sidebarOpen ? "Ocultar panel de capas" : "Mostrar panel de capas"}
          className="absolute top-3 left-3 z-30 w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-purple-900 hover:bg-slate-50 transition-colors"
          style={{ left: sidebarOpen ? 'calc(18rem + 12px)' : '12px' }}
        >
          {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {/* Reset View Button */}
        <button
          type="button"
          onClick={handleResetView}
          title="Centrar en Partido de Quilmes"
          className="absolute top-14 right-3 z-20 w-8 h-8 rounded-lg bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-700 hover:text-purple-900 hover:bg-slate-50 transition-colors"
        >
          <Home className="w-4 h-4" />
        </button>

        {/* Map Canvas Container */}
        <div ref={mapContainerRef} className="flex-1 w-full h-full z-10 bg-slate-100" />

        {/* 4. Click on Map: Action to register intervention */}
        {clickCoord && (
          <div className="absolute top-4 left-4 right-4 sm:right-auto sm:w-80 bg-white/95 backdrop-blur-sm border border-purple-300 rounded-xl p-3 shadow-xl z-30 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-purple-950 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-purple-700" />
                Punto Seleccionado
              </span>
              <button
                type="button"
                onClick={() => setClickCoord(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-1 font-mono text-[11px] text-slate-700 bg-slate-50 p-1.5 rounded border border-slate-200">
              Lat: {clickCoord.lat} | Lng: {clickCoord.lng}
            </div>
            <button
              type="button"
              onClick={() => {
                onOpenNewModalWithCoords(clickCoord.lat, clickCoord.lng);
                setClickCoord(null);
              }}
              className="mt-2 w-full py-1.5 bg-purple-900 hover:bg-purple-950 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Registrar intervención aquí
            </button>
          </div>
        )}

        {/* 5. Selected Zone Drawer / Card */}
        {selectedZone && (
          <div className="absolute top-4 right-4 sm:w-80 bg-white/95 backdrop-blur-sm border border-purple-300 rounded-xl p-3.5 shadow-xl z-20 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-purple-950 bg-purple-100 px-2 py-0.5 rounded border border-purple-200">
                {selectedZone.name} · Turno {selectedZone.turno}
              </span>
              <button
                type="button"
                onClick={() => setSelectedZone(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h4 className="mt-1 text-sm font-bold text-slate-900">{selectedZone.name} · Ciudad de Quilmes</h4>
            <div className="mt-1.5 flex items-center gap-1.5">
              <span 
                className="w-3 h-3 rounded-full inline-block border border-black/20" 
                style={{ backgroundColor: selectedZone.color }} 
              />
              <span className="text-xs font-semibold text-slate-700">Turno de Operaciones: {selectedZone.turno}</span>
            </div>
            <div className="mt-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1">
              <div><strong className="text-slate-700">Recorrido asignado:</strong> #{selectedZone.recorrido}</div>
              <div><strong className="text-slate-700">Delimitación cartográfica:</strong> {selectedZone.coordinates.length} vértices oficiales</div>
              <div><strong className="text-slate-700">Jurisdicción:</strong> Municipalidad de Quilmes</div>
            </div>
            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const center = selectedZone.coordinates[0];
                  if (center && mapInstanceRef.current) {
                    mapInstanceRef.current.flyTo([center[1], center[0]], 15, { duration: 0.8 });
                  }
                }}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Centrar en mapa
              </button>
              <button
                type="button"
                onClick={() => {
                  const center = selectedZone.coordinates[0];
                  if (center) {
                    onOpenNewModalWithCoords(center[1], center[0], selectedZone.name);
                  }
                }}
                className="flex-1 py-1.5 bg-purple-900 hover:bg-purple-950 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Intervención
              </button>
            </div>
          </div>
        )}

        {/* 6. Selected GIS Point Card (Didactic) */}
        {selectedPoint && (
          <div className="absolute bottom-6 right-4 sm:w-84 bg-white/98 backdrop-blur-md border border-slate-300 rounded-2xl p-4 shadow-2xl z-30 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase flex items-center gap-1 ${
                selectedPoint.type === 'microbasural' ? 'bg-rose-100 text-rose-900 border-rose-300' :
                selectedPoint.type === 'voluminoso' ? 'bg-amber-100 text-amber-900 border-amber-300' :
                selectedPoint.type === 'ecopunto' ? 'bg-emerald-100 text-emerald-900 border-emerald-300' :
                selectedPoint.type === 'sumidero' ? 'bg-cyan-100 text-cyan-900 border-cyan-300' :
                selectedPoint.type === 'bache' ? 'bg-orange-100 text-orange-900 border-orange-300' :
                'bg-purple-100 text-purple-900 border-purple-300'
              }`}>
                <span>{
                  selectedPoint.type === 'microbasural' ? '⚠️ Microbasural' :
                  selectedPoint.type === 'voluminoso' ? '📦 Voluminosos' :
                  selectedPoint.type === 'ecopunto' ? '♻️ Ecopunto' :
                  selectedPoint.type === 'sumidero' ? '💧 Sumidero' :
                  selectedPoint.type === 'bache' ? '🚧 Bacheo' :
                  selectedPoint.type === 'plaza' ? '🌳 Espacio Verde' : '⚡ Infraestructura'
                }</span>
                <span>· {selectedPoint.id}</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedPoint(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h4 className="mt-2 text-sm font-bold text-slate-900">{selectedPoint.name}</h4>
            <p className="text-xs text-slate-600 mt-0.5">{selectedPoint.address}</p>
            <div className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div className="font-medium text-slate-700">{selectedPoint.details}</div>
              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                <span>Estado: <strong className="text-purple-900 uppercase">{selectedPoint.status.replace('_', ' ')}</strong></span>
                <span>•</span>
                <span>Zona: {selectedPoint.zonaId}</span>
              </div>
            </div>
            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  mapInstanceRef.current?.flyTo([selectedPoint.lat, selectedPoint.lng], 17, { duration: 0.8 });
                }}
                className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                Centrar punto
              </button>
              <button
                type="button"
                onClick={() => onOpenNewModalWithCoords(selectedPoint.lat, selectedPoint.lng, selectedPoint.address)}
                className="flex-1 py-1.5 bg-purple-900 hover:bg-purple-950 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Nueva tarea
              </button>
            </div>
          </div>
        )}

        {/* 7. Selected Intervention Card */}
        {selectedInterventionItem && (
          <div className="absolute bottom-6 right-4 sm:w-80 bg-white border border-slate-200 rounded-xl p-3.5 shadow-xl z-20 animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-purple-900 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                #{selectedInterventionItem.id}
              </span>
              <button
                type="button"
                onClick={() => setSelectedInterventionItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h4 className="mt-1 text-sm font-bold text-slate-900">{selectedInterventionItem.category}</h4>
            <p className="text-xs text-slate-600">{selectedInterventionItem.address} · {selectedInterventionItem.neighborhood}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-50 text-amber-800 border border-amber-200">
                {selectedInterventionItem.priority}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-purple-50 text-purple-900 border border-purple-200">
                {selectedInterventionItem.status}
              </span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => onSelectIntervention(selectedInterventionItem.id)}
                className="px-3 py-1 bg-purple-900 hover:bg-purple-950 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Ver Ficha Completa
              </button>
            </div>
          </div>
        )}

        {/* 8. Floating References Legend (bottom-left, matching reference app) */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-xl shadow-lg z-10 w-64 overflow-hidden text-xs">
          <div 
            onClick={() => setLegendCollapsed(!legendCollapsed)}
            className="px-3 py-1.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between cursor-pointer font-bold text-slate-800 text-[10px] uppercase tracking-wider"
          >
            <span>REFERENCIAS GIS</span>
            {legendCollapsed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </div>

          {!legendCollapsed && (
            <div className="p-2.5 space-y-2">
              <div>
                <div className="text-[10px] font-semibold text-slate-500 mb-1">Turno · Zonas Operativas</div>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-red-300 border border-red-500"></span>
                    <span>Mañana</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-emerald-300 border border-emerald-500"></span>
                    <span>Tarde</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-blue-300 border border-blue-500"></span>
                    <span>Noche</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-xs bg-cyan-300 border border-cyan-500"></span>
                    <span>Diferenciada</span>
                  </div>
                </div>
              </div>

              <div className="pt-1.5 border-t border-slate-100">
                <div className="text-[10px] font-semibold text-slate-500 mb-1">Puntos de Infraestructura</div>
                <div className="space-y-1 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-cyan-500 text-cyan-600 font-bold text-[8px] flex items-center justify-center bg-cyan-50">S</span>
                    <span>Sumideros y bocas de tormenta</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-amber-500 text-amber-600 font-bold text-[8px] flex items-center justify-center bg-amber-50">B</span>
                    <span>Bacheo y losas en reparación</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-emerald-500 text-emerald-600 font-bold text-[8px] flex items-center justify-center bg-emerald-50">P</span>
                    <span>Plazas y mobiliario urbano</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border border-indigo-500 text-indigo-600 font-bold text-[8px] flex items-center justify-center bg-indigo-50">⚡</span>
                    <span>Estaciones de bombeo pluvial</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Scale indicator */}
        <div className="absolute bottom-2 left-72 bg-white/90 px-2 py-0.5 rounded text-[9px] font-mono text-slate-600 z-10 hidden sm:block border border-slate-200">
          |— 1 km —|
        </div>
      </div>

      {/* 9. Modal to Import KML / KMZ from Google My Maps or Google Earth */}
      {kmlModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg p-6 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center font-bold">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Cargar Capas KML de Google Maps</h3>
                  <p className="text-[11px] text-slate-500">Superponer sobre el mapa aislado de Quilmes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setKmlModalOpen(false);
                  setKmlImportStatus({ type: 'idle' });
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification */}
            {kmlImportStatus.type !== 'idle' && (
              <div className={`p-3 rounded-lg text-xs font-medium border ${
                kmlImportStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                {kmlImportStatus.message}
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nombre descriptivo de la capa
                </label>
                <input
                  type="text"
                  value={kmlLayerName}
                  onChange={(e) => setKmlLayerName(e.target.value)}
                  placeholder="Ej: Relevamiento Sumideros 2026, Bacheo Quilmes Oeste..."
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-hidden focus:border-purple-600"
                />
              </div>

              {/* Color picker for custom layer */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Color de visualización en el mapa:
                </label>
                <div className="flex items-center gap-2">
                  {[
                    { color: '#8b5cf6', label: 'Violeta' },
                    { color: '#06b6d4', label: 'Cian' },
                    { color: '#f97316', label: 'Naranja' },
                    { color: '#10b981', label: 'Verde' },
                    { color: '#ef4444', label: 'Rojo' },
                    { color: '#3b82f6', label: 'Azul' },
                    { color: '#eab308', label: 'Amarillo' }
                  ].map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setKmlColor(c.color)}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                      className={`w-6 h-6 rounded-full border-2 transition-transform ${
                        kmlColor === c.color ? 'border-slate-900 scale-110 shadow-md ring-2 ring-purple-300' : 'border-white opacity-80 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* File Uploader with Drag & Drop */}
              <div 
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const droppedFile = e.dataTransfer.files?.[0];
                  if (droppedFile) {
                    const fakeEvent = {
                      target: { files: [droppedFile] }
                    } as any;
                    await handleKmlFileUpload(fakeEvent);
                  }
                }}
                className="border-2 border-dashed border-purple-300 bg-purple-50/30 rounded-xl p-5 text-center hover:bg-purple-50/50 transition-colors"
              >
                <Upload className="w-8 h-8 text-purple-700 mx-auto mb-2" />
                <div className="text-xs font-semibold text-slate-900">
                  Arrastrá acá tu archivo .kml, .kmz o .geojson
                </div>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                  Compatible directamente con archivos exportados de <strong>Google My Maps</strong>, <strong>Google Earth</strong> o QGIS.
                </p>
                <label className="mt-3 inline-block px-4 py-2 bg-purple-900 hover:bg-purple-950 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors">
                  Seleccionar archivo desde la computadora...
                  <input
                    type="file"
                    accept=".kml,.kmz,.xml,.json,.geojson"
                    onChange={handleKmlFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Or Paste KML text */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  O pegá el código XML / KML / GeoJSON directamente:
                </label>
                <textarea
                  value={kmlTextInput}
                  onChange={(e) => setKmlTextInput(e.target.value)}
                  placeholder="Pegá el contenido de tu archivo KML (<kml xmlns=...) o GeoJSON ({&quot;type&quot;: &quot;FeatureCollection&quot;...})"
                  rows={3}
                  className="w-full text-xs font-mono p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-hidden focus:border-purple-600"
                />
                {kmlTextInput.trim() && (
                  <button
                    type="button"
                    onClick={handleKmlTextSubmit}
                    className="mt-1.5 px-3 py-1 bg-purple-900 text-white text-xs font-semibold rounded-lg hover:bg-purple-950 transition-colors flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Procesar y proyectar sobre Quilmes
                  </button>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-[10px] text-slate-400">
                Se ajusta y aísla dentro del perímetro de Quilmes
              </span>
              <button
                type="button"
                onClick={() => {
                  setKmlModalOpen(false);
                  setKmlImportStatus({ type: 'idle' });
                }}
                className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
