import React from 'react';
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

export const NotFoundPage: React.FC = () => {
  useDocumentMeta({
    title: 'Page Not Found – MUN COMPUTER',
    description: 'The requested page could not be found on MUN COMPUTER.',
  });

  return (
    <div className="bg-white py-24 px-4">
      <div className="max-w-lg mx-auto border border-slate-200 rounded-xl p-8 text-center space-y-4">
        <p className="font-mono-tabular text-xs font-semibold text-blue-800">404</p>
        <h1 className="font-display text-2xl font-bold text-slate-950">Page Not Found</h1>
        <p className="text-sm text-slate-600">
          The page you requested does not exist or may have been moved.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="px-4 py-2.5 text-sm font-semibold text-white bg-blue-800 rounded-lg hover:bg-blue-900 transition-colors"
          >
            Back to Home
          </Link>
          <Link
            to="/services"
            className="px-4 py-2.5 text-sm font-medium text-slate-800 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Explore Services
          </Link>
        </div>
      </div>
    </div>
  );
};
