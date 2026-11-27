import React, { useState } from 'react';
import { CentreLocationMap } from '../components/CentreLocationMap';
import { Link, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react';
import { SERVICE_CATEGORIES, formatFullAddress } from '../config/businessConfig';
import { useWebsiteSettings } from '../context/WebsiteSettingsContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import {
  getShopMapsUrl,
  getWhatsAppUrl,
  submitContactEnquiry,
} from '../services/publicData';

export const ContactPage: React.FC = () => {
  const { settings } = useWebsiteSettings();
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service') || '';

  const parsedInitial = React.useMemo(() => {
    if (!initialService) return { category: '', subject: '' };
    const matchedCat = SERVICE_CATEGORIES.find(
      (c) => initialService === c.title || initialService.startsWith(`${c.title} - `)
    );
    if (matchedCat) {
      const specificService =
        initialService.length > matchedCat.title.length + 3
          ? initialService.slice(matchedCat.title.length + 3)
          : '';
      return {
        category: matchedCat.title,
        subject: specificService ? `Enquiry: ${specificService}` : '',
      };
    }
    return { category: '', subject: `Enquiry: ${initialService}` };
  }, [initialService]);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceCategory, setServiceCategory] = useState(parsedInitial.category);
  const [subject, setSubject] = useState(parsedInitial.subject);
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  React.useEffect(() => {
    setServiceCategory(parsedInitial.category);
    if (parsedInitial.subject) {
      setSubject(parsedInitial.subject);
    }
  }, [parsedInitial.category, parsedInitial.subject]);

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [sent, setSent] = useState(false);

  useDocumentMeta({
    title: 'Contact Us – MUN COMPUTER',
    description:
      'Contact MUN COMPUTER in Mamudpur, Juginda, Domkal, Murshidabad. Call +91 8101352105, WhatsApp, email, get directions, or send a service enquiry.',
  });

  const phoneClean = (settings.phone || '+91 8101352105').replace(/\s+/g, '');
  const whatsappUrl = getWhatsAppUrl(
    settings.whatsapp || '+91 8101352105',
    'Hello MUN COMPUTER, I have a question regarding your services.'
  );
  const mapsUrl = getShopMapsUrl(settings);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      await submitContactEnquiry({
        name,
        phone,
        email,
        serviceCategory,
        subject,
        message,
        honeypot,
      });
      setSent(true);
      setName('');
      setPhone('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to send enquiry right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-3d-stage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs sm:text-sm font-medium text-blue-800">Contact MUN COMPUTER</p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Get in Touch With Our Team
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Visit our centre in Mamudpur, call or message us on WhatsApp, or send a private
              service enquiry below.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Official Contact Information */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card-3d rounded-2xl p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-xl font-bold text-slate-950">
              Official Contact Information
            </h2>

            <div className="space-y-4 text-sm text-slate-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-950">
                    {settings.businessName || 'MUN COMPUTER'}
                  </p>
                  <p className="text-slate-600 leading-relaxed">{formatFullAddress(settings)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-blue-800 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Mobile &amp; Phone</p>
                  <a
                    href={`tel:${phoneClean}`}
                    className="font-mono-tabular font-semibold text-slate-950 hover:text-blue-800"
                  >
                    {settings.phone || '+91 8101352105'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">WhatsApp</p>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono-tabular font-semibold text-slate-950 hover:text-blue-800"
                  >
                    {settings.whatsapp || '+91 8101352105'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-blue-800 shrink-0" />
                <div>
                  <p className="text-xs text-slate-500">Email</p>
                  <a
                    href={`mailto:${settings.email || 'MUNCOMPUTER2019@GMAIL.COM'}`}
                    className="font-medium text-slate-950 hover:text-blue-800 break-all"
                  >
                    {settings.email || 'MUNCOMPUTER2019@GMAIL.COM'}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                <Clock className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-slate-500">Business Hours</p>
                  <p className="font-semibold text-slate-950">
                    {settings.businessHoursConfigured && settings.openingTime
                      ? `${settings.openingTime} – ${settings.closingTime || 'Closing TBD'}`
                      : 'Business Hours: To Be Announced'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${phoneClean}`}
                className="btn-3d-blue inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-white inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-900 rounded-lg"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                WhatsApp
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-3d-white col-span-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-800 rounded-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Get Directions
              </a>
            </div>
          </div>

          <div className="card-3d-interactive rounded-2xl p-6 space-y-2">
            <h3 className="text-sm font-semibold text-slate-950">Want to leave feedback?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Rate a service you received at MUN COMPUTER using our dedicated feedback form.
            </p>
            <Link
              to="/feedback"
              className="inline-block text-sm font-semibold text-blue-800 hover:text-blue-950"
            >
              Go to Customer Feedback →
            </Link>
          </div>
        </div>

        {/* Contact Enquiry Form */}
        <div className="lg:col-span-7">
          <div className="card-3d rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="font-display text-xl font-bold text-slate-950">
                Send a Service Enquiry
              </h2>
              <p className="text-sm text-slate-600">
                Enquiries are stored privately for our staff and are never displayed publicly.
              </p>
            </div>

            {sent ? (
              <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-emerald-950">
                      Your enquiry has been received by MUN COMPUTER.
                    </p>
                    <p className="text-xs text-emerald-800">
                      Our team will review your message and respond using your provided contact
                      details.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100 cursor-pointer"
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="ct-company">Company</label>
                  <input
                    id="ct-company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="ct-name" className="block text-sm font-medium text-slate-800">
                      Full Name *
                    </label>
                    <input
                      id="ct-name"
                      type="text"
                      required
                      maxLength={100}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="input-3d w-full px-3.5 py-2.5 text-sm rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="ct-phone" className="block text-sm font-medium text-slate-800">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      id="ct-phone"
                      type="tel"
                      maxLength={20}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 ..."
                      className="input-3d w-full px-3.5 py-2.5 text-sm rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="ct-email" className="block text-sm font-medium text-slate-800">
                      Email Address
                    </label>
                    <input
                      id="ct-email"
                      type="email"
                      maxLength={120}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="input-3d w-full px-3.5 py-2.5 text-sm rounded-lg"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="ct-cat" className="block text-sm font-medium text-slate-800">
                      Service Category (Optional)
                    </label>
                    <select
                      id="ct-cat"
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="input-3d w-full px-3.5 py-2.5 text-sm rounded-lg bg-white"
                    >
                      <option value="">General Enquiry</option>
                      {SERVICE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.title}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="ct-subject" className="block text-sm font-medium text-slate-800">
                    Subject *
                  </label>
                  <input
                    id="ct-subject"
                    type="text"
                    required
                    maxLength={160}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What service or document help do you need?"
                    className="input-3d w-full px-3.5 py-2.5 text-sm rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="ct-msg" className="block text-sm font-medium text-slate-800">
                    Enquiry Message *
                  </label>
                  <textarea
                    id="ct-msg"
                    required
                    rows={5}
                    maxLength={2000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please share details of your question (avoid posting sensitive OTPs or passwords)..."
                    className="input-3d w-full px-3.5 py-2.5 text-sm rounded-lg"
                  />
                </div>

                {errorMsg && (
                  <div
                    role="alert"
                    className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-800"
                  >
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-3d-blue w-full py-3 px-5 text-sm font-semibold rounded-lg disabled:opacity-60 cursor-pointer"
                >
                  {submitting ? 'Sending Enquiry...' : 'Submit Enquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <CentreLocationMap />
      </section>
    </div>
  );
};
