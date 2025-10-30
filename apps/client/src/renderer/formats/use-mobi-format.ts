import { useCallback } from 'react';

export const useMOBIFormat = () => {
  const applyStyles = useCallback((doc: Document) => {
    // MOBI 特定样式
    const style = doc.createElement('style');
    style.textContent = `blockquote {
      margin-inline-start: 1em;
    }`;
    doc.head.append(style);
  }, []);

  return { applyStyles };
};
