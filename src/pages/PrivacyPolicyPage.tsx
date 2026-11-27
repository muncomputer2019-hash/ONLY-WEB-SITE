import React from 'react';
import { formatFullAddress } from '../config/businessConfig';
import { useWebsiteSettings } from '../context/WebsiteSettingsContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useWebsiteSettings();

  useDocumentMeta({
    title: 'Privacy Policy – MUN COMPUTER',
    description:
      'Privacy Policy explaining how MUN COMPUTER collects, protects, and handles customer enquiries, feedback, and service data.',
  });

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-3d-stage">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-2">
          <p className="text-xs sm:text-sm font-medium text-blue-800">Legal Information</p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-600">MUN COMPUTER · Effective for website visitors and customers</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-slate-950">1. Information We Collect</h2>
          <p>
            When you use the MUN COMPUTER public website, we only collect the information you
            voluntarily submit through our Customer Feedback form (optional name, optional mobile
            number, service category, optional service reference ID, rating, and message) or our
            Contact Enquiry form (name, optional phone/email, subject, and enquiry message).
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-slate-950">2. Purpose of Collection</h2>
          <p>
            Submitted contact enquiries and feedback are used solely to respond to customer
            questions, verify service follow-up requests, and improve the quality of digital and
            computer services provided at our centre.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-slate-950">3. Feedback Privacy &amp; Consent</h2>
          <p>
            Customer feedback is stored privately under restricted administrative access. Feedback
            is never published automatically. A review may only appear in the Approved Public
            Reviews section if you explicitly check the publication consent option and an authorized
            Admin approves the review. Mobile numbers, phone numbers, and private contact enquiries
            are never published publicly.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-slate-950">4. Customer Data Handling &amp; Protection</h2>
          <p>
            Operational records inside MUN COMPUTER Business Manager are protected by role-based
            authentication and Firebase security rules. Public website visitors cannot read private
            customer records, application records, financial ledgers, or private feedback entries.
            We do not sell or rent customer information to third parties.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-slate-950">
            5. Interactive Maps &amp; Optional GPS Location
          </h2>
          <p>
            Our website uses Google Maps Platform to display MUN COMPUTER&rsquo;s centre location
            and road directions. Browser GPS geolocation is never collected automatically; it is
            requested only if you explicitly click &ldquo;Use My GPS &amp; Show Route&rdquo; to
            view distance and travel time from your current location. Map features are subject to{' '}
            <a
              href="https://policies.google.com/privacy?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 underline"
            >
              Google&rsquo;s Privacy Policy
            </a>
            .
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-slate-950">6. Data Deletion &amp; Correction Requests</h2>
          <p>
            Customers may request correction or deletion of their submitted feedback, enquiry, or
            publicly consented review at any time by contacting MUN COMPUTER using the official
            details below and providing their Feedback Reference ID or contact details for
            verification.
          </p>
        </div>

        <div className="card-3d rounded-2xl p-6 space-y-1.5 text-sm">
          <p className="font-semibold text-slate-950">Privacy Contact Details</p>
          <p>{settings.businessName || 'MUN COMPUTER'}</p>
          <p>{formatFullAddress(settings)}</p>
          <p className="font-mono-tabular">Phone: {settings.phone || '+91 8101352105'}</p>
          <p>Email: {settings.email || 'MUNCOMPUTER2019@GMAIL.COM'}</p>
        </div>
      </section>
    </div>
  );
};
