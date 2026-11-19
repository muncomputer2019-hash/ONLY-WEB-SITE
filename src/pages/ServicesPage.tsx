import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, Search, X } from 'lucide-react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  FULL_SERVICES_CATALOG,
  SERVICE_GROUPS,
  TOTAL_CATALOG_SERVICES,
  type ServiceGroup,
} from '../config/servicesCatalog';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import type { PublicServiceItem } from '../types';
import { CategoryIcon } from '../components/CategoryIcon';

interface CombinedServiceEntry {
  id: string;
  code?: number;
  title: string;
  category: string;
  description: string;
  requiredDocuments?: string;
}

export const ServicesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedGroup, setSelectedGroup] = useState<'All' | ServiceGroup>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [customFirestoreServices, setCustomFirestoreServices] = useState<PublicServiceItem[]>([]);

  useDocumentMeta({
    title: 'Services Directory (40 Categories · 580+ Services) – MUN COMPUTER',
    description:
      'Browse all 40 categories and 580+ digital, citizen, banking, government scheme, education, land, transport, and printing services at MUN COMPUTER.',
  });

  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setSelectedCategory(catParam);
      setSelectedGroup('All');
    } else {
      setSelectedCategory('All');
    }
  }, [searchParams]);

  useEffect(() => {
    const q = query(collection(db, 'public_services'), orderBy('sortOrder', 'asc'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<PublicServiceItem, 'id'>) }))
          .filter((item) => item.isActive);
        setCustomFirestoreServices(items);
      },
      () => setCustomFirestoreServices([])
    );
    return () => unsubscribe();
  }, []);

  // Build unified category + service catalog merging any custom Firestore public_services
  const unifiedCatalog = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        number: string;
        title: string;
        group: ServiceGroup;
        shortDescription: string;
        iconName: string;
        items: CombinedServiceEntry[];
      }
    >();

    for (const cat of FULL_SERVICES_CATALOG) {
      map.set(cat.title.toLowerCase(), {
        id: cat.id,
        number: cat.number,
        title: cat.title,
        group: cat.group,
        shortDescription: cat.shortDescription,
        iconName: cat.iconName,
        items: cat.services.map((s) => ({
          id: `catalog-${s.code}`,
          code: s.code,
          title: s.title,
          category: cat.title,
          description: `${s.title} assistance under ${cat.title}.`,
        })),
      });
    }

    for (const custom of customFirestoreServices) {
      const key = custom.category.toLowerCase();
      const target = map.get(key);
      if (target) {
        const exists = target.items.some(
          (i) => i.title.toLowerCase() === custom.title.toLowerCase()
        );
        if (!exists) {
          target.items.push({
            id: custom.id,
            title: custom.title,
            category: custom.category,
            description: custom.fullDescription || custom.shortDescription,
            requiredDocuments: custom.requiredDocuments,
          });
        }
      }
    }

    return Array.from(map.values());
  }, [customFirestoreServices]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const trimmedSearch = searchTerm.trim().toLowerCase();

  const visibleCategories = useMemo(() => {
    return unifiedCatalog.filter((cat) => {
      if (selectedGroup !== 'All' && cat.group !== selectedGroup) return false;
      if (
        selectedCategory !== 'All' &&
        cat.title.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      return true;
    });
  }, [unifiedCatalog, selectedGroup, selectedCategory]);

  const searchResults = useMemo(() => {
    if (!trimmedSearch) return [];
    const results: { categoryTitle: string; categoryNumber: string; items: CombinedServiceEntry[] }[] = [];
    for (const cat of visibleCategories) {
      const matchedItems = cat.items.filter(
        (item) =>
          item.title.toLowerCase().includes(trimmedSearch) ||
          cat.title.toLowerCase().includes(trimmedSearch) ||
          item.description.toLowerCase().includes(trimmedSearch)
      );
      if (matchedItems.length > 0) {
        results.push({
          categoryTitle: cat.title,
          categoryNumber: cat.number,
          items: matchedItems,
        });
      }
    }
    return results;
  }, [visibleCategories, trimmedSearch]);

  const totalMatchingCount = useMemo(
    () => searchResults.reduce((sum, g) => sum + g.items.length, 0),
    [searchResults]
  );

  const selectedCategoryObj =
    selectedCategory !== 'All'
      ? unifiedCatalog.find((c) => c.title.toLowerCase() === selectedCategory.toLowerCase()) || null
      : null;

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-6">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs sm:text-sm font-medium text-blue-800">
              Complete Service Directory · {FULL_SERVICES_CATALOG.length} Categories ·{' '}
              <span className="font-mono-tabular">{TOTAL_CATALOG_SERVICES}</span> Services
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Our Digital &amp; Computer Services
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Search any service by name or select one of our 40 main categories below. Service
              guidance and required documents are explained clearly at our centre or upon enquiry.
            </p>
          </div>

          {/* Search Bar & Group Tabs */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search 580+ services (e.g. Aadhaar, Lakshmir Bhandar, PVC, PAN, Passport)..."
                  aria-label="Search all services"
                  className="w-full pl-10 pr-9 py-2.5 text-sm border border-slate-300 rounded-lg bg-white text-slate-950 placeholder:text-slate-400 focus:outline-none focus:border-blue-800"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    aria-label="Clear search"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => handleCategoryChange('All')}
                  className="px-4 py-2.5 text-sm font-medium bg-white border border-slate-300 rounded-lg hover:bg-slate-100 cursor-pointer whitespace-nowrap"
                >
                  View All 40 Categories
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {SERVICE_GROUPS.map((group) => (
                <button
                  key={group}
                  type="button"
                  onClick={() => {
                    setSelectedGroup(group);
                    if (selectedCategory !== 'All') {
                      handleCategoryChange('All');
                    }
                  }}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer whitespace-nowrap ${
                    selectedGroup === group
                      ? 'bg-slate-950 text-white border-slate-950'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {group === 'All' ? 'All Groups' : group}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Category Sidebar */}
          <aside className="lg:col-span-4 border border-slate-200 rounded-xl bg-white overflow-hidden lg:sticky lg:top-20">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-950">
                Main Categories ({visibleCategories.length})
              </h2>
              {selectedCategory !== 'All' && (
                <button
                  type="button"
                  onClick={() => handleCategoryChange('All')}
                  className="text-xs font-medium text-blue-800 hover:underline cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>

            <div className="max-h-[340px] lg:max-h-[600px] overflow-y-auto divide-y divide-slate-100">
              <button
                type="button"
                onClick={() => handleCategoryChange('All')}
                className={`w-full px-4 py-3 text-left text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>All 40 Categories</span>
                <span className="font-mono-tabular text-xs text-slate-500">
                  {TOTAL_CATALOG_SERVICES}
                </span>
              </button>

              {unifiedCatalog
                .filter((c) => selectedGroup === 'All' || c.group === selectedGroup)
                .map((cat) => {
                  const isActive =
                    selectedCategory.toLowerCase() === cat.title.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryChange(cat.title)}
                      className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-blue-800 text-white font-semibold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="truncate">
                        <span
                          className={`font-mono-tabular mr-2 ${
                            isActive ? 'text-blue-200' : 'text-slate-400'
                          }`}
                        >
                          {cat.number}.
                        </span>
                        {cat.title}
                      </span>
                      <span
                        className={`font-mono-tabular text-xs shrink-0 ${
                          isActive ? 'text-blue-100' : 'text-slate-400'
                        }`}
                      >
                        {cat.items.length}
                      </span>
                    </button>
                  );
                })}
            </div>
          </aside>

          {/* Main Catalogue Content */}
          <div className="lg:col-span-8 space-y-8">
            {trimmedSearch ? (
              /* Search Results View */
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <p className="text-sm text-slate-700">
                    Found{' '}
                    <span className="font-mono-tabular font-semibold text-slate-950">
                      {totalMatchingCount}
                    </span>{' '}
                    matching services for &ldquo;{searchTerm}&rdquo;
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="text-xs font-semibold text-blue-800 hover:underline cursor-pointer"
                  >
                    Clear Search
                  </button>
                </div>

                {searchResults.length === 0 ? (
                  <div className="border border-slate-200 rounded-xl p-10 bg-slate-50 text-center space-y-3">
                    <p className="text-base font-semibold text-slate-900">
                      No matching services found
                    </p>
                    <p className="text-sm text-slate-600">
                      Try searching with a shorter keyword or contact us directly for assistance.
                    </p>
                  </div>
                ) : (
                  searchResults.map((group) => (
                    <div key={group.categoryNumber} className="space-y-3">
                      <h2 className="font-display text-base font-bold text-slate-950 flex items-center gap-2">
                        <span className="font-mono-tabular text-xs text-blue-800">
                          {group.categoryNumber}.
                        </span>
                        {group.categoryTitle}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {group.items.map((srv) => (
                          <div
                            key={srv.id}
                            className="border border-slate-200 rounded-xl p-4 bg-white flex flex-col justify-between gap-3"
                          >
                            <div className="space-y-1">
                              {srv.code && (
                                <span className="font-mono-tabular text-xs text-slate-400">
                                  #{String(srv.code).padStart(3, '0')}
                                </span>
                              )}
                              <h3 className="text-sm font-semibold text-slate-950">{srv.title}</h3>
                              {srv.requiredDocuments && (
                                <p className="text-xs text-slate-500">{srv.requiredDocuments}</p>
                              )}
                            </div>
                            <Link
                              to={`/contact?service=${encodeURIComponent(
                                `${group.categoryTitle} - ${srv.title}`
                              )}`}
                              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-950"
                            >
                              Enquire
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : selectedCategoryObj ? (
              /* Single Selected Category Full List View */
              <div className="space-y-6">
                <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 text-xs font-medium text-blue-800">
                      <span className="font-mono-tabular">
                        Category {selectedCategoryObj.number}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedCategoryObj.group}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono-tabular">
                        {selectedCategoryObj.items.length} services
                      </span>
                    </div>
                    <div className="w-9 h-9 rounded-lg border border-slate-200 bg-white text-blue-800 flex items-center justify-center shrink-0">
                      <CategoryIcon name={selectedCategoryObj.iconName} className="w-4 h-4" />
                    </div>
                  </div>
                  <h2 className="font-display text-2xl font-bold text-slate-950">
                    {selectedCategoryObj.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {selectedCategoryObj.shortDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedCategoryObj.items.map((srv, index) => (
                    <article
                      key={srv.id}
                      className="border border-slate-200 rounded-xl p-5 bg-white hover:border-slate-300 transition-colors flex flex-col justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <span className="font-mono-tabular text-xs text-slate-400">
                          {srv.code
                            ? `#${String(srv.code).padStart(3, '0')}`
                            : `#${String(index + 1).padStart(2, '0')}`}
                        </span>
                        <h3 className="font-display text-base font-semibold text-slate-950 leading-snug">
                          {srv.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {srv.description}
                        </p>
                        {srv.requiredDocuments && (
                          <p className="text-xs text-slate-500 pt-1">
                            Documents: {srv.requiredDocuments}
                          </p>
                        )}
                      </div>
                      <Link
                        to={`/contact?service=${encodeURIComponent(
                          `${selectedCategoryObj.title} - ${srv.title}`
                        )}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:text-blue-950 pt-2 border-t border-slate-100"
                      >
                        Enquire About This Service
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            ) : (
              /* Overview of All 40 Categories */
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {visibleCategories.map((cat) => (
                  <article
                    key={cat.id}
                    className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-mono-tabular text-xs font-medium text-blue-800">
                          {cat.number} · {cat.items.length} services
                        </span>
                        <div className="w-8 h-8 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 flex items-center justify-center shrink-0">
                          <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                        </div>
                      </div>
                      <h2 className="font-display text-lg font-bold text-slate-950">
                        {cat.title}
                      </h2>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {cat.shortDescription}
                      </p>
                      <ul className="space-y-1 pt-2 border-t border-slate-100 text-xs text-slate-700">
                        {cat.items.slice(0, 5).map((item) => (
                          <li key={item.id} className="truncate">
                            · {item.title}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCategoryChange(cat.title)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-800 hover:text-blue-950 pt-2 border-t border-slate-100 cursor-pointer text-left"
                    >
                      View all {cat.items.length} services in {cat.title}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </article>
                ))}
              </div>
            )}

            <div className="border border-slate-200 rounded-xl p-6 bg-slate-50 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Important Notice:</strong> MUN COMPUTER provides
              independent digital assistance, form preparation, printing, and follow-up support.
              Approval, verification, and issuance of any government document, certificate, banking
              service, or scheme benefit remain solely with the respective issuing authority.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
