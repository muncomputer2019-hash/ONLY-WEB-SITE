import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, MapPin, MessageCircle, Navigation, Phone } from 'lucide-react';
import { formatFullAddress, OFFICIAL_WEB_APP_URL } from '../config/businessConfig';
import { useWebsiteSettings } from '../context/WebsiteSettingsContext';
import { getShopMapsUrl, getWhatsAppUrl } from '../services/publicData';
import { LogoMark } from './LogoMark';

export const PublicFooter: React.FC = () => {
  const { settings } = useWebsiteSettings();
  const year = new Date().getFullYear();

  const phone = settings.phone || '+91 8101352105';
  const whatsapp = settings.whatsapp || '+91 8101352105';
  const email = settings.email || 'MUNCOMPUTER2019@GMAIL.COM';
  const phoneClean = phone.replace(/\s+/g, '');
  const whatsappUrl = getWhatsAppUrl(
    whatsapp,
    'Hello MUN COMPUTER, I would like to enquire about your services.'
  );
  const mapsUrl = getShopMapsUrl(settings);

  return (
    <footer className="bg-[#06214d] text-slate-200 border-t border-[#0c3270]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-0 lg:divide-x lg:divide-white/15">
          {/* Logo & Address */}
          <div className="lg:col-span-4 lg:pr-6 space-y-4">
            <LogoMark variant="footer" />
            <div className="flex items-start gap-2.5 text-sm text-slate-200 leading-relaxed pt-1">
              <MapPin className="w-4 h-4 text-sky-300 shrink-0 mt-1" />
              <p>{formatFullAddress(settings)}</p>
            </div>
          </div>

          {/* Direct Contact */}
          <div className="lg:col-span-3 lg:px-6 space-y-3 text-sm">
            <a
              href={`tel:${phoneClean}`}
              className="flex items-center gap-2.5 text-white hover:text-sky-200 transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Phone className="w-3.5 h-3.5" />
              </span>
              <span className="font-mono-tabular font-medium">{phone}</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-white hover:text-sky-200 transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center shrink-0">
                <MessageCircle className="w-3.5 h-3.5" />
              </span>
              <span className="font-mono-tabular font-medium">{whatsapp}</span>
            </a>
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-2.5 text-white hover:text-sky-200 transition-colors"
            >
              <span className="w-7 h-7 rounded-full bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0">
                <Mail className="w-3.5 h-3.5" />
              </span>
              <span className="break-all font-medium">{email}</span>
            </a>
          </div>

          {/* Quick Links & Useful Links */}
          <div className="lg:col-span-3 lg:px-6 grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2.5">
              <h3 className="font-display font-semibold text-white">Quick Links</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li>
                  <Link to="/" className="inline-flex items-center gap-1 hover:text-white">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="inline-flex items-center gap-1 hover:text-white">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="inline-flex items-center gap-1 hover:text-white">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" className="inline-flex items-center gap-1 hover:text-white">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                    Feedback
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h3 className="font-display font-semibold text-white">Useful Links</h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                <li>
                  <Link to="/notices" className="inline-flex items-center gap-1 hover:text-white">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                    Notice Board
                  </Link>
                </li>
                <li>
                  <Link
                    to="/privacy-policy"
                    className="inline-flex items-center gap-1 hover:text-white"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="inline-flex items-center gap-1 hover:text-white">
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <a
                    href={OFFICIAL_WEB_APP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-white"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-sky-400" />
                    Official Login
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Direct Centre Channels */}
          <div className="lg:col-span-2 lg:pl-6 space-y-3">
            <h3 className="font-display font-semibold text-white text-sm">Reach Us</h3>
            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={`tel:${phoneClean}`}
                aria-label="Call MUN COMPUTER"
                className="w-9 h-9 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp MUN COMPUTER"
                className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${email}`}
                aria-label="Email MUN COMPUTER"
                className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Google Maps Directions to MUN COMPUTER"
                className="w-9 h-9 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center transition-colors"
              >
                <Navigation className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#041738] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-300">
          <p>© {year} {settings.businessName || 'MUN COMPUTER'}. All Rights Reserved.</p>
          <p>{settings.heroSubtitle || 'Your Trusted Digital Service & Computer Solutions Centre.'}</p>
        </div>
      </div>
    </footer>
  );
};
