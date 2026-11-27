import React, { useEffect, useMemo, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { formatFirestoreDate } from '../services/publicData';
import type { NoticeCategory, PublicNotice } from '../types';

const NOTICE_CATEGORIES: ('All' | NoticeCategory)[] = [
  'All',
  'Business Announcement',
  'Service Notice',
  'Holiday Notice',
  'Customer Information',
  'General Update',
];

export const NoticesPage: React.FC = () => {
  const [notices, setNotices] = useState<PublicNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<'All' | NoticeCategory>('All');
  const [activeNotice, setActiveNotice] = useState<PublicNotice | null>(null);

  useDocumentMeta({
    title: 'Notice Board – MUN COMPUTER',
    description:
      'Official announcements, service notices, holiday schedules, and customer updates from MUN COMPUTER.',
  });

  useEffect(() => {
    const q = query(collection(db, 'public_notices'), where('status', '==', 'published'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        const items = snap.docs
          .map((d) => ({ id: d.id, ...(d.data() as Omit<PublicNotice, 'id'>) }))
          .sort((a, b) => {
            const ta = a.publishedAt?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
            const tb = b.publishedAt?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
            return tb - ta;
          });
        setNotices(items);
        setLoading(false);
      },
      () => {
        setNotices([]);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    if (selectedCategory === 'All') return notices;
    return notices.filter((n) => n.category === selectedCategory);
  }, [notices, selectedCategory]);

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-3d-stage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs sm:text-sm font-medium text-blue-800">Official Announcements</p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Notice Board
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Only Admin-approved and published notices are shown here, including service updates,
              holiday notices, and important customer information.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-wrap items-center gap-2">
          {NOTICE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg cursor-pointer whitespace-nowrap ${
                selectedCategory === cat ? 'nav-3d-active' : 'nav-3d text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="card-3d rounded-2xl p-8 text-sm text-slate-500">
            Loading published notices...
          </div>
        ) : filtered.length === 0 ? (
          <div className="card-3d rounded-2xl p-10 text-center space-y-2">
            <Bell className="w-6 h-6 text-slate-400 mx-auto" />
            <p className="text-base font-semibold text-slate-900">No published notices found</p>
            <p className="text-sm text-slate-600">
              Official announcements published by MUN COMPUTER Admin will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((notice) => (
              <article
                key={notice.id}
                className="card-3d-interactive rounded-2xl p-6 flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-medium text-blue-800">{notice.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono-tabular">
                      {formatFirestoreDate(notice.publishedAt || notice.createdAt)}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className={notice.isExpired ? 'text-slate-500' : 'text-emerald-700 font-medium'}>
                      {notice.isExpired ? 'Expired' : 'Active'}
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-semibold text-slate-950">
                    {notice.title}
                  </h2>
                  <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {notice.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  {notice.expiresAt ? (
                    <span className="text-slate-500 font-mono-tabular">
                      Valid until: {notice.expiresAt}
                    </span>
                  ) : (
                    <span className="text-slate-400">Official Notice</span>
                  )}
                  <button
                    type="button"
                    onClick={() => setActiveNotice(notice)}
                    className="font-semibold text-blue-800 hover:text-blue-950 cursor-pointer"
                  >
                    Read Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {activeNotice && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="notice-modal-title"
          className="fixed inset-0 z-50 bg-slate-950/50 flex items-center justify-center p-4"
        >
          <div className="card-3d max-w-xl w-full rounded-2xl p-6 sm:p-8 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-blue-800">{activeNotice.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono-tabular">
                    {formatFirestoreDate(activeNotice.publishedAt || activeNotice.createdAt)}
                  </span>
                </div>
                <h2
                  id="notice-modal-title"
                  className="font-display text-xl font-bold text-slate-950"
                >
                  {activeNotice.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveNotice(null)}
                aria-label="Close notice details"
                className="nav-3d p-2 rounded-lg text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {activeNotice.description}
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <span>Status: {activeNotice.isExpired ? 'Expired' : 'Active'}</span>
              {activeNotice.expiresAt && (
                <span className="font-mono-tabular">Expiry: {activeNotice.expiresAt}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
