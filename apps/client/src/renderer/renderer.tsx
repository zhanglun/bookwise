import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigationManager } from './use-navigation';
import { useShadowDOMManager } from './use-shadow-dom';

interface RendererProps {
  book: any;
  onRelocate?: (location: { index: number }) => void;
}

export const Renderer = React.forwardRef<any, RendererProps>(({ book, onRelocate }, ref) => {
  const shadowDOM = useShadowDOMManager();
  const navigation = useNavigationManager(book);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const bookRef = useRef(book);

  // 更新 book ref
  useEffect(() => {
    bookRef.current = book;
  }, [book]);

  // 加载当前 section
  const loadCurrentSection = async (index: number) => {
    if (!bookRef.current?.sections?.[index]) {
      console.warn(`Section ${index} not found`);
      return;
    }

    setIsLoading(true);

    try {
      // 使用 Shadow DOM 加载内容
      const section = bookRef.current.sections[index];
      const element = await shadowDOM.loadContent(book, section);

      console.log('🚀 ~ loadCurrentSection ~ element:', element);

      if (element) {
        // 处理页面内链接
        handleInternalLinks(element, index);

        setCurrentIndex(index);

        if (onRelocate) {
          onRelocate({ index });
        }
      }
    } catch (error) {
      console.error(`Failed to load section ${index}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理页面内链接
  const handleInternalLinks = (element: HTMLElement, currentIndex: number) => {
    const links = element.querySelectorAll('a[href]');
    const section = bookRef.current.sections[currentIndex];

    console.log('🚀 ~ handleInternalLinks ~ section:', section);

    console.log('🚀 ~ links:', links);
    links.forEach((link) => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');

        if (!href) {
          return;
        }

        try {
          // 解析 href
          const resolved = bookRef.current?.resolveHref?.(section.resolveHref(href));
          if (resolved) {
            await goTo(href);

            // 处理锚点
            if (resolved.anchor) {
              // 等待 DOM 更新
              requestAnimationFrame(() => {
                const shadowRoot = shadowDOM.containerRef.current?.shadowRoot;
                if (shadowRoot) {
                  const doc = shadowRoot.querySelector('*')?.ownerDocument || document;
                  const targetElement = resolved.anchor(doc);
                  targetElement?.scrollIntoView({ behavior: 'smooth' });
                }
              });
            }
          }
        } catch (error) {
          console.error('Failed to navigate:', error);
        }
      });
    });
  };

  // 导航方法
  const goTo = async (target: string | number) => {
    let resolved;

    if (typeof target === 'number') {
      resolved = { index: target };
    } else if (bookRef.current?.resolveHref) {
      resolved = await bookRef.current.resolveHref(target);
    }

    if (!resolved) {
      console.warn('Could not resolve target:', target);
      return;
    }

    console.log('🚀 ~ goTo ~ resolved.index:', resolved.index);

    await loadCurrentSection(resolved.index);

    // 处理锚点
    if (resolved.anchor) {
      requestAnimationFrame(() => {
        const shadowRoot = shadowDOM.containerRef.current?.shadowRoot;
        if (shadowRoot) {
          const doc = shadowRoot.querySelector('*')?.ownerDocument || document;
          const targetElement = resolved.anchor(doc);
          targetElement?.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  };

  // 前进/后退方法
  const next = async () => {
    if (currentIndex < (bookRef.current?.sections?.length ?? 0) - 1) {
      await goTo(currentIndex + 1);
    }
  };

  const prev = async () => {
    if (currentIndex > 0) {
      await goTo(currentIndex - 1);
    }
  };

  // 暴露导航方法给父组件
  React.useImperativeHandle(ref, () => ({
    goTo,
    next,
    prev,
    currentIndex,
  }));

  // 初始化
  useEffect(() => {
    if (book) {
      loadCurrentSection(0);
    }
  }, [book]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Shadow DOM 容器 */}
      <div
        ref={shadowDOM.containerRef}
        style={{ width: '100%', height: '100%', overflow: 'auto' }}
      />

      {/* 加载指示器 */}
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

      {/* 导航控制 */}
      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          right: '20px',
          display: 'flex',
          gap: '8px',
          zIndex: 100,
        }}
      >
        <button
          onClick={prev}
          disabled={currentIndex === 0 || isLoading}
          style={{
            padding: '8px 16px',
            cursor: currentIndex === 0 || isLoading ? 'not-allowed' : 'pointer',
            opacity: currentIndex === 0 || isLoading ? 0.5 : 1,
          }}
        >
          Previous
        </button>
        <button
          onClick={next}
          disabled={currentIndex >= (book?.sections?.length ?? 0) - 1 || isLoading}
          style={{
            padding: '8px 16px',
            cursor:
              currentIndex >= (book?.sections?.length ?? 0) - 1 || isLoading
                ? 'not-allowed'
                : 'pointer',
            opacity: currentIndex >= (book?.sections?.length ?? 0) - 1 || isLoading ? 0.5 : 1,
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
});

Renderer.displayName = 'Renderer';
