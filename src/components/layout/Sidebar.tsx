import React from 'react';
import { 
  LayoutDashboard, 
  MapPin, 
  Wrench, 
  CalendarDays, 
  Users, 
  Truck, 
  ShieldCheck, 
  Award, 
  BarChart3, 
  Settings, 
  X,
  FileCheck2,
  HardHat
} from 'lucide-react';
import { UserProfile } from '../../types';

interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  currentUser: UserProfile;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  counts: {
    interventionsTotal: number;
    pendingCount: number;
    overdueInspections: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onNavigate,
  currentUser,
  mobileMenuOpen,
  setMobileMenuOpen,
  counts
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Panel ejecutivo',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'mapa',
      label: 'Mapa operativo',
      icon: MapPin,
      badge: 'GIS'
    },
    {
      id: 'intervenciones',
      label: 'Intervenciones',
      icon: Wrench,
      badge: counts.pendingCount > 0 ? `${counts.pendingCount} pend.` : null
    },
    {
      id: 'agenda',
      label: 'Agenda de trabajos',
      icon: CalendarDays,
      badge: null
    },
    {
      id: 'cuadrillas',
      label: 'Cuadrillas',
      icon: Users,
      badge: null
    },
    {
      id: 'recursos',
      label: 'Recursos y maquinaria',
      icon: Truck,
      badge: null
    },
    {
      id: 'preventivo',
      label: 'Mantenimiento preventivo',
      icon: ShieldCheck,
      badge: counts.overdueInspections > 0 ? `! ${counts.overdueInspections}` : null,
      badgeColor: counts.overdueInspections > 0 ? 'bg-amber-100 text-amber-800' : undefined
    },
    {
      id: 'intendente',
      label: 'Tablero Intendente',
      icon: Award,
      badge: 'Ejecutivo'
    },
    {
      id: 'informes',
      label: 'Informes y estadísticas',
      icon: BarChart3,
      badge: null
    },
    {
      id: 'configuracion',
      label: 'Usuarios y configuración',
      icon: Settings,
      badge: null
    }
  ];

  const handleSelect = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 w-64 bg-white border-r border-slate-200 z-40 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Header Inside Drawer */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            <HardHat className="w-5 h-5 text-purple-800" />
            <span className="font-bold text-sm text-slate-900">Menú Servicios Públicos</span>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Navegación General
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-300' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 text-[10px] rounded font-medium shrink-0 ${
                      item.badgeColor 
                        ? item.badgeColor 
                        : isActive 
                        ? 'bg-purple-800 text-cyan-200' 
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Card & Department Isolation Indicator */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="px-2 py-1.5 rounded-md bg-white border border-slate-200">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span className="font-semibold text-purple-950">MUNICIPALIDAD DE QUILMES</span>
              <span className="font-mono text-cyan-700 font-bold">2027</span>
            </div>
            <div className="mt-1 text-[11px] font-medium text-slate-800 truncate">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-500 truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>{currentUser.role} · {currentUser.area.split(' ')[0]}</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
