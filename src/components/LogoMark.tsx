import React, { useState } from 'react';
import { useWebsiteSettings } from '../context/WebsiteSettingsContext';

interface LogoMarkProps {
  variant?: 'header' | 'footer';
}

export const LogoMark: React.FC<LogoMarkProps> = ({ variant = 'header' }) => {
  const { settings, effectiveLogoUrl } = useWebsiteSettings();
  const [imgError, setImgError] = useState(false);

  const showUploadedLogo = Boolean(effectiveLogoUrl) && !imgError;

  if (showUploadedLogo) {
    if (variant === 'footer') {
      return (
        <div className="inline-flex items-center gap-2.5 shrink-0">
          <div className="bg-white rounded-lg px-3 py-1.5 shadow-sm overflow-hidden flex items-center justify-center shrink-0 h-14">
            <img
              src={effectiveLogoUrl}
              alt={`${settings.businessName || 'MUN COMPUTER'} official logo`}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="h-full w-auto max-w-[175px] object-contain"
            />
          </div>
          <span className="sr-only">{settings.businessName || 'MUN COMPUTER'}</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="bg-white overflow-hidden flex items-center justify-center shrink-0 h-11 sm:h-12">
          <img
            src={effectiveLogoUrl}
            alt={`${settings.businessName || 'MUN COMPUTER'} official logo`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="h-full w-auto max-w-[175px] object-contain"
          />
        </div>
        <span className="sr-only">{settings.businessName || 'MUN COMPUTER'}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2.5 shrink-0">
      <div
        aria-label="MUN COMPUTER logo"
        className={`flex items-center justify-center border border-slate-300 bg-slate-50 text-slate-900 font-display font-bold tracking-tight shrink-0 ${
          variant === 'header' ? 'h-8 px-2 text-xs rounded-md' : 'h-10 px-2.5 text-xs rounded-md'
        }`}
      >
        MC
      </div>
      <span
        className={`font-display font-bold tracking-tight whitespace-nowrap shrink-0 ${
          variant === 'header' ? 'text-base sm:text-lg text-slate-950' : 'text-lg text-white'
        }`}
      >
        {settings.businessName || 'MUN COMPUTER'}
      </span>
    </div>
  );
};
