import { useCallback, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface PDFRendererProps {
  book: any;
  onRelocate?: (location: any) => void;
}

export const PDFRenderer: React.FC<PDFRendererProps> = ({ book, onRelocate }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef(book);
  const pageCacheRef = useRef<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    bookRef.current = book;
  }, [book]);

  // 创建虚拟化列表 - 每个 section 是一个 PDF 页面
  const virtualizer = useVirtualizer({
    count: book?.sections?.length ?? 0,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 800, // PDF 页面的估计高度
    overscan: 2, // 预渲染前后2页
  });

  // 加载单个 PDF 页面
  const loadPage = useCallback(async (pageIndex: number) => {
    if (!bookRef.current?.sections?.[pageIndex]) {
      return null;
    }

    // 检查缓存
    if (pageCacheRef.current.has(pageIndex)) {
      return pageCacheRef.current.get(pageIndex);
    }

    const section = bookRef.current.sections[pageIndex];
    const pageData = await section.load();

    console.log('Loaded URL:', pageData);

    // 缓存页面 URL
    pageCacheRef.current.set(pageIndex, pageData);
    return pageData;
  }, []);

  // 跳转到指定页面
  const goToPage = useCallback(
    async (pageIndex: number) => {
      if (!bookRef.current || pageIndex < 0 || pageIndex >= bookRef.current.sections.length) {
        return;
      }

      setIsLoading(true);

      try {
        // 确保页面已加载
        await loadPage(pageIndex);

        // 使用 virtualizer 滚动到页面
        virtualizer.scrollToIndex(pageIndex, {
          align: 'start',
          behavior: 'smooth',
        });

        // 触发位置变化回调
        if (onRelocate && scrollContainerRef.current) {
          const scrollTop = scrollContainerRef.current.scrollTop;
          const scrollHeight = scrollContainerRef.current.scrollHeight;

          onRelocate({
            index: pageIndex,
            fraction: scrollTop / scrollHeight,
          });
        }
      } finally {
        setIsLoading(false);
      }
    },
    [virtualizer, loadPage, onRelocate]
  );

  // 监听滚动事件
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !onRelocate) {
      return;
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleScroll = () => {
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

  // 清理缓存
  useEffect(() => {
    return () => {
      pageCacheRef.current.forEach((url) => {
        if (url && typeof url === 'string' && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      pageCacheRef.current.clear();

      if (bookRef.current?.destroy) {
        bookRef.current.destroy();
      }
    };
  }, []);

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
        Loading PDF...
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
          background: '#525252', // PDF 查看器常用的深灰背景
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
                padding: '8px 0', // 页面间距
              }}
            >
              <PDFPageRenderer pageIndex={virtualItem.index} loadPage={loadPage} />
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
          Loading page...
        </div>
      )}
    </div>
  );
};

// 单个 PDF 页面渲染组件
interface PDFPageRendererProps {
  pageIndex: number;
  loadPage: (index: number) => Promise<string | null>;
}

const PDFPageRenderer: React.FC<PDFPageRendererProps> = ({ pageIndex, loadPage }) => {
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    loadPage(pageIndex).then(setPageUrl);
  }, [pageIndex, loadPage]);

  const handleIframeLoad = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    const doc = iframe.contentDocument;
    if (!doc) {
      return;
    }

    // PDF 页面需要保持宽高比
    // 获取 viewport 尺寸(在 renderPage 生成的 HTML 中设置)
    const viewport = doc.querySelector('meta[name="viewport"]');
    if (viewport) {
      const content = viewport.getAttribute('content');
      const widthMatch = content?.match(/width=(\d+)/);
      const heightMatch = content?.match(/height=(\d+)/);

      if (widthMatch && heightMatch) {
        const pageWidth = parseInt(widthMatch[1]);
        const pageHeight = parseInt(heightMatch[1]);

        // 计算容器宽度
        const container = iframe.parentElement;
        if (container) {
          const containerWidth = container.clientWidth - 16; // 减去 padding
          const scale = containerWidth / pageWidth;
          const scaledHeight = pageHeight * scale;

          iframe.style.height = `${scaledHeight}px`;
          iframe.style.width = `${containerWidth}px`;
        }
      }
    }

    // 禁用 iframe 内部滚动
    doc.documentElement.style.overflow = 'hidden';
    doc.body.style.overflow = 'hidden';
  }, []);

  if (!pageUrl) {
    return (
      <div
        style={{
          width: '100%',
          height: '800px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white',
          margin: '0 auto',
          maxWidth: '900px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        Loading page {pageIndex + 1}...
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <iframe
        ref={iframeRef}
        src={pageUrl}
        onLoad={handleIframeLoad}
        style={{
          border: 'none',
          display: 'block',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
        sandbox="allow-same-origin allow-scripts"
        scrolling="no"
      />
    </div>
  );
};

export default PDFRenderer;
