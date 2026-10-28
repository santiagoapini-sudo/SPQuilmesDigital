import React, { useState } from 'react';
import { UserProfile, UserRole, AuditRecord } from '../../types';
import { 
  Settings, 
  Shield, 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  Server, 
  Key, 
  Lock, 
  FileCode, 
  Check, 
  AlertTriangle,
  History,
  Cloud,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  exportDataJSON, 
  importDataJSON, 
  resetToSeedData, 
  getAuditLog 
} from '../../services/storage';

interface ConfigAndArchitectureProps {
  currentUser: UserProfile;
  auditLogs: AuditRecord[];
}

export const ConfigAndArchitecture: React.FC<ConfigAndArchitectureProps> = ({
  currentUser,
  auditLogs
}) => {
  const [activeTab, setActiveTab] = useState<'roles' | 'database' | 'cloudflare' | 'audit' | 'backup'>('roles');
  const [importText, setImportText] = useState('');
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const jsonStr = exportDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup_quilmes360_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleRestoreBackup = () => {
    if (!importText.trim()) {
      alert('Por favor pegue el contenido JSON de la copia de seguridad.');
      return;
    }
    const ok = importDataJSON(importText, currentUser);
    if (ok) {
      alert('Copia de seguridad restaurada correctamente.');
      setImportText('');
    } else {
      alert('Error al procesar el archivo JSON. Verifique la estructura.');
    }
  };

  const handleResetData = () => {
    if (window.confirm('¿Está seguro de restablecer todos los datos del sistema a los valores de prueba originales del Plan 2027?')) {
      resetToSeedData(currentUser);
      alert('Datos restablecidos a los valores iniciales de prueba.');
    }
  };

  const handleCopyCode = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(label);
    setTimeout(() => setCopySuccess(null), 2000);
  };

  const rolesMatrix = [
    {
      role: 'ADMINISTRADOR',
      desc: 'Gestión total del sistema, administración de usuarios, auditoría completa, configuración de servicios y restauración de base de datos.',
      perms: ['Crear/Editar cualquier intervención', 'Eliminar registros', 'Verificar obras', 'Administrar cuadrillas y maquinaria', 'Auditoría completa']
    },
    {
      role: 'INTENDENTE',
      desc: 'Acceso exclusivo al Tablero Ejecutivo, mapas e informes de impacto municipal. Modo solo lectura protegido contra alteraciones operativas.',
      perms: ['Tablero Ejecutivo', 'Mapa Territorial', 'Emisión de Informes', 'Monitoreo de Metas Plan 2027', 'Sin edición accidental']
    },
    {
      role: 'SECRETARIO',
      desc: 'Supervisión de todas las direcciones de la Secretaría de Servicios Públicos. Priorización de intervenciones y asignación estratégica.',
      perms: ['Visualizar todas las áreas', 'Aprobar prioridades', 'Gestionar agenda semanal/mensual', 'Verificar cumplimiento de metas']
    },
    {
      role: 'DIRECTOR',
      desc: 'Conducción operativa de su dirección específica (Vialidad, Hidráulica, Espacios Públicos o Saneamiento).',
      perms: ['Crear y editar intervenciones de su área', 'Asignar cuadrillas y vehículos', 'Reprogramar fechas con causa', 'Revisar inspecciones']
    },
    {
      role: 'SUPERVISOR',
      desc: 'Inspecciones técnicas en vía pública, control de calidad, registro fotográfico y emisión de actas de verificación final.',
      perms: ['Emitir certificados de verificación in situ', 'Subir fotografías antes/durante/después', 'Ejecutar checklist preventivo', 'Reportar estados']
    },
    {
      role: 'OPERADOR',
      desc: 'Miembros de cuadrillas en campo. Consulta de intervenciones asignadas y reporte de inicio/finalización de obra.',
      perms: ['Ver tareas de su cuadrilla', 'Actualizar avance a En Ejecución / Finalizada', 'Subir fotografías desde celular']
    }
  ];

  const firestoreRulesSample = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función auxiliar para obtener perfil y rol del usuario autenticado
    function getUserData() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data;
    }
    
    function isAdmin() {
      return request.auth != null && getUserData().role == 'ADMINISTRADOR';
    }
    
    function isSupervisorOrDirector() {
      return request.auth != null && (
        getUserData().role in ['SUPERVISOR', 'DIRECTOR', 'SECRETARIO', 'ADMINISTRADOR']
      );
    }
    
    function isMayor() {
      return request.auth != null && getUserData().role == 'INTENDENTE';
    }

    // Reglas para Intervenciones de Servicios Públicos
    match /interventions/{interventionId} {
      // Lectura permitida para todos los roles autorizados de Quilmes
      allow read: if request.auth != null;
      
      // Creación: Operadores, Supervisores, Directores y Admin
      allow create: if request.auth != null && getUserData().role != 'INTENDENTE';
      
      // Actualización: restringida según el campo
      // La verificación oficial SOLO puede ser aprobada por Supervisor o Director
      allow update: if isSupervisorOrDirector() || (
        // Los operadores solo pueden actualizar estado y subir fotos
        getUserData().role == 'OPERADOR' && 
        !request.resource.data.diff(resource.data).affectedKeys().hasAny(['verification'])
      );
      
      // Eliminación estricta solo para Administrador
      allow delete: if isAdmin();
    }
    
    // Reglas para Cuadrillas y Maquinaria
    match /cuadrillas/{cuadId} {
      allow read: if request.auth != null;
      allow write: if isSupervisorOrDirector();
    }
    
    // Registro de Auditoría: inalterable una vez escrito
    match /audit_logs/{logId} {
      allow read: if isSupervisorOrDirector() || isMayor();
      allow create: if request.auth != null;
      allow update, delete: if false; // INMUTABLE
    }
  }
}`;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Gobernanza y Arquitectura
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-medium">Configuración de Servicios Públicos</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Usuarios, Roles, Permisos y Arquitectura Cloud
            </h1>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'roles' ? 'bg-purple-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Matriz de Roles (RBAC)</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'database' ? 'bg-purple-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Arquitectura Cloud Firestore & Supabase</span>
          </button>

          <button
            onClick={() => setActiveTab('cloudflare')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'cloudflare' ? 'bg-purple-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>GitHub & Cloudflare Pages</span>
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit' ? 'bg-purple-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Auditoría ({auditLogs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'backup' ? 'bg-purple-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Copia de Seguridad y Datos</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ROLES & RBAC MATRIX */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900 mb-1">
              Esquema Institucional de Control de Acceso (RBAC)
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Cada rol cuenta con permisos delimitados para evitar ediciones accidentales o manipulaciones no autorizadas.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rolesMatrix.map((r, i) => (
                <div key={i} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-xs text-purple-900 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {r.role}
                      </span>
                      {currentUser.role === r.role && (
                        <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-1.5 py-0.5 rounded border border-cyan-200">
                          Tu Rol Actual
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {r.desc}
                    </p>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                        Permisos asignados:
                      </span>
                      {r.perms.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CLOUD FIRESTORE & SUPABASE ARCHITECTURE */}
      {activeTab === 'database' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Evaluación de Arquitectura de Base de Datos y Servicios Cloud
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Opciones técnicas recomendadas para el despliegue del Plan Quilmes 2027
              </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              
              {/* Option A: Google Cloud Firestore */}
              <div className="border border-purple-200 bg-purple-50/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-purple-800" />
                    <span className="font-bold text-sm text-purple-950">Ecosistema Google Cloud / Firebase</span>
                  </div>
                  <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                    Recomendado por Google
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  Integración directa con <strong>Cloud Firestore</strong> para almacenamiento de documentos en tiempo real (intervenciones, cuadrillas, maquinaria) y <strong>Firebase Auth</strong> para autenticación municipal con contraseñas cifradas con bcrypt/scrypt.
                </p>

                <div className="space-y-1.5 pt-2 border-t border-purple-100">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Sincronización offline nativa en teléfonos de cuadrillas</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Firebase Storage para resguardo de fotos de antes, durante y después</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Reglas de seguridad granulares (firestore.rules) a nivel documento</span>
                  </div>
                </div>
              </div>

              {/* Option B: Supabase PostgreSQL */}
              <div className="border border-cyan-200 bg-cyan-50/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-cyan-800" />
                    <span className="font-bold text-sm text-cyan-950">Supabase (PostgreSQL Relacional + PostGIS)</span>
                  </div>
                  <span className="text-[10px] font-bold text-cyan-900 bg-cyan-100 px-2 py-0.5 rounded">
                    Alternativa Relacional
                  </span>
                </div>

                <p className="text-slate-600 leading-relaxed">
                  Base de datos relacional con extensión geoespacial <strong>PostGIS</strong> ideal para calcular polígonos de cuencas de sumideros, distancias de cuadrillas y cruces de calles en Quilmes.
                </p>

                <div className="space-y-1.5 pt-2 border-t border-cyan-100">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Row Level Security (RLS) en PostgreSQL nativo</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Consultas SQL analíticas complejas para informes ejecutivos</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Gestión de sesiones segura mediante JWT tokens</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Step-by-Step Instructions */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                Paso a Paso para Conectar la Base de Datos Externa
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>Paso 1: Crear Proyecto en Firebase Console o Supabase</strong>
                  <p className="mt-0.5 text-slate-500">
                    Ingresar a <span className="font-mono text-purple-900">console.firebase.google.com</span> o <span className="font-mono text-cyan-800">supabase.com</span> y crear el proyecto institucional <span className="font-semibold">"quilmes-360-servicios-publicos"</span> en la región <span className="font-mono">southamerica-east1 (São Paulo)</span> para mínima latencia.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>Paso 2: Activar Authentication</strong>
                  <p className="mt-0.5 text-slate-500">
                    En el panel de Auth, habilitar proveedor "Correo electrónico y contraseña". Crear las cuentas de los directores e intendente con contraseñas seguras (almacenadas automáticamente con hash criptográfico unidireccional).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <strong>Paso 3: Desplegar Reglas de Seguridad</strong>
                  <p className="mt-0.5 text-slate-500">
                    Copiar el código de reglas de seguridad provisto a continuación y pegarlo en la pestaña "Reglas" de Cloud Firestore.
                  </p>
                </div>
              </div>
            </div>

            {/* Firestore Rules Code Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 font-mono">
                  firestore.rules (Reglas de Seguridad y Validación de Roles)
                </span>
                <button
                  onClick={() => handleCopyCode(firestoreRulesSample, 'firestore')}
                  className="text-xs font-semibold text-purple-900 hover:text-purple-950 flex items-center gap-1"
                >
                  {copySuccess === 'firestore' ? '✓ Copiado al portapapeles' : 'Copiar código'}
                </button>
              </div>

              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-[11px] font-mono overflow-x-auto max-h-64 leading-relaxed">
                {firestoreRulesSample}
              </pre>
            </div>

          </div>
        </div>
      )}

      {/* TAB: GITHUB & CLOUDFLARE PAGES ARCHITECTURE */}
      {activeTab === 'cloudflare' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  Despliegue Continuo Edge
                </span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-500 font-medium">Recomendado para Quilmes 360</span>
              </div>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Articulación con GitHub y Cloudflare Pages
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Esta combinación es la más veloz, segura y económica para poner la plataforma a disposición del Municipio de Quilmes.
              </p>
            </div>

            {/* Why Cloudflare + GitHub is great */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">⚡ Despliegue Automático CI/CD</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Cada vez que hacés un <code className="bg-slate-200 px-1 rounded">git push</code> a tu rama principal en GitHub, Cloudflare Pages compila y publica la versión en menos de 60 segundos sin requerir servidores propios.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">🛡️ Protección Anti-DDoS y SSL Gratis</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Certificados HTTPS gestionados automáticamente y blindaje contra ataques con presencia en el centro de datos de Buenos Aires (EZE) para mínima latencia en el conurbano sur.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="font-bold text-slate-900 block mb-1">📸 Fotos en Cloudflare R2 ($0 Egress)</span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Para las fotografías de bacheo y sumideros (antes, durante y después), Cloudflare R2 no cobra por descarga de ancho de banda, ahorrando costos presupuestarios al municipio.
                </p>
              </div>
            </div>

            {/* Step-by-Step GitHub + Cloudflare Configuration */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <h3 className="font-bold text-sm text-slate-900">
                Paso a Paso de Configuración en Cloudflare Pages
              </h3>

              <div className="space-y-2.5 text-xs text-slate-600">
                <div className="p-3 bg-purple-50/40 border border-purple-200 rounded-lg">
                  <div className="font-bold text-purple-950">1. Subir el proyecto a un repositorio de GitHub</div>
                  <p className="text-slate-600 mt-1">
                    Crear un repositorio en GitHub (ej. <code className="bg-white px-1.5 py-0.5 rounded border border-purple-200 text-purple-900 font-mono">quilmes-360-servicios-publicos</code>) y subir la carpeta del proyecto.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900">2. Conectar en el panel de Cloudflare</div>
                  <p className="text-slate-600 mt-1">
                    Entrar a <span className="font-mono text-purple-900">dash.cloudflare.com</span> → Seleccionar <strong>Workers & Pages</strong> → <strong>Create application</strong> → <strong>Pages</strong> → <strong>Connect to Git</strong>.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900">3. Parámetros de Build (Cargar exactamente estos valores)</div>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] font-sans">Framework preset:</span>
                      <strong className="text-purple-900">Vite</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] font-sans">Build command:</span>
                      <strong className="text-purple-900">npm run build</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] font-sans">Build output directory:</span>
                      <strong className="text-purple-900">dist</strong>
                    </div>
                    <div className="bg-white p-2 rounded border border-slate-200">
                      <span className="text-slate-400 block text-[10px] font-sans">Node.js version (Environment variable):</span>
                      <strong className="text-purple-900">NODE_VERSION = 20</strong>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="font-bold text-slate-900">4. Dominio Institucional Personalizado</div>
                  <p className="text-slate-600 mt-1">
                    En la pestaña <strong>Custom Domains</strong> de Cloudflare Pages podés asociar <span className="font-mono font-semibold text-purple-900">serviciospublicos.quilmes.gob.ar</span> o el dominio que disponga la Dirección de Sistemas de Quilmes con un simple registro CNAME.
                  </p>
                </div>
              </div>
            </div>

            {/* KML layers guide */}
            <div className="p-4 bg-cyan-50/50 border border-cyan-200 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-cyan-950 flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-cyan-800" />
                <span>¿Cómo usar las capas KML de Google Maps en Quilmes 360?</span>
              </span>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                En Google My Maps o Google Earth, andá a los 3 puntitos del mapa → <strong>Exportar a KML/KMZ</strong>. Luego, en la sección <strong>Mapa Operativo</strong> de esta app, hacé clic en el botón <strong>"Capas KML / Google Maps"</strong> y arrastrá el archivo. La aplicación delimitará automáticamente los polígonos, líneas o puntos directamente sobre el mapa de Quilmes con colores personalizables.
              </p>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Libro Diario de Auditoría Operativa
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Registro secuencial de eventos del sistema, altas, modificaciones y dictámenes de verificación
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="py-2.5 px-3">Fecha y Hora</th>
                  <th className="py-2.5 px-3">Usuario</th>
                  <th className="py-2.5 px-3">Rol</th>
                  <th className="py-2.5 px-3">Acción Registrada</th>
                  <th className="py-2.5 px-3">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-2 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString('es-AR')}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-900 whitespace-nowrap">
                      {log.userName}
                    </td>
                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="font-medium text-purple-900 text-[11px]">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-2 px-3 font-medium text-slate-800">
                      {log.action}
                    </td>
                    <td className="py-2 px-3 text-slate-600 text-[11px] max-w-xs truncate">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: BACKUP & RESTORE */}
      {activeTab === 'backup' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Copias de Seguridad y Resguardo de Datos
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Exportación e importación de la base completa en formato JSON estructurado
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Export Backup Card */}
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    <Download className="w-4 h-4 text-purple-800" />
                    <span>Generar Copia de Seguridad Local</span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Descargue un archivo JSON íntegro con todas las intervenciones, cuadrillas, maquinaria, preventivos e historial de auditoría.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleDownloadBackup}
                    className="w-full py-2 px-3 text-xs font-bold text-white bg-purple-900 hover:bg-purple-950 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-cyan-300" />
                    <span>Descargar Backup JSON</span>
                  </button>
                </div>
              </div>

              {/* Reset to Seed Card */}
              <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/40 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-amber-700" />
                    <span>Restablecer Datos Iniciales de Prueba</span>
                  </h3>
                  <p className="text-xs text-amber-900 mt-1">
                    Restaura los datos demostrativos del Plan 2027 para Quilmes Centro, Bernal, Solano y Ezpeleta si se realizaron pruebas destructivas.
                  </p>
                </div>
                <div className="mt-4">
                  <button
                    onClick={handleResetData}
                    className="w-full py-2 px-3 text-xs font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 rounded-lg transition-colors"
                  >
                    Restablecer Datos de Demostración
                  </button>
                </div>
              </div>

            </div>

            {/* Import JSON Section */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="font-bold text-xs text-slate-900">
                Restaurar Base de Datos desde JSON
              </h3>
              <textarea
                rows={3}
                placeholder="Pegue aquí el contenido JSON exportado previamente..."
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleRestoreBackup}
                  className="px-4 py-1.5 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 rounded-lg transition-colors flex items-center gap-1"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Cargar y Restaurar JSON</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
