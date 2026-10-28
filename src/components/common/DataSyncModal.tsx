import React, { useState, useRef } from 'react';
import { 
  Smartphone, 
  Monitor, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  CloudOff, 
  Cloud, 
  FileText, 
  HelpCircle, 
  X,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { exportDataJSON, importDataJSON } from '../../services/storage';
import { UserProfile } from '../../types';

interface DataSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSyncSuccess?: () => void;
}

export const DataSyncModal: React.FC<DataSyncModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSyncSuccess
}) => {
  const [copied, setCopied] = useState(false);
  const [pasteText, setPasteText] = useState('');
  const [showPasteBox, setShowPasteBox] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDownload = () => {
    try {
      const jsonStr = exportDataJSON();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quilmes360_datos_${new Date().toISOString().slice(0, 10)}.json`;
      link.click();
      URL.revokeObjectURL(url);

      setStatusMessage({
        type: 'success',
        text: '¡Archivo descargado! Enviátelo por WhatsApp o Drive a tu celu y tocalo desde "Cargar Archivo".'
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Error al generar el archivo de respaldo.'
      });
    }
  };

  const handleCopy = () => {
    try {
      const jsonStr = exportDataJSON();
      navigator.clipboard.writeText(jsonStr);
      setCopied(true);
      setStatusMessage({
        type: 'success',
        text: '¡Datos copiados! Podés pegarlos en tu WhatsApp Web y abrirlos en tu celu.'
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'No se pudo copiar al portapapeles. Probá descargando el archivo.'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const ok = importDataJSON(content, currentUser);
        if (ok) {
          setStatusMessage({
            type: 'success',
            text: '¡Datos cargados con éxito! Tu dispositivo ahora tiene todas las intervenciones actualizadas.'
          });
          if (onSyncSuccess) onSyncSuccess();
        } else {
          setStatusMessage({
            type: 'error',
            text: 'El archivo no tiene el formato correcto de Quilmes 360.'
          });
        }
      } catch {
        setStatusMessage({
          type: 'error',
          text: 'Error al leer el archivo seleccionado.'
        });
      }
    };
    reader.readAsText(file);
    // Reset file input value so user can re-upload if needed
    e.target.value = '';
  };

  const handlePasteImport = () => {
    if (!pasteText.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Pegá el texto JSON antes de importar.'
      });
      return;
    }
    const ok = importDataJSON(pasteText, currentUser);
    if (ok) {
      setStatusMessage({
        type: 'success',
        text: '¡Datos importados con éxito! El sistema está sincronizado.'
      });
      setPasteText('');
      setShowPasteBox(false);
      if (onSyncSuccess) onSyncSuccess();
    } else {
      setStatusMessage({
        type: 'error',
        text: 'El contenido pegado no es válido. Verificá que esté completo.'
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 via-purple-950 to-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Smartphone className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight flex items-center gap-2">
                <span>Sincronización Compu ⇄ Celular</span>
              </h2>
              <p className="text-xs text-purple-200">
                QUILMES 360 — Transferencia y Respaldo de Intervenciones
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-sm text-slate-700">
          
          {/* Status Alert Banner */}
          {statusMessage && (
            <div className={`p-3 rounded-xl border text-xs font-semibold flex items-start gap-2.5 ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              {statusMessage.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">{statusMessage.text}</div>
            </div>
          )}

          {/* Explanation Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center gap-2 text-purple-900 font-bold text-xs uppercase tracking-wider">
              <CloudOff className="w-4 h-4 text-slate-500" />
              <span>¿Cómo funciona el guardado en Netlify?</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Al estar en Netlify de forma independiente, los datos se guardan en la memoria local (<strong>LocalStorage</strong>) del navegador de cada dispositivo.
              Por eso, lo que guardás en tu compu <strong>no pasa automáticamente al celular</strong> a menos que transfieras la copia de seguridad o vincules una base central en la nube.
            </p>
          </div>

          {/* Step by Step Transfer Guide */}
          <div className="border border-purple-100 bg-purple-50/50 rounded-xl p-4 space-y-3">
            <div className="text-xs font-bold text-purple-950 uppercase tracking-wide flex items-center gap-1.5">
              <span>🚀 Cómo pasar tus datos de la compu a tu celular en 3 pasos:</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-purple-100 shadow-2xs">
                <div className="font-bold text-purple-900 flex items-center gap-1 mb-1">
                  <Monitor className="w-3.5 h-3.5 text-purple-700" />
                  <span>1. En la Compu</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Tocá <strong>Descargar Copia</strong>. Se bajará un archivo liviano con todas tus intervenciones y cuadrillas.
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-purple-100 shadow-2xs">
                <div className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span>2. Enviátelo</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Mandate el archivito por <strong>WhatsApp</strong>, Telegram o mail a tu celular.
                </p>
              </div>

              <div className="bg-white p-2.5 rounded-lg border border-purple-100 shadow-2xs">
                <div className="font-bold text-purple-900 flex items-center gap-1 mb-1">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>3. En el Celu</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Abrí Quilmes 360 en el celu, tocá <strong>Cargar Archivo</strong> ¡y listo! Se ve todo en el mapa al instante.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-slate-800 mb-1">Acciones de Respaldo y Transferencia:</div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Download JSON */}
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-purple-900 hover:bg-purple-950 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Descargar Copia de Datos (.json)</span>
              </button>

              {/* Upload JSON */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  <Upload className="w-4 h-4 text-white" />
                  <span>Cargar Archivo en este equipo</span>
                </button>
              </div>
            </div>

            {/* Quick Copy to Clipboard */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                <span>{copied ? '¡Copiado!' : 'Copiar texto para WhatsApp Web'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowPasteBox(!showPasteBox)}
                className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 inline mr-1" />
                <span>Pegar texto</span>
              </button>
            </div>

            {/* Paste JSON text area toggle */}
            {showPasteBox && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 animate-in fade-in">
                <label className="block text-xs font-bold text-slate-700">
                  Pegá aquí el texto copiado de la otra computadora:
                </label>
                <textarea
                  value={pasteText}
                  onChange={(e) => setPasteText(e.target.value)}
                  placeholder='Pegá el texto que empieza con {"exportDate"...'
                  rows={4}
                  className="w-full p-2 text-xs font-mono bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-purple-600"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPasteText('');
                      setShowPasteBox(false);
                    }}
                    className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handlePasteImport}
                    className="px-3 py-1 text-xs bg-purple-900 text-white font-bold rounded hover:bg-purple-950 cursor-pointer"
                  >
                    Importar y Actualizar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Cloud Option Info */}
          <div className="border-t border-slate-200 pt-3 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
            </div>
            <div className="text-xs text-slate-600 leading-relaxed">
              <strong className="text-purple-950 block">¿Querés sincronización 100% en vivo sin archivos?</strong>
              Si la Secretaría de Servicios Públicos necesita que 20 inspectores carguen en la calle y se vea al segundo en la pantalla de la Intendencia, se puede conectar a una base de datos central en la nube cuando lo decidas.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 sm:px-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
