import React, { useCallback, useEffect } from 'react';
import { useEPUBFormat } from './formats/use-epub-format';
import { usePDFFormat } from './formats/use-pdf-format';
import { useContentLoader } from './use-content-loader';
import { useFrameManager } from './use-frame';
import { useNavigationManager } from './use-navigation';

interface RendererProps {
  book: any;
  onRelocate?: (location: { index: number }) => void;
}

export const Renderer: React.FC<RendererProps> = ({ book, onRelocate }) => {
  // 组合所有功能模块
  const frameManager = useFrameManager();
  const navigation = useNavigationManager(book);
  const contentLoader = useContentLoader(book);
  const epubFormat = useEPUBFormat();
  const pdfFormat = usePDFFormat();

  const isPrePaginated = book?.rendition?.layout === 'pre-paginated';

  // 渲染当前章节
  const renderSection = useCallback(
    async (index: number) => {
      const urlOrObject = await contentLoader.loadSection(index);

      if (!urlOrObject) {
        return;
      }

      // 提取 src 和 onZoom
      const src = typeof urlOrObject === 'string' ? urlOrObject : urlOrObject.src;
      const onZoom = typeof urlOrObject === 'object' ? urlOrObject.onZoom : undefined;

      if (!src) {
        return;
      }

      const doc = await frameManager.loadContent(src, onZoom);

      console.log('🚀 ~ Renderer ~ doc:', doc);

      if (!doc) {
        return;
      }

      // 根据格式应用不同的样式
      if (isPrePaginated) {
        const img = doc.querySelector('img');
        if (img && frameManager.iframeRef.current) {
          const containerWidth = frameManager.iframeRef.current.clientWidth;
          const height = pdfFormat.applyStyles(doc, img, containerWidth);
          frameManager.iframeRef.current.style.height = `${height}px`;
        }
      } else {
        epubFormat.applyStyles(doc);
        epubFormat.handleLinks(doc, navigation.goTo);
        frameManager.adjustHeight(doc);
      }

      onRelocate?.({ index });
    },
    [
      contentLoader,
      frameManager,
      epubFormat,
      pdfFormat,
      navigation.goTo,
      isPrePaginated,
      onRelocate,
    ]
  );

  // 监听当前索引变化
  useEffect(() => {
    renderSection(navigation.currentIndex);
  }, [navigation.currentIndex, renderSection]);

  // 清理
  useEffect(() => {
    return () => {
      contentLoader.cleanup();
      book?.destroy?.();
    };
  }, [book, contentLoader]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <iframe
        ref={frameManager.iframeRef}
        sandbox="allow-same-origin allow-scripts"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          display: 'block',
        }}
      />
      <canvas
        ref={frameManager.canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      />

      {/* 导航控制 */}
      <div style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
        <button onClick={navigation.prev} disabled={navigation.currentIndex === 0}>
          Previous
        </button>
        <button
          onClick={navigation.next}
          disabled={navigation.currentIndex === (book?.sections.length ?? 0) - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};
