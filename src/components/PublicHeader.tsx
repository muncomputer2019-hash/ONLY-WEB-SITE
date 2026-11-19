import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Bell,
  Home,
  LayoutGrid,
  Lock,
  Mail,
  Menu,
  Star,
  UserCheck,
  X,
} from 'lucide-react';
import { OFFICIAL_WEB_APP_URL } from '../config/businessConfig';
import { LogoMark } from './LogoMark';

const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'About Us', to: '/about', icon: UserCheck },
  { label: 'Services', to: '/services', icon: LayoutGrid },
  { label: 'Customer Feedback', to: '/feedback', icon: Star },
  { label: 'Notice Board', to: '/notices', icon: Bell },
  { label: 'Contact Us', to: '/contact', icon: Mail },
];

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-[0_1px_3px_rgba(15,23,42,0.04)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-3 lg:gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f3c85] rounded-md shrink-0"
          >
            <LogoMark variant="header" />
          </Link>
          <span className="hidden xl:block h-8 w-px bg-slate-200" aria-hidden="true" />
        </div>

        <nav
          aria-label="Primary Navigation"
          className="hidden lg:flex items-center gap-1.5 xl:gap-2 text-sm font-medium text-slate-700"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#0f3c85] text-white font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={OFFICIAL_WEB_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#0a2d67] rounded-lg hover:bg-[#07204a] transition-colors whitespace-nowrap shrink-0 shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a2d67]"
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Official Login</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-11 h-11 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white">
          <nav
            aria-label="Mobile Navigation"
            className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#0f3c85] text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-950'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
            <a
              href={OFFICIAL_WEB_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#0a2d67] hover:bg-[#07204a] transition-colors"
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>Official Login</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
