import { useCallback, useEffect, useRef } from 'react';

type SectionContent = {
  doc: Document;
  html: string;
  styles: string[];
};

export const useContentLoader = (book: any) => {
  const cacheRef = useRef<Map<number, SectionContent>>(new Map());
  const bookRef = useRef(book);

  useEffect(() => {
    bookRef.current = book;
  }, [book]);

  const loadSection = useCallback(async (index: number) => {
    if (!bookRef.current?.sections?.[index]) {
      return null;
    }

    // 检查缓存
    if (cacheRef.current.has(index)) {
      return cacheRef.current.get(index)!;
    }

    const section = bookRef.current.sections[index];

    // 使用 createDocument() 获取 Document 对象
    const doc = await section.createDocument();

    // 提取 HTML
    const html = doc.body.innerHTML;

    // 提取样式
    const styles: string[] = [];

    // 内联样式
    doc.querySelectorAll('style').forEach((styleEl: HTMLStyleElement) => {
      if (styleEl.textContent) {
        styles.push(styleEl.textContent);
      }
    });

    // 外部样式表 (需要异步加载)
    const linkElements: HTMLLinkElement[] = doc.querySelectorAll('link[rel="stylesheet"]');
    for (const linkEl of Array.from(linkElements)) {
      const href = linkEl.getAttribute('href');
      if (href) {
        try {
          const response = await fetch(href);
          const cssText = await response.text();
          styles.push(cssText);
        } catch (error) {
          console.warn(`Failed to load stylesheet: ${href}`);
        }
      }
    }

    const content = { doc, html, styles };
    cacheRef.current.set(index, content);
    return content;
  }, []);

  const cleanup = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return {
    loadSection,
    cleanup,
  };
};
