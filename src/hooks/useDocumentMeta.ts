import { useEffect } from 'react';

interface DocumentMetaOptions {
  title: string;
  description: string;
}

export function useDocumentMeta({ title, description }: DocumentMetaOptions): void {
  useEffect(() => {
    document.title = title;

    const updateMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) {
        el.setAttribute('content', content);
      }
    };

    updateMeta('meta[name="description"]', description);
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[name="twitter:title"]', title);
    updateMeta('meta[name="twitter:description"]', description);
  }, [title, description]);
}
