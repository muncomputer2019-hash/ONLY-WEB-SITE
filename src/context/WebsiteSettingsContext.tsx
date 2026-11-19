import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import { DEFAULT_WEBSITE_SETTINGS, LOGO_ASSET_CONFIG } from '../config/businessConfig';
import type { WebsiteSettings } from '../types';

interface WebsiteSettingsContextValue {
  settings: WebsiteSettings;
  loading: boolean;
  effectiveLogoUrl: string;
}

const WebsiteSettingsContext = createContext<WebsiteSettingsContextValue>({
  settings: DEFAULT_WEBSITE_SETTINGS,
  loading: true,
  effectiveLogoUrl: LOGO_ASSET_CONFIG.staticLogoPath,
});

export const WebsiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<WebsiteSettings>(DEFAULT_WEBSITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'website_settings', 'main');
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as Partial<WebsiteSettings>;
          setSettings({
            ...DEFAULT_WEBSITE_SETTINGS,
            ...data,
          });
        } else {
          setSettings(DEFAULT_WEBSITE_SETTINGS);
        }
        setLoading(false);
      },
      () => {
        setSettings(DEFAULT_WEBSITE_SETTINGS);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const effectiveLogoUrl =
    settings.logoDataUrl?.trim() || LOGO_ASSET_CONFIG.staticLogoPath || '';

  useEffect(() => {
    const faviconSrc = settings.faviconDataUrl?.trim() || LOGO_ASSET_CONFIG.staticFaviconPath;
    if (!faviconSrc) return;
    let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.href = faviconSrc;
  }, [settings.faviconDataUrl]);

  return (
    <WebsiteSettingsContext.Provider value={{ settings, loading, effectiveLogoUrl }}>
      {children}
    </WebsiteSettingsContext.Provider>
  );
};

export function useWebsiteSettings(): WebsiteSettingsContextValue {
  return useContext(WebsiteSettingsContext);
}
