import { useCallback, useEffect, useRef } from 'react';
import { Book, SectionContent } from './types';

export const useContentLoader = (book: Book | null) => {
  const cacheRef = useRef<Map<number, SectionContent>>(new Map());
  const bookRef = useRef(book);

  useEffect(() => {
    bookRef.current = book;
  }, [book]);

  const loadSection = useCallback(async (index: number): Promise<SectionContent | null> => {
    if (!bookRef.current?.sections?.[index]) {
      return null;
    }

    // 检查缓存
    if (cacheRef.current.has(index)) {
      return cacheRef.current.get(index)!;
    }

    const section = bookRef.current.sections[index];
    const result = await section.load();

    // 缓存结果(可能是字符串或对象)
    cacheRef.current.set(index, result);

    return result;
  }, []);

  const unloadSection = useCallback((index: number) => {
    const content = cacheRef.current.get(index);
    if (content) {
      // 处理字符串 URL
      if (typeof content === 'string') {
        URL.revokeObjectURL(content);
      }
      // 处理 PDF 对象格式
      else if (content && typeof content === 'object' && content.src) {
        URL.revokeObjectURL(content.src);
      }
      cacheRef.current.delete(index);
    }

    bookRef.current?.sections[index]?.unload?.();
  }, []);

  const cleanup = useCallback(() => {
    cacheRef.current.forEach((content) => {
      if (typeof content === 'string') {
        URL.revokeObjectURL(content);
      } else if (content && typeof content === 'object' && content.src) {
        URL.revokeObjectURL(content.src);
      }
    });
    cacheRef.current.clear();
  }, []);

  return {
    loadSection,
    unloadSection,
    cleanup,
  };
};
