import { useCallback, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface RendererProps {
  book: any;
  onRelocate?: (location: any) => void;
}

export const useRenderer = ({ book, onRelocate }: RendererProps) => {
  const [isPrePaginated, setIsPrePaginated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef(book);
  const sectionCacheRef = useRef<Map<number, string>>(new Map());
  const isNavigatingRef = useRef(false); // 导航锁

  // 更新 book ref
  useEffect(() => {
    bookRef.current = book;
  }, [book]);

  // 检测格式
  useEffect(() => {
    if (!book) {
      return;
    }
    const isPrepaginated = book.rendition?.layout === 'pre-paginated';
    setIsPrePaginated(isPrepaginated);
  }, [book]);

  // 创建虚拟化列表
  const virtualizer = useVirtualizer({
    count: book?.sections?.length ?? 0,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 800,
    overscan: 2,
  });

  // 设置预分页格式高度
  const setPrePaginatedHeight = useCallback((iframe: HTMLIFrameElement, img: HTMLImageElement) => {
    if (!scrollContainerRef.current) {
      return;
    }
    const containerWidth = scrollContainerRef.current.clientWidth;
    const aspectRatio = img.naturalHeight / img.naturalWidth;
    iframe.style.height = `${containerWidth * aspectRatio}px`;
  }, []);

  // 处理 iframe 内链接点击
  const handleIframeLinks = useCallback(
    (doc: Document, index: number, goToFn: (href: string) => void) => {
      doc.addEventListener('click', (e) => {
        const a = (e.target as Element).closest('a[href]');
        if (!a) {
          return;
        }

        e.preventDefault();
        const href = a.getAttribute('href');
        if (!href) {
          return;
        }

        const section = bookRef.current?.sections[index];
        const resolvedHref = section?.resolveHref?.(href) ?? href;

        if (bookRef.current?.isExternal?.(resolvedHref)) {
          window.open(resolvedHref, '_blank');
        } else {
          goToFn(resolvedHref);
        }
      });
    },
    []
  );

  // 加载章节内容
  const loadSection = useCallback(async (index: number) => {
    if (!bookRef.current?.sections?.[index]) {
      return null;
    }

    if (sectionCacheRef.current.has(index)) {
      return sectionCacheRef.current.get(index);
    }

    const section = bookRef.current.sections[index];
    const url = await section.load();
    sectionCacheRef.current.set(index, url);
    return url;
  }, []);

  // 处理 iframe 加载完成
  const handleIframeLoad = useCallback(
    (iframe: HTMLIFrameElement, index: number, goToFn: (href: string) => void) => {
      const doc = iframe.contentDocument;
      if (!doc) {
        return;
      }

      // 处理页面内链接
      handleIframeLinks(doc, index, goToFn);

      if (isPrePaginated) {
        const img = doc.querySelector('img');
        if (img) {
          if (img.complete) {
            setPrePaginatedHeight(iframe, img);
            virtualizer.measureElement(iframe.parentElement!);
          } else {
            img.addEventListener('load', () => {
              setPrePaginatedHeight(iframe, img);
              virtualizer.measureElement(iframe.parentElement!);
            });
          }
        } else {
          iframe.style.height = '100vh';
          virtualizer.measureElement(iframe.parentElement!);
        }
      } else {
        const { documentElement, body } = doc;
        documentElement.style.overflow = 'visible';
        documentElement.style.height = 'auto';
        body.style.overflow = 'visible';
        body.style.height = 'auto';
        body.style.maxWidth = '720px';
        body.style.margin = '0 auto';
        body.style.padding = '48px 24px';

        doc.fonts.ready.then(() => {
          const height = documentElement.scrollHeight;
          iframe.style.height = `${height}px`;
          virtualizer.measureElement(iframe.parentElement!);

          const resizeObserver = new ResizeObserver(() => {
            const newHeight = documentElement.scrollHeight;
            iframe.style.height = `${newHeight}px`;
            virtualizer.measureElement(iframe.parentElement!);
          });
          resizeObserver.observe(body);
        });
      }
    },
    [isPrePaginated, virtualizer, setPrePaginatedHeight, handleIframeLinks]
  );

  // 跳转到指定位置
  const goTo = useCallback(
    async (href: string | number) => {
      if (!bookRef.current || isNavigatingRef.current) {
        return;
      }

      isNavigatingRef.current = true;
      setIsLoading(true);

      try {
        let resolved;
        if (typeof href === 'number') {
          resolved = { index: href };
        } else if (bookRef.current.resolveHref) {
          resolved = await bookRef.current.resolveHref(href);
        } else {
          return;
        }

        if (!resolved) {
          return;
        }

        const targetIndex = resolved.index;

        // 使用 virtualizer 的 scrollToIndex 方法
        virtualizer.scrollToIndex(targetIndex, {
          align: 'start',
          behavior: 'smooth',
        });

        // 等待滚动完成后处理锚点
        if (resolved.anchor && !isPrePaginated) {
          await new Promise((resolve) => setTimeout(resolve, 500));

          const items = virtualizer.getVirtualItems();
          const targetItem = items.find((item) => item.index === targetIndex);
          if (targetItem) {
            const element = document.querySelector(`[data-index="${targetIndex}"]`);
            const iframe = element?.querySelector('iframe') as HTMLIFrameElement;
            if (iframe?.contentDocument) {
              const anchorElement = resolved.anchor(iframe.contentDocument);
              if (anchorElement) {
                const rect = anchorElement.getBoundingClientRect();
                const offset = targetItem.start + rect.top;
                scrollContainerRef.current?.scrollTo({
                  top: offset,
                  behavior: 'auto',
                });
              }
            }
          }
        }

        // 触发位置变化回调
        if (onRelocate && scrollContainerRef.current) {
          const scrollTop = scrollContainerRef.current.scrollTop;
          const scrollHeight = scrollContainerRef.current.scrollHeight;
          onRelocate({
            index: targetIndex,
            fraction: scrollTop / scrollHeight,
          });
        }
      } finally {
        // 短暂延迟后解锁,确保滚动完成
        await new Promise((resolve) => setTimeout(resolve, 100));
        isNavigatingRef.current = false;
        setIsLoading(false);
      }
    },
    [virtualizer, isPrePaginated, onRelocate]
  );

  // 监听滚动事件 - 关键:检查导航锁
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !onRelocate) {
      return;
    }

    let timeoutId: NodeJS.Timeout;
    const handleScroll = () => {
      // 关键:如果正在导航,忽略滚动事件
      if (isNavigatingRef.current) {
        return;
      }

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const items = virtualizer.getVirtualItems();
        if (items.length === 0) {
          return;
        }

        const firstVisibleItem = items[0];
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;

        onRelocate({
          index: firstVisibleItem.index,
          fraction: scrollTop / scrollHeight,
        });
      }, 300);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [virtualizer, onRelocate]);

  // 清理
  useEffect(() => {
    return () => {
      sectionCacheRef.current.forEach((url) => {
        URL.revokeObjectURL(url);
      });
      sectionCacheRef.current.clear();
      if (bookRef.current?.destroy) {
        bookRef.current.destroy();
      }
    };
  }, []);

  return {
    scrollContainerRef,
    virtualizer,
    loadSection,
    handleIframeLoad,
    goTo,
    isLoading,
  };
};

