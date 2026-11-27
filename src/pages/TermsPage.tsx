import React from 'react';
import { formatFullAddress } from '../config/businessConfig';
import { useWebsiteSettings } from '../context/WebsiteSettingsContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const TermsPage: React.FC = () => {
  const { settings } = useWebsiteSettings();

  useDocumentMeta({
    title: 'Terms & Conditions – MUN COMPUTER',
    description:
      'Terms and Conditions for using MUN COMPUTER digital assistance, printing, and documentation services.',
  });

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-3d-stage">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-2">
          <p className="text-xs sm:text-sm font-medium text-blue-800">Legal Information</p>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
            Terms &amp; Conditions
          </h1>
          <p className="text-sm text-slate-600">MUN COMPUTER · Digital Service &amp; Computer Solutions Centre</p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8 text-sm sm:text-base text-slate-700 leading-relaxed">
        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-slate-950">1. Service Scope &amp; Independence</h2>
          <p>
            MUN COMPUTER is an independent local Digital Service &amp; Computer Solutions Centre
            offering computer work, printing, document formatting, and online application
            assistance. MUN COMPUTER is not a government department and does not claim government
            ownership or statutory authority.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-slate-950">2. Customer Responsibilities</h2>
          <p>
            Customers are responsible for providing accurate personal details, genuine supporting
            documents, and verifying all information entered on forms or printed drafts prior to
            final portal submission. MUN COMPUTER is not liable for delays or rejections caused by
            incomplete, inaccurate, or unverifiable documents provided by the applicant.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-slate-950">
            3. No Guarantee of Government Approval or Scheme Benefits
          </h2>
          <p>
            Our role is limited to technical preparation, digital typing, scanning, and online form
            submission assistance. MUN COMPUTER provides no guarantee of government application
            approval, certificate issuance, banking approval, scholarship selection, or scheme
            benefits. All decisions rest solely with the concerned portal authority or department.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-slate-950">4. Service Charges, Payments &amp; Refunds</h2>
          <p>
            Applicable computer, printing, and service assistance charges are communicated clearly at
            our centre before work begins. Official portal or statutory fees paid on external
            portals on behalf of a customer are non-refundable once submitted to the third-party
            portal, subject to that portal&rsquo;s own rules. Any refund regarding centre service
            charges is reviewed case-by-case if a requested task could not be initiated.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-slate-950">5. Complaints &amp; Contact Process</h2>
          <p>
            If you have a concern regarding any service, billing receipt, or submitted application
            follow-up, please contact us directly in person, by phone, via WhatsApp, or through our
            email address with your application reference details.
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-lg font-bold text-slate-950">6. Google Maps Integration Terms</h2>
          <p>
            Interactive centre location maps and GPS route calculations on this website integrate
            Google Maps Platform features and are subject to the{' '}
            <a
              href="https://maps.google.com/help/terms_maps/?utm_campaign=gmp_mcp_codeassist_v1_aistudio"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-800 underline"
            >
              Google Maps End User Additional Terms of Service
            </a>
            .
          </p>
        </div>

        <div className="card-3d rounded-2xl p-6 space-y-1.5 text-sm">
          <p className="font-semibold text-slate-950">Official Contact Details</p>
          <p>{settings.businessName || 'MUN COMPUTER'}</p>
          <p>{formatFullAddress(settings)}</p>
          <p className="font-mono-tabular">Phone / WhatsApp: {settings.phone || '+91 8101352105'}</p>
          <p>Email: {settings.email || 'MUNCOMPUTER2019@GMAIL.COM'}</p>
        </div>
      </section>
    </div>
  );
};
