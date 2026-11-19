import React from 'react';
import { PublicFooter } from './PublicFooter';
import { PublicHeader } from './PublicHeader';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-950">
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
};
