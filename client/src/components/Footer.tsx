import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  logo?: ReactNode;
  description?: string;
  sections?: FooterSection[];
  copyright?: string;
  className?: string;
}

export default function Footer({
  logo,
  description,
  sections,
  copyright,
  className = '',
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-slate-900 text-slate-300 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="lg:col-span-1">
            {logo && <div className="mb-4">{logo}</div>}
            {description && <p className="text-sm text-slate-400 leading-relaxed">{description}</p>}
          </div>

          {sections?.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8">
          <p className="text-sm text-slate-400 text-center">
            {copyright || `© ${currentYear} All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  );
}
