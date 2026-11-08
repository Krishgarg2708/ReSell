import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showTagline = false, className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <Link to="/" className={`group inline-flex items-center gap-2.5 shrink-0 ${className}`}>
      {/* Original circular reuse + shopping tag mark */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-teal-500 text-white shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-5 h-5 text-white"
        >
          {/* Circular reuse arrows */}
          <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
          <path d="M3 3v5h5" />
          <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
          <path d="M16 16h5v5" />
          {/* Inner shopping bag/tag handle */}
          <path d="M9 11a3 3 0 0 1 6 0v1H9v-1z" strokeWidth="1.8" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-bold tracking-tight text-slate-900 dark:text-white leading-none ${textSizes[size]}`}>
          Re<span className="text-blue-600 dark:text-blue-400">Sell</span>
        </span>
        {showTagline && (
          <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400 mt-0.5">
            Peer-to-Peer Marketplace
          </span>
        )}
      </div>
    </Link>
  );
};
