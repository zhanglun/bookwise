import { useCallback } from 'react';

export const usePDFFormat = () => {
  const applyStyles = useCallback(
    (doc: Document, img: HTMLImageElement, containerWidth: number) => {
      const aspectRatio = img.naturalHeight / img.naturalWidth;
      const height = containerWidth * aspectRatio;
      return height;
    },
    []
  );

  return {
    applyStyles,
  };
};
