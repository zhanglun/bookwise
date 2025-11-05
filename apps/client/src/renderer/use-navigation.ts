import { useEffect, useRef, useState } from 'react';
import { Book, Resolution } from './types';

export const useNavigationManager = (book: Book | null) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const bookRef = useRef(book);

  useEffect(() => {
    bookRef.current = book;
  }, [book]);

  const resolveTarget = async (target: string | number): Promise<Resolution | null> => {
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
  };
  const goTo = async (target: string | number) => {
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
  };

  const next = async () => {
    if (!bookRef.current) {
      return;
    }
    const maxIndex = bookRef.current.sections.length - 1;
    if (currentIndex < maxIndex) {
      await goTo(currentIndex + 1);
    }
  };

  const prev = async () => {
    if (currentIndex > 0) {
      await goTo(currentIndex - 1);
    }
  };

  return {
    currentIndex,
    isNavigating,
    resolveTarget,
    goTo,
    next,
    prev,
  };
};
