import React from 'react';
import { Plus, Shield, ChevronDown, Menu, X, Smartphone } from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { getAllUsers, setCurrentUser } from '../../services/storage';
import { QuilmesLogo } from '../common/QuilmesLogo';

interface NavbarProps {
  currentUser: UserProfile;
  activeSection: string;
  onOpenNewModal: () => void;
  onOpenSyncModal: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onNavigate: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeSection,
  onOpenNewModal,
  onOpenSyncModal,
  mobileMenuOpen,
  setMobileMenuOpen,
  onNavigate
}) => {
  const allUsers = getAllUsers();

  const handleSelectRole = (role: UserRole) => {
    const targetUser = allUsers.find(u => u.role === role) || allUsers[0];
    setCurrentUser(targetUser);
  };

  const isGestion = currentUser.role === 'ADMINISTRADOR';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Zone 1: Municipal Brand Lockup */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`${activeSection === 'mapa' ? 'flex items-center gap-1.5' : 'lg:hidden'} p-1.5 rounded-lg text-slate-700 hover:text-purple-900 hover:bg-slate-100 transition-colors border border-slate-200`}
              aria-label="Menú de secciones"
              title="Abrir menú de navegación"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              {activeSection === 'mapa' && <span className="text-xs font-bold hidden md:inline">Menú</span>}
            </button>

            {/* Official Quilmes Servicios Públicos Logo */}
            <div 
              onClick={() => onNavigate('dashboard')} 
              className="cursor-pointer group"
              title="QUILMES 360 — Secretaría de Servicios Públicos"
            >
              <QuilmesLogo size="md" />
            </div>
          </div>

          {/* Zone 2: Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-1 text-xs font-semibold">
            {[
              { id: 'dashboard', label: 'Panel' },
              { id: 'mapa', label: 'Mapa GIS' },
              { id: 'intervenciones', label: 'Intervenciones' },
              { id: 'agenda', label: 'Agenda' },
              { id: 'cuadrillas', label: 'Cuadrillas' },
              { id: 'recursos', label: 'Maquinaria' },
              { id: 'preventivo', label: 'Preventivo' },
              { id: 'intendente', label: '⭐ Intendencia' },
              { id: 'informes', label: 'Informes' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onNavigate(tab.id)}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeSection === tab.id
                    ? tab.id === 'intendente' 
                      ? 'bg-gradient-to-r from-purple-900 to-emerald-800 text-white shadow-xs' 
                      : 'bg-purple-900 text-white shadow-xs'
                    : tab.id === 'intendente'
                      ? 'text-purple-900 hover:bg-purple-50 font-black'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Zone 3: Two Institutional Accounts Switcher & Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* 2-Mode Account Switcher (No personal names) */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => handleSelectRole('ADMINISTRADOR')}
                title="Modo Gestión: Permite crear intervenciones, modificar estados y gestionar cuadrillas"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  isGestion
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-purple-950'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Gestión</span>
              </button>
              
              <button
                type="button"
                onClick={() => handleSelectRole('LECTOR')}
                title="Modo Lectura: Vista de supervisión sin permisos de modificación"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  !isGestion
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-950'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                <span className="hidden sm:inline">Modo Lectura</span>
              </button>
            </div>

            {/* Quick Button for Intendencia High-Impact Overview */}
            <button
              type="button"
              onClick={() => onNavigate('intendente')}
              title="Resumen Ejecutivo para la Intendenta Mayra Mendoza"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-purple-950 bg-gradient-to-r from-purple-100 via-emerald-50 to-purple-100 hover:from-purple-200 hover:to-emerald-100 border border-purple-200 rounded-lg shadow-xs transition-all active:scale-98"
            >
              <span>⭐ Vista Intendencia</span>
            </button>

            {/* Quick Button for Sync / Mobile Transfer */}
            <button
              type="button"
              onClick={onOpenSyncModal}
              title="Pasar datos entre computadora y celular / Descargar o Cargar Respaldo"
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-purple-900 hover:text-purple-950 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg shadow-2xs transition-all active:scale-98 cursor-pointer"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Pasar a Celu</span>
            </button>

            {/* Primary Action Button (Only in Gestión mode) */}
            {isGestion ? (
              <button
                type="button"
                onClick={onOpenNewModal}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-white bg-purple-900 hover:bg-purple-950 rounded-lg shadow-xs transition-colors whitespace-nowrap active:scale-98"
              >
                <Plus className="w-4 h-4 text-emerald-400" />
                <span className="hidden xs:inline">Nueva intervención</span>
              </button>
            ) : (
              <div 
                title="Modo Lectura activo: solo consulta y supervisión institucional"
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg"
              >
                <span>Solo Consulta</span>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