// 单个章节渲染组件
const SectionRenderer: React.FC<{
  index: number;
  loadSection: (index: number) => Promise<string | null>;
  onLoad: (iframe: HTMLIFrameElement, index: number, goTo: (href: string) => void) => void;
  goTo: (href: string | number) => void;
}> = ({ index, loadSection, onLoad, goTo }) => {
  const [url, setUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadSection(index).then(setUrl);
  }, [index, loadSection]);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !url) {
      return;
    }

    const handleLoad = () => onLoad(iframe, index, goTo);
    iframe.addEventListener('load', handleLoad);
    return () => iframe.removeEventListener('load', handleLoad);
  }, [url, index, onLoad, goTo]);

  if (!url) {
    return (
      <div
        style={{
          height: '800px',
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'loading 1.5s infinite',
        }}
      >
        <style>{`
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <iframe
      ref={iframeRef}
      title={url}
      src={url}
      style={{
        width: '100%',
        border: 'none',
        display: 'block',
        overflow: 'hidden',
      }}
      sandbox="allow-same-origin allow-scripts"
      scrolling="no"
    />
  );
};

// React 组件
export const Renderer: React.FC<RendererProps> = ({ book, onRelocate }) => {
  const { scrollContainerRef, virtualizer, loadSection, handleIframeLoad, goTo, isLoading } =
    useRenderer({
      book,
      onRelocate,
    });

  if (!book) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading book...
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={scrollContainerRef}
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <SectionRenderer
                index={virtualItem.index}
                loadSection={loadSection}
                onLoad={handleIframeLoad}
                goTo={goTo}
              />
            </div>
          ))}
        </div>
      </div>
      {isLoading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '4px',
            zIndex: 1000,
          }}
        >
          Loading...
        </div>
      )}
    </div>
  );
};
