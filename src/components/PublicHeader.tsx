import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  Bell,
  CalendarCheck,
  Home,
  LayoutGrid,
  Lock,
  Mail,
  Menu,
  Star,
  UserCheck,
  X,
} from 'lucide-react';
import { APPOINTMENT_BOOKING_URL, OFFICIAL_WEB_APP_URL } from '../config/businessConfig';
import { LogoMark } from './LogoMark';

const NAV_ITEMS = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'About Us', to: '/about', icon: UserCheck },
  { label: 'Services', to: '/services', icon: LayoutGrid },
  { label: 'Customer Feedback', to: '/feedback', icon: Star },
  { label: 'Notice Board', to: '/notices', icon: Bell },
  { label: 'Contact Us', to: '/contact', icon: Mail },
];

const BlinkingStatusDot: React.FC = () => (
  <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-85" />
    <span className="animate-pulse relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.95)] ring-1 ring-white/70" />
  </span>
);

const APPOINTMENT_3D_CLASSES =
  'text-white font-semibold bg-gradient-to-b from-[#2563eb] via-[#1d4ed8] to-[#153ca1] border border-[#1e40af] border-b-[3px] border-b-[#0a236b] shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_4px_10px_-2px_rgba(15,60,133,0.45)] hover:-translate-y-0.5 hover:from-[#3b82f6] hover:via-[#2563eb] hover:to-[#1d4ed8] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_6px_14px_-2px_rgba(29,78,216,0.52)] active:translate-y-[2px] active:border-b active:shadow-[inset_0_2px_4px_rgba(10,35,107,0.45),0_1px_2px_rgba(15,60,133,0.3)] transition-all duration-150 ease-out rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d4ed8]';

export const PublicHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-b from-white via-white to-slate-50/95 backdrop-blur-md border-b-2 border-slate-200/90 shadow-[0_8px_24px_-10px_rgba(15,60,133,0.16)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[74px] flex items-center justify-between gap-3 xl:gap-4">
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f3c85] rounded-lg shrink-0 transition-transform duration-150 hover:-translate-y-0.5"
          >
            <LogoMark variant="header" />
          </Link>
          <span className="hidden 2xl:block h-8 w-px bg-slate-200" aria-hidden="true" />
        </div>

        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-1.5 text-[13px] 2xl:text-sm font-medium text-slate-700"
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-2.5 2xl:px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 font-semibold ${
                    isActive ? 'nav-3d-active' : 'nav-3d text-slate-700'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <a
            href={APPOINTMENT_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden sm:inline-flex items-center justify-center gap-2 px-3.5 py-2 text-xs xl:text-[13px] 2xl:text-sm whitespace-nowrap shrink-0 ${APPOINTMENT_3D_CLASSES}`}
          >
            <BlinkingStatusDot />
            <CalendarCheck className="w-4 h-4 shrink-0" />
            <span>Appointment Booking</span>
          </a>

          <a
            href={OFFICIAL_WEB_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-3d-navy inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0a2d67]"
          >
            <Lock className="w-3.5 h-3.5 shrink-0" />
            <span>Official Login</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="xl:hidden nav-3d inline-flex items-center justify-center w-11 h-11 rounded-lg text-slate-700 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white shadow-[0_14px_28px_-10px_rgba(15,23,42,0.18)]">
          <nav
            aria-label="Mobile Navigation"
            className="max-w-7xl mx-auto px-4 py-3.5 flex flex-col gap-2"
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
                    `flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold ${
                      isActive ? 'nav-3d-active' : 'nav-3d text-slate-700'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            <a
              href={APPOINTMENT_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className={`mt-1 flex items-center justify-between gap-2.5 px-3.5 py-2.5 text-sm ${APPOINTMENT_3D_CLASSES}`}
            >
              <span className="inline-flex items-center gap-2.5">
                <CalendarCheck className="w-4 h-4 shrink-0" />
                <span>Appointment Booking</span>
              </span>
              <BlinkingStatusDot />
            </a>

            <a
              href={OFFICIAL_WEB_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="btn-3d-navy mt-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-sm font-semibold"
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
