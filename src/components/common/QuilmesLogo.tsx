import React from 'react';

interface QuilmesLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  inverted?: boolean;
}

export const QuilmesLogo: React.FC<QuilmesLogoProps> = ({ 
  size = 'md', 
  showText = true, 
  inverted = false 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      {/* Official Municipal Emblem for Servicios Públicos Quilmes */}
      <div 
        className={`${iconSizes[size]} relative shrink-0 rounded-xl bg-gradient-to-br from-purple-900 via-purple-950 to-emerald-950 p-1 flex items-center justify-center shadow-xs border border-purple-800/40`}
      >
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Institutional Q Curve */}
          <path 
            d="M24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42C27.5 42 30.7 41.0 33.4 39.3L38 43L41 39L36.8 35.3C39.4 32.2 41 28.3 41 24C41 14.0589 32.9411 6 24 6Z" 
            fill="#581c87"
            stroke="#10b981"
            strokeWidth="2.5"
          />
          {/* Inner Public Services Emblem: Road & Gear / Wave */}
          <circle cx="24" cy="24" r="11" fill="#064e3b" />
          {/* Paved Road / Calzada Line */}
          <path 
            d="M20 32L22 16H26L28 32" 
            stroke="#ffffff" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeDasharray="2 3"
          />
          {/* Public Works Gear & Spark */}
          <path 
            d="M24 13V15M24 33V35M13 24H15M33 24H35M16 16L17.5 17.5M30.5 30.5L32 32M16 32L17.5 30.5M30.5 17.5L32 16" 
            stroke="#34d399" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
          {/* Central Bright Emerald Accent */}
          <circle cx="24" cy="24" r="3.5" fill="#10b981" />
        </svg>

        {/* Small badge dot in emerald green */}
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-emerald-600/20" />
      </div>

      {showText && (
        <div className="flex flex-col text-left leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-black tracking-tight text-base sm:text-lg ${inverted ? 'text-white' : 'text-purple-950'}`}>
              QUILMES <span className="text-emerald-600 font-extrabold">360</span>
            </span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded font-mono border border-emerald-300/60 hidden sm:inline-block">
              SERVICIOS PÚBLICOS
            </span>
          </div>
          <span className={`text-[11px] font-medium tracking-wide ${inverted ? 'text-purple-200' : 'text-slate-500'}`}>
            Secretaría de Servicios Públicos · Municipalidad de Quilmes
          </span>
        </div>
      )}
    </div>
  );
};
