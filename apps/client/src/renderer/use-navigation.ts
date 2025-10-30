import { useCallback, useEffect, useRef, useState } from 'react';
import { Book, Resolution } from './types';

export const useNavigationManager = (book: Book | null) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const bookRef = useRef(book);

  useEffect(() => {
    bookRef.current = book;
  }, [book]);

  const resolveTarget = useCallback(async (target: string | number): Promise<Resolution | null> => {
    if (!bookRef.current) {
      return null;
    }

    if (typeof target === 'number') {
      return { index: target };
    }

    if (bookRef.current.resolveHref) {
      return await bookRef.current.resolveHref(target);
    }

    return null;
  }, []);

  const goTo = useCallback(
    async (target: string | number) => {
      if (isNavigating || !bookRef.current) {
        return;
      }

      setIsNavigating(true);
      try {
        const resolved = await resolveTarget(target);
        if (!resolved) {
          return;
        }

        setCurrentIndex(resolved.index);
        return resolved;
      } finally {
        setIsNavigating(false);
      }
    },
    [isNavigating, resolveTarget]
  );

  const next = useCallback(async () => {
    if (!bookRef.current) {
      return;
    }
    const maxIndex = bookRef.current.sections.length - 1;
    if (currentIndex < maxIndex) {
      await goTo(currentIndex + 1);
    }
  }, [currentIndex, goTo]);

  const prev = useCallback(async () => {
    if (currentIndex > 0) {
      await goTo(currentIndex - 1);
    }
  }, [currentIndex, goTo]);

  return {
    currentIndex,
    isNavigating,
    goTo,
    next,
    prev,
  };
};
