import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavbarProps {
  logo?: ReactNode;
  logoIcon?: LucideIcon;
  logoText?: string;
  logoLink?: string;
  actions?: ReactNode;
  className?: string;
}

export default function Navbar({
  logo,
  logoIcon: LogoIcon,
  logoText,
  logoLink = '/',
  actions,
  className = '',
}: NavbarProps) {
  return (
    <nav className={`border-b border-slate-200 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to={logoLink}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            {logo ? (
              logo
            ) : (
              <>
                {LogoIcon && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <LogoIcon className="w-5 h-5 text-white" />
                  </div>
                )}
                {logoText && <span className="text-xl font-bold text-slate-900">{logoText}</span>}
              </>
            )}
          </Link>
          {actions && <div className="flex items-center gap-4">{actions}</div>}
        </div>
      </div>
    </nav>
  );
}
