import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Bell,
  ChevronDown,
  ChevronUp,
  Clock,
  LayoutGrid,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  Send,
  Star,
} from 'lucide-react';
import { collection, limit, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  OFFICIAL_WEB_APP_URL,
  SHOP_STOREFRONT_IMAGE,
  formatFullAddress,
} from '../config/businessConfig';
import {
  FULL_SERVICES_CATALOG,
  SERVICE_GROUPS,
  TOTAL_CATALOG_SERVICES,
  type ServiceGroup,
} from '../config/servicesCatalog';
import { useWebsiteSettings } from '../context/WebsiteSettingsContext';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { formatFirestoreDate, getWhatsAppUrl } from '../services/publicData';
import type { PublicNotice, PublicReview } from '../types';
import { CategoryIcon } from '../components/CategoryIcon';
import { CentreLocationMap } from '../components/CentreLocationMap';

const FEATURED_CATEGORY_IDS = [
  'cat-01-aadhaar',
  'cat-04-pan',
  'cat-02-voter',
  'cat-03-ration',
  'cat-13-banking-financial',
  'cat-10-govt-schemes',
  'cat-27-wb-govt',
  'cat-14-education-student',
  'cat-18-printing-digital',
  'cat-34-utility-govt-bills',
];

export const HomePage: React.FC = () => {
  const { settings } = useWebsiteSettings();
  const [heroImgError, setHeroImgError] = useState(false);
  const [aboutImgError, setAboutImgError] = useState(false);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [showAllCatalog, setShowAllCatalog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<'All' | ServiceGroup>('All');
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [notices, setNotices] = useState<PublicNotice[]>([]);

  useDocumentMeta({
    title: 'MUN COMPUTER – Digital Service & Computer Solutions Centre',
    description:
      'Official website of MUN COMPUTER in Mamudpur, Domkal, Murshidabad. Explore 40 service categories and 580+ digital, banking, certificate, scheme, and printing services.',
  });

  useEffect(() => {
    const reviewsQuery = query(
      collection(db, 'public_reviews'),
      orderBy('approvedAt', 'desc'),
      limit(2)
    );
    const unsubReviews = onSnapshot(
      reviewsQuery,
      (snap) => {
        setReviews(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PublicReview, 'id'>) })));
      },
      () => setReviews([])
    );

    const noticesQuery = query(
      collection(db, 'public_notices'),
      where('status', '==', 'published'),
      limit(3)
    );
    const unsubNotices = onSnapshot(
      noticesQuery,
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<PublicNotice, 'id'>),
        }));
        setNotices(list);
      },
      () => setNotices([])
    );

    return () => {
      unsubReviews();
      unsubNotices();
    };
  }, []);

  const featuredCategories = useMemo(
    () =>
      FEATURED_CATEGORY_IDS.map((id) => FULL_SERVICES_CATALOG.find((c) => c.id === id)).filter(
        (c): c is (typeof FULL_SERVICES_CATALOG)[number] => Boolean(c)
      ),
    []
  );

  const filteredCategories = useMemo(() => {
    if (selectedGroup === 'All') return FULL_SERVICES_CATALOG;
    return FULL_SERVICES_CATALOG.filter((cat) => cat.group === selectedGroup);
  }, [selectedGroup]);

  const configuredHeroUrl = settings.heroImageUrl?.trim();
  const heroImageSrc =
    configuredHeroUrl && !configuredHeroUrl.includes('/src/assets/images/')
      ? configuredHeroUrl
      : SHOP_STOREFRONT_IMAGE;

  const fullAddress = formatFullAddress(settings);
  const phoneDisplay = settings.phone || '+91 8101352105';
  const whatsappDisplay = settings.whatsapp || '+91 8101352105';
  const emailDisplay = settings.email || 'MUNCOMPUTER2019@GMAIL.COM';
  const phoneClean = phoneDisplay.replace(/\s+/g, '');
  const whatsappUrl = getWhatsAppUrl(
    whatsappDisplay,
    'Hello MUN COMPUTER, I would like to enquire about a service.'
  );

  const customHeading = settings.heroHeading?.trim();
  const useDefaultTwoToneHeading =
    !customHeading || customHeading.toUpperCase() === 'WELCOME TO MUN COMPUTER';

  return (
    <div className="bg-white text-slate-950">
      {/* BAND 1: CORPORATE SKY-BLUE HERO SECTION */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-white via-[#eef5ff] to-[#d9e9ff]">
        <div
          aria-hidden="true"
          className="hidden lg:block absolute inset-y-0 right-0 w-[18%] bg-gradient-to-bl from-[#0a3276] via-[#0f4c9a] to-transparent opacity-90 pointer-events-none"
          style={{ clipPath: 'polygon(48% 0, 100% 0, 100% 100%, 10% 100%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left Copy & 3 Action CTAs */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2.5">
                {useDefaultTwoToneHeading ? (
                  <h1 className="font-display font-extrabold tracking-tight leading-[1.05]">
                    <span className="block text-xl sm:text-2xl font-extrabold text-slate-900 tracking-wide mb-1">
                      WELCOME TO
                    </span>
                    <span
                      className="block leading-none"
                      style={{ fontSize: 'clamp(2.25rem, 4.4vw, 3.6rem)' }}
                    >
                      <span className="text-[#0a3276]">MUN</span>{' '}
                      <span className="text-[#dc2626]">COMPUTER</span>
                    </span>
                  </h1>
                ) : (
                  <h1
                    className="font-display font-extrabold tracking-tight text-[#0a3276] leading-[1.1]"
                    style={{ fontSize: 'clamp(2.1rem, 4vw, 3.35rem)', textWrap: 'balance' }}
                  >
                    {customHeading}
                  </h1>
                )}

                <p className="text-base sm:text-lg font-bold text-slate-900 leading-snug pt-1">
                  {settings.heroSubtitle ||
                    'Your Trusted Digital Service & Computer Solutions Centre.'}
                </p>
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
                  {settings.heroDescription ||
                    'MUN COMPUTER provides digital service assistance, computer solutions, documentation support and customer-focused services.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0f4c9a] rounded-lg hover:bg-[#0a3276] transition-colors shadow-xs whitespace-nowrap shrink-0"
                >
                  <LayoutGrid className="w-4 h-4 shrink-0" />
                  <span>Explore Our Services</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>

                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#0a3276] bg-white border border-[#0f4c9a]/35 rounded-lg hover:bg-blue-50 transition-colors shadow-xs whitespace-nowrap shrink-0"
                >
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Contact Us</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </Link>

                <a
                  href={OFFICIAL_WEB_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#dc2626] rounded-lg hover:bg-[#b91c1c] transition-colors shadow-xs whitespace-nowrap shrink-0"
                >
                  <Lock className="w-4 h-4 shrink-0" />
                  <span>Official Login</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </a>
              </div>

              <p className="text-xs font-medium text-slate-600 pt-1">
                {fullAddress} <span aria-hidden="true">·</span>{' '}
                <span className="font-mono-tabular font-semibold text-[#0a3276]">
                  {FULL_SERVICES_CATALOG.length} Categories · {TOTAL_CATALOG_SERVICES} Services
                </span>
              </p>
            </div>

            {/* Right Column: Slogan + Real Centre Storefront Photo */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
                <div>
                  <p className="font-display italic font-bold text-[#0a3276] text-base sm:text-lg leading-tight">
                    Digital India · Digital Service · Better Tomorrow
                  </p>
                  <div className="h-1 w-28 bg-gradient-to-r from-[#0a3276] via-[#0f4c9a] to-[#dc2626] rounded-full mt-1" />
                </div>
                <a
                  href="#centre-gps-map"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a3276] hover:text-[#dc2626] transition-colors whitespace-nowrap"
                >
                  <MapPin className="w-3.5 h-3.5 shrink-0" />
                  <span>Locate Centre on GPS Map</span>
                </a>
              </div>

              <div className="rounded-2xl bg-white p-2 border border-blue-200/90 shadow-lg">
                <div className="rounded-xl overflow-hidden bg-slate-100 aspect-16/10 flex items-center justify-center">
                  {!heroImgError ? (
                    <img
                      src={heroImageSrc}
                      alt="MUN COMPUTER physical service centre storefront in Mamudpur, Juginda, Domkal"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgError(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="p-8 text-center space-y-1.5">
                      <p className="font-display font-bold text-[#0a3276] text-lg">MUN COMPUTER</p>
                      <p className="text-xs text-slate-600">
                        Digital Service &amp; Computer Solutions Centre · Mamudpur, Domkal
                      </p>
                    </div>
                  )}
                </div>
                <div className="px-3 py-2 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
                  <span className="font-semibold text-slate-900">
                    {settings.businessName || 'MUN COMPUTER'} ·{' '}
                    {settings.shopMapAddress?.trim() || 'Mamudpur, Domkal'}
                  </span>
                  <span className="font-mono-tabular text-[#0a3276] font-medium">
                    {phoneDisplay}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BAND 2: ABOUT MUN COMPUTER (4 COLS) + SERVICES DIRECTORY HIGHLIGHT (8 COLS) */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* Left: About MUN COMPUTER with Circular Storefront Portrait */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-white border-4 border-[#dce8f8] shadow-sm shrink-0 overflow-hidden">
                  {!aboutImgError ? (
                    <img
                      src={heroImageSrc}
                      alt="MUN COMPUTER centre"
                      referrerPolicy="no-referrer"
                      onError={() => setAboutImgError(true)}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-[#eef5ff] flex items-center justify-center font-display font-bold text-[#0a3276] text-xs text-center p-2">
                      MUN COMPUTER
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <h2 className="font-display text-2xl font-extrabold tracking-tight text-slate-950 leading-tight">
                    About <span className="text-[#0a3276]">MUN COMPUTER</span>
                  </h2>
                  <div className="h-1 w-14 bg-[#0f4c9a] rounded-full" />
                </div>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">{settings.aboutIntro}</p>

              <div className="pt-1">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#0f4c9a] rounded-lg hover:bg-[#0a3276] transition-colors shadow-xs whitespace-nowrap"
                >
                  <span>Know More</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Our Digital & Computer Services (5x2 Corporate Tile Grid) */}
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight text-slate-950">
                    Our Digital &amp; Computer Services
                  </h2>
                  <div className="h-1 w-16 bg-[#0f4c9a] rounded-full" />
                </div>

                <Link
                  to="/services"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-[#0a3276] bg-white border border-slate-300 rounded-lg hover:bg-blue-50 hover:border-[#0f4c9a] transition-colors whitespace-nowrap self-start sm:self-auto"
                >
                  <span>View All Services ({TOTAL_CATALOG_SERVICES})</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Featured 5x2 Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {featuredCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/services?category=${encodeURIComponent(cat.title)}`}
                    className="group border border-slate-200 rounded-xl p-3.5 bg-gradient-to-b from-white to-[#f6f9ff] hover:border-[#0f4c9a] hover:shadow-sm transition-all flex flex-col items-center text-center gap-2.5"
                  >
                    <div className="w-11 h-11 rounded-xl bg-[#e7f0fc] text-[#0a3276] group-hover:bg-[#0f4c9a] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                      <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-bold text-slate-900 leading-snug group-hover:text-[#0a3276] line-clamp-2">
                        {cat.title}
                      </h3>
                      <p className="font-mono-tabular text-[11px] text-slate-500">
                        {cat.services.length} services
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Expandable / Group Filter Strip for All 40 Categories */}
              <div className="pt-1 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-slate-600">
                  Full catalogue includes{' '}
                  <span className="font-mono-tabular font-semibold text-slate-900">
                    {FULL_SERVICES_CATALOG.length} categories
                  </span>{' '}
                  &amp;{' '}
                  <span className="font-mono-tabular font-semibold text-slate-900">
                    {TOTAL_CATALOG_SERVICES} services
                  </span>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => setShowAllCatalog((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0a3276] hover:text-[#dc2626] transition-colors cursor-pointer"
                >
                  <span>
                    {showAllCatalog
                      ? 'Hide Full 40 Categories'
                      : `Browse All ${FULL_SERVICES_CATALOG.length} Categories Here`}
                  </span>
                  {showAllCatalog ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {showAllCatalog && (
            <div className="mt-8 pt-8 border-t border-slate-200 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                {SERVICE_GROUPS.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setSelectedGroup(group)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                      selectedGroup === group
                        ? 'bg-[#0a3276] text-white border-[#0a3276]'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {group === 'All' ? `All (${FULL_SERVICES_CATALOG.length})` : group}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {filteredCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    to={`/services?category=${encodeURIComponent(cat.title)}`}
                    className="group border border-slate-200 rounded-xl p-4 bg-white hover:border-[#0f4c9a] transition-colors flex flex-col justify-between gap-2.5"
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="space-y-1">
                        <span className="font-mono-tabular text-[11px] font-semibold text-[#0f4c9a]">
                          {cat.number} · {cat.services.length} services
                        </span>
                        <h3 className="text-sm font-bold text-slate-950 group-hover:text-[#0a3276] leading-snug">
                          {cat.title}
                        </h3>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-[#eef5ff] text-[#0a3276] flex items-center justify-center shrink-0">
                        <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{cat.shortDescription}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* BAND 3: 4-PANEL LIVE OPERATIONS STRIP (FEEDBACK & REVIEWS · NOTICE BOARD · BUSINESS HOURS · CONTACT US) */}
      <section className="border-b border-slate-200 bg-[#f4f7fb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 items-stretch">
            {/* PANEL 1: Customer Feedback + Public Reviews (4 cols) */}
            <div className="xl:col-span-4 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden grid grid-cols-1 sm:grid-cols-2">
              {/* Left side: Interactive Rating CTA */}
              <div className="flex flex-col border-b sm:border-b-0 sm:border-r border-slate-100">
                <div className="bg-gradient-to-r from-[#0a3276] to-[#1455b0] px-4 py-2.5 flex items-center gap-2 text-white">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400 shrink-0" />
                  <h2 className="font-display text-sm font-bold truncate">Customer Feedback</h2>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Share your experience with our services.
                    </p>
                    <div
                      className="flex items-center gap-1"
                      onMouseLeave={() => setHoveredRating(0)}
                      aria-label="Rate your experience from 1 to 5 stars"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Link
                          key={star}
                          to={`/feedback?rating=${star}`}
                          onMouseEnter={() => setHoveredRating(star)}
                          aria-label={`Submit ${star} star feedback`}
                          className="p-0.5 transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 transition-colors ${
                              hoveredRating === 0 || star <= hoveredRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-slate-100 text-slate-300'
                            }`}
                          />
                        </Link>
                      ))}
                    </div>
                  </div>
                  <Link
                    to="/feedback"
                    className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-semibold text-white bg-[#0f4c9a] rounded-lg hover:bg-[#0a3276] transition-colors whitespace-nowrap"
                  >
                    <span>Submit Feedback</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Right side: Live Approved Public Reviews */}
              <div className="flex flex-col">
                <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-display text-sm font-bold text-[#0a3276]">Public Reviews</h3>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                  {reviews.length === 0 ? (
                    <div className="space-y-1.5 text-xs text-slate-600 my-auto">
                      <p className="font-semibold text-slate-800">
                        No public reviews published yet.
                      </p>
                      <p className="text-slate-500 leading-relaxed">
                        Verified reviews appear here once published with customer consent.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {reviews.slice(0, 1).map((rev) => (
                        <article key={rev.id} className="space-y-2">
                          <p className="text-xs italic text-slate-700 leading-relaxed line-clamp-3">
                            &ldquo;{rev.message}&rdquo;
                          </p>
                          <p className="text-xs font-semibold text-slate-900">
                            &mdash; {rev.displayName}
                          </p>
                          <div
                            className="flex items-center gap-0.5"
                            aria-label={`${rev.rating} out of 5 stars`}
                          >
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${
                                  s <= rev.rating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </article>
                      ))}
                    </div>
                  )}

                  <Link
                    to="/feedback#public-reviews"
                    className="inline-flex items-center justify-end gap-1 text-xs font-semibold text-[#0a3276] hover:text-[#dc2626] transition-colors"
                  >
                    <span>View All Reviews</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* PANEL 2: Notice Board (3 cols) */}
            <div className="xl:col-span-3 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-[#0a3276] to-[#1455b0] px-4 py-2.5 flex items-center justify-between gap-2 text-white">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-amber-300 shrink-0" />
                  <h2 className="font-display text-sm font-bold">Notice Board</h2>
                </div>
                <Link
                  to="/notices"
                  className="inline-flex items-center gap-1 text-xs font-medium text-sky-100 hover:text-white whitespace-nowrap"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-center">
                {notices.length === 0 ? (
                  <p className="text-xs text-slate-600 leading-relaxed">
                    No published notices at this moment. Official service updates and holiday
                    announcements will appear here.
                  </p>
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {notices.map((notice) => (
                      <li key={notice.id} className="py-2.5 first:pt-0 last:pb-0">
                        <Link
                          to="/notices"
                          className="flex items-start justify-between gap-2.5 group"
                        >
                          <div className="flex items-start gap-2 min-w-0">
                            {!notice.isExpired && (
                              <span className="mt-0.5 px-1.5 py-0.5 text-[10px] font-bold bg-[#dc2626] text-white rounded-xs shrink-0">
                                NEW
                              </span>
                            )}
                            <span className="text-xs font-semibold text-slate-900 group-hover:text-[#0a3276] line-clamp-2">
                              {notice.title}
                            </span>
                          </div>
                          <span className="font-mono-tabular text-[11px] text-slate-500 whitespace-nowrap shrink-0">
                            {formatFirestoreDate(notice.publishedAt || notice.createdAt)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* PANEL 3: Business Hours (2 cols) */}
            <div className="xl:col-span-2 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
              <div className="px-4 py-2.5 border-b border-slate-100 flex items-center gap-2 text-[#0a3276]">
                <Clock className="w-4 h-4 shrink-0" />
                <h2 className="font-display text-sm font-bold">Business Hours</h2>
              </div>

              <div className="p-4 flex-1 flex flex-col items-center justify-center text-center">
                {!settings.businessHoursConfigured ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-900">Business Hours:</p>
                    <p className="text-base font-extrabold text-[#dc2626] leading-tight">
                      To Be Announced
                    </p>
                  </div>
                ) : (
                  <div className="w-full space-y-2 text-xs text-left">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-600">Opening</span>
                      <span className="font-mono-tabular font-bold text-slate-900">
                        {settings.openingTime || 'To Be Announced'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-slate-600">Closing</span>
                      <span className="font-mono-tabular font-bold text-slate-900">
                        {settings.closingTime || 'To Be Announced'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-600 block">Weekly Holidays:</span>
                      <span className="font-semibold text-slate-900">
                        {settings.weeklyHolidays && settings.weeklyHolidays.length > 0
                          ? settings.weeklyHolidays.join(', ')
                          : 'None'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PANEL 4: Contact Us (3 cols) */}
            <div className="xl:col-span-3 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
              <div className="bg-gradient-to-r from-[#0a3276] to-[#1455b0] px-4 py-2.5 flex items-center gap-2 text-white">
                <Send className="w-4 h-4 shrink-0" />
                <h2 className="font-display text-sm font-bold">Contact Us</h2>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between gap-3 text-xs">
                <div className="space-y-2">
                  <p className="font-bold text-[#0a3276] uppercase tracking-tight">
                    {settings.businessName || 'MUN COMPUTER'}
                  </p>
                  <p className="text-slate-700 leading-relaxed">{fullAddress}</p>
                </div>

                <div className="space-y-1.5 pt-1 border-t border-slate-100">
                  <a
                    href={`tel:${phoneClean}`}
                    className="flex items-center gap-2 text-slate-800 hover:text-[#0a3276] font-mono-tabular font-medium"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{phoneDisplay}</span>
                  </a>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-slate-800 hover:text-[#0a3276] font-mono-tabular font-medium"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{whatsappDisplay}</span>
                  </a>
                  <a
                    href={`mailto:${emailDisplay}`}
                    className="flex items-center gap-2 text-slate-800 hover:text-[#0a3276] font-medium break-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#0f4c9a] shrink-0" />
                    <span>{emailDisplay}</span>
                  </a>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <a
                    href="#centre-gps-map"
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#0a3276] rounded-lg hover:bg-[#06214d] transition-colors whitespace-nowrap"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Get Directions</span>
                  </a>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-1 px-3 py-2 text-xs font-semibold text-[#0a3276] border border-slate-300 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap"
                  >
                    <span>Send Enquiry</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BAND 4: INTERACTIVE GPS LOCATION MAP */}
      <section id="centre-gps-map" className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <CentreLocationMap />
        </div>
      </section>
    </div>
  );
};
