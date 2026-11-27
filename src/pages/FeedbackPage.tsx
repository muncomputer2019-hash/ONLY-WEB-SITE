import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Lock, Star } from 'lucide-react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../services/firebase';
import { SERVICE_CATEGORIES } from '../config/businessConfig';
import { useDocumentMeta } from '../hooks/useDocumentMeta';
import { submitCustomerFeedback } from '../services/publicData';
import type { PublicReview } from '../types';

export const FeedbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRatingParam = Number(searchParams.get('rating'));
  const validInitialRating =
    Number.isInteger(initialRatingParam) && initialRatingParam >= 1 && initialRatingParam <= 5
      ? initialRatingParam
      : 5;

  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [serviceCategory, setServiceCategory] = useState(SERVICE_CATEGORIES[0].title);
  const [serviceReferenceId, setServiceReferenceId] = useState('');
  const [rating, setRating] = useState<number>(validInitialRating);
  const [message, setMessage] = useState('');
  const [publicationConsent, setPublicationConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [reviews, setReviews] = useState<PublicReview[]>([]);

  useDocumentMeta({
    title: 'Customer Feedback – MUN COMPUTER',
    description:
      'Share your feedback and service rating with MUN COMPUTER. Read verified, customer-consented public reviews.',
  });

  useEffect(() => {
    const q = query(collection(db, 'public_reviews'), orderBy('approvedAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snap) => {
        setReviews(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<PublicReview, 'id'>) })));
      },
      () => setReviews([])
    );
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);
    try {
      const result = await submitCustomerFeedback({
        customerName,
        mobileNumber,
        serviceCategory,
        serviceReferenceId,
        rating,
        message,
        publicationConsent,
        honeypot,
      });
      setSubmittedCode(result.feedbackCode);
      setCustomerName('');
      setMobileNumber('');
      setServiceReferenceId('');
      setRating(5);
      setMessage('');
      setPublicationConsent(false);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to submit feedback right now.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white">
      <section className="border-b border-slate-200 bg-3d-stage">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="max-w-3xl space-y-3">
            <p className="text-xs sm:text-sm font-medium text-blue-800">Customer Feedback</p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950">
              Share Your Experience With MUN COMPUTER
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Your feedback is reviewed privately by our team. Mobile numbers are never published,
              and comments appear publicly only if you grant explicit publication consent and an
              Admin approves the review.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Feedback Submission Form */}
        <div className="lg:col-span-6">
          <div className="card-3d rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="font-display text-xl font-bold text-slate-950">
                Submit Customer Feedback
              </h2>
              <p className="text-sm text-slate-600">
                Fields marked with * are required.
              </p>
            </div>

            {submittedCode ? (
              <div className="border border-emerald-200 bg-emerald-50 rounded-xl p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-emerald-950">
                      Thank you for sharing your feedback with MUN COMPUTER. Your feedback has been
                      submitted successfully and will be reviewed by our team.
                    </p>
                    <p className="text-xs text-emerald-800 font-mono-tabular">
                      Feedback Reference ID: {submittedCode}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmittedCode(null)}
                  className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  Submit Another Feedback
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Spam honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="fb-website">Leave empty</label>
                  <input
                    id="fb-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="fb-name" className="block text-sm font-medium text-slate-800">
                      Customer Name (Optional)
                    </label>
                    <input
                      id="fb-name"
                      type="text"
                      maxLength={100}
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Your name"
                      className="input-3d w-full px-3.5 py-2.5 text-sm rounded-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="fb-mobile" className="block text-sm font-medium text-slate-800">
                      Mobile Number (Optional)
                    </label>
                    <input
                      id="fb-mobile"
                      type="tel"
                      maxLength={20}
                      value={mobileNumber}
                      onChange={(e) => setMobileNumber(e.target.value)}
                      placeholder="Never published publicly"
                      className="input-3d w-full px-3.5 py-2.5 text-sm rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="fb-category" className="block text-sm font-medium text-slate-800">
                      Service Category *
                    </label>
                    <select
                      id="fb-category"
                      required
                      value={serviceCategory}
                      onChange={(e) => setServiceCategory(e.target.value)}
                      className="input-3d w-full px-3.5 py-2.5 text-sm rounded-lg bg-white"
                    >
                      {SERVICE_CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.title}>
                          {cat.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="fb-ref" className="block text-sm font-medium text-slate-800">
                      Service Reference ID (Optional)
                    </label>
                    <input
                      id="fb-ref"
                      type="text"
                      maxLength={64}
                      value={serviceReferenceId}
                      onChange={(e) => setServiceReferenceId(e.target.value)}
                      placeholder="e.g. MC-APP-1024"
                      className="input-3d w-full px-3.5 py-2.5 text-sm rounded-lg font-mono-tabular"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="block text-sm font-medium text-slate-800">
                    Rating (1 to 5 Stars) *
                  </span>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setRating(value)}
                        aria-label={`Rate ${value} out of 5 stars`}
                        className={`p-2 rounded-lg transition-all cursor-pointer ${
                          value <= rating
                            ? 'bg-gradient-to-b from-amber-50 to-amber-100 border border-amber-300 border-b-[3px] border-b-amber-400 text-amber-500 shadow-sm -translate-y-0.5'
                            : 'nav-3d text-slate-300 hover:text-amber-400'
                        }`}
                      >
                        <Star className={`w-5 h-5 ${value <= rating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-mono-tabular text-slate-700">
                      {rating} / 5
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="fb-message" className="block text-sm font-medium text-slate-800">
                    Feedback Message *
                  </label>
                  <textarea
                    id="fb-message"
                    required
                    rows={4}
                    maxLength={2000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share how our team assisted you or how we can serve you better..."
                    className="input-3d w-full px-3.5 py-2.5 text-sm rounded-lg"
                  />
                </div>

                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-2.5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={publicationConsent}
                      onChange={(e) => setPublicationConsent(e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-800 focus:ring-blue-800"
                    />
                    <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      I grant explicit consent for MUN COMPUTER to publish my review (name or
                      &ldquo;Verified Customer&rdquo;, category, rating, and message) after team
                      approval. My mobile number will never be published.
                    </span>
                  </label>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Protected by our{' '}
                      <Link to="/privacy-policy" className="text-blue-800 underline">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </p>
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
                  {submitting ? 'Submitting Feedback...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Approved Public Reviews */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-slate-950">
              Approved Public Reviews
            </h2>
            <p className="text-sm text-slate-600">
              Only reviews with explicit customer consent and Admin approval are displayed publicly.
            </p>
          </div>

          {reviews.length === 0 ? (
            <div className="card-3d rounded-2xl p-10 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-800">
                No customer reviews have been published yet.
              </p>
              <p className="text-xs text-slate-500">
                Once customers consent to public display and our Admin approves reviews, they will
                appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <article
                  key={rev.id}
                  className="card-3d rounded-2xl p-6 space-y-3"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= rev.rating ? 'fill-current' : 'text-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500">{rev.serviceCategory}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{rev.message}</p>
                  {rev.adminResponse && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <span className="font-semibold text-slate-950">Response from MUN COMPUTER: </span>
                      {rev.adminResponse}
                    </div>
                  )}
                  <p className="text-xs font-medium text-slate-900">— {rev.displayName}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
