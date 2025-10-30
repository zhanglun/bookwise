import { useCallback, useRef } from 'react';

export const useFrameManager = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onZoomRef = useRef<(args: any) => void | null>(null);

  const createFrame = useCallback(() => {
    const iframe = document.createElement('iframe');
    iframe.style.cssText = `
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  `;

    // 添加 allow-scripts 以支持 PDF.js
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    iframe.setAttribute('scrolling', 'no');

    return iframe;
  }, []);

  const loadContent = useCallback(
    async (url: string, onZoom?: (args: any) => void): Promise<Document | null> => {
      if (!iframeRef.current) {
        return null;
      }

      return new Promise((resolve) => {
        const iframe = iframeRef.current!;

        const handleLoad = () => {
          // 添加延迟以确保文档完全加载
          requestAnimationFrame(() => {
            const doc = iframe.contentDocument;

            console.log('🚀 ~ handleLoad ~ iframe:', iframe);
            console.log('🚀 ~ handleLoad ~ doc:', doc);
            console.log('🚀 ~ handleLoad ~ iframe.src:', iframe.src);

            // 检查 doc 是否为 null
            if (!doc) {
              console.error('Failed to access iframe.contentDocument');
              console.error('iframe.src:', iframe.src);
              console.error('sandbox:', iframe.getAttribute('sandbox'));
              resolve(null);
              return;
            }

            // 如果有 onZoom 回调(PDF),调用它来渲染内容
            if (onZoom) {
              try {
                onZoom({ doc, scale: 1 });
              } catch (error) {
                console.error('Error calling onZoom:', error);
              }
            }

            resolve(doc);
          });
        };

        iframe.addEventListener('load', handleLoad, { once: true });
        iframe.src = url;
      });
    },
    []
  );

  const adjustHeight = useCallback((doc: Document, isPrePaginated: boolean = false) => {
    if (!iframeRef.current) {
      return;
    }

    // 禁用文档内部滚动
    doc.documentElement.style.overflow = 'hidden';
    doc.body.style.overflow = 'hidden';

    if (isPrePaginated) {
      // PDF 等预分页格式:保持宽高比
      const viewport = doc.querySelector('meta[name="viewport"]');
      if (viewport) {
        const content = viewport.getAttribute('content');
        const widthMatch = content?.match(/width=(\d+)/);
        const heightMatch = content?.match(/height=(\d+)/);

        if (widthMatch && heightMatch) {
          const width = parseInt(widthMatch[1], 10);
          const height = parseInt(heightMatch[1], 10);
          const aspectRatio = height / width;

          // 根据容器宽度计算高度
          const containerWidth = iframeRef.current.parentElement?.clientWidth || width;
          iframeRef.current.style.height = `${containerWidth * aspectRatio}px`;
          return;
        }
      }

      // 如果没有 viewport,使用默认高度
      iframeRef.current.style.height = '100%';
    } else {
      // EPUB/MOBI 等可重排格式:自适应内容高度
      doc.fonts.ready.then(() => {
        const height = doc.documentElement.scrollHeight;
        iframeRef.current!.style.height = `${height}px`;
      });
    }
  }, []);

  // 新增:支持 PDF 缩放
  const zoom = useCallback((scale: number) => {
    if (!iframeRef.current || !onZoomRef.current) {
      return;
    }

    const doc = iframeRef.current.contentDocument;
    if (doc) {
      onZoomRef.current({ doc, scale });
    }
  }, []);

  return {
    iframeRef,
    canvasRef,
    createFrame,
    loadContent,
    adjustHeight,
    zoom,
  };
};
