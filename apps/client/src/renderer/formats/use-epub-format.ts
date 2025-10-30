import { useCallback } from 'react';

export const useEPUBFormat = () => {
  const applyStyles = useCallback((doc: Document) => {
    const body = doc.body;
    body.style.maxWidth = '720px';
    body.style.margin = '0 auto';
    body.style.padding = '48px 24px';
  }, []);

  const handleLinks = useCallback((doc: Document, onNavigate: (href: string) => void) => {
    doc.addEventListener('click', (e) => {
      const a = (e.target as Element).closest('a[href]');
      if (!a) {
        return;
      }

      e.preventDefault();
      const href = a.getAttribute('href');
      if (href) {
        onNavigate(href);
      }
    });
  }, []);

  return {
    applyStyles,
    handleLinks,
  };
};
