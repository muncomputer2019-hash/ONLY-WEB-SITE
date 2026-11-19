import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, MapPin, Phone } from 'lucide-react';
import { SHOP_STOREFRONT_IMAGE, formatFullAddress } from '../config/businessConfig';
import { useWebsiteSettings } from '../context/WebsiteSettingsContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const AboutPage: React.FC = () => {
  const { settings } = useWebsiteSettings();
  const [imgErr, setImgErr] = useState(false);

  useDocumentMeta({
    title: 'About Us – MUN COMPUTER',
    description:
      'Learn about MUN COMPUTER, our mission, vision, service commitment, and digital support solutions in Mamudpur, Domkal, Murshidabad.',
  });

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-18">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs sm:text-sm font-medium text-blue-800">About MUN COMPUTER</p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Trusted Local Digital Service &amp; Computer Solutions
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">{settings.aboutIntro}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-2.5">
              <h2 className="font-display text-xl font-bold text-slate-950">Business Introduction</h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Located in Village Mamudpur under Post Office Juginda and Police Station Domkal in
                Murshidabad district, MUN COMPUTER assists local residents, students, farmers, and
                small businesses with everyday digital portal services, computer work, banking
                assistance, and documentation formatting.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              <div className="space-y-2">
                <h2 className="font-display text-lg font-bold text-slate-950">Our Mission</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{settings.mission}</p>
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-lg font-bold text-slate-950">Our Vision</h2>
                <p className="text-sm text-slate-600 leading-relaxed">{settings.vision}</p>
              </div>
            </div>

            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              <h2 className="font-display text-xl font-bold text-slate-950">
                Our Service Commitment
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {settings.serviceCommitment}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 flex flex-col gap-3">
            <div className="w-full flex-1 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden min-h-[280px] flex items-center justify-center">
              {!imgErr ? (
                <img
                  src={SHOP_STOREFRONT_IMAGE}
                  alt="MUN COMPUTER physical centre storefront in Mamudpur, Juginda, Domkal"
                  referrerPolicy="no-referrer"
                  onError={() => setImgErr(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-8 text-center space-y-2">
                  <p className="font-display font-bold text-slate-900">MUN COMPUTER</p>
                  <p className="text-xs text-slate-600">{formatFullAddress(settings)}</p>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500">
              MUN COMPUTER Service Centre · Mamudpur, Juginda, Domkal, Murshidabad – 742406
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-slate-950">
              Digital Service Solutions
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Across 40 main service categories — from Aadhaar, Voter, PAN, Ration &amp; Passport
              assistance to West Bengal and Central Government schemes, banking services, land
              records, education portals, and PVC card printing — every workflow is handled carefully
              with clear document checklists.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800 hover:text-blue-950"
            >
              Browse All 40 Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
            <h2 className="font-display text-lg font-bold text-slate-950">Customer Support</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We value honest communication. Customers receive application reference tracking where
              applicable and can share feedback or contact our team directly for follow-ups.
            </p>
            <Link
              to="/feedback"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-800 hover:text-blue-950"
            >
              Share Customer Feedback
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="border border-slate-200 rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <h2 className="font-display text-xl font-bold text-slate-950">
                Business Contact Information
              </h2>
              <div className="text-sm text-slate-600 space-y-1.5">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
                  <span>{formatFullAddress(settings)}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-blue-800 shrink-0" />
                  <span className="font-mono-tabular">{settings.phone || '+91 8101352105'}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-blue-800 shrink-0" />
                  <span>{settings.email || 'MUNCOMPUTER2019@GMAIL.COM'}</span>
                </p>
              </div>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors whitespace-nowrap shrink-0"
            >
              Contact MUN COMPUTER
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
