import { memo, useEffect, useRef } from 'react';

import 'foliate-js/view.js';

export const PdfViewer = memo(({ book }) => {
  const viewRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!book || !containerRef.current) {
      console.log('Waiting for book or container...');
      return;
    }

    const view = document.createElement('foliate-view');
    viewRef.current = view;
    containerRef.current.appendChild(view);

    // 监听 load 事件确认内容已加载
    view.addEventListener('load', (e) => {
      console.log('Content loaded:', e.detail);
    });

    // 监听 relocate 事件确认渲染完成
    view.addEventListener('relocate', (e) => {
      console.log('Relocated:', e.detail);
    });

    view
      .open(book)
      .then(() => {
        console.log('Book opened successfully');
        // 可以在这里调用 view.renderer.next() 显示第一页
        view.renderer?.next?.();
      })
      .catch((err) => {
        console.error('Failed to open book:', err);
      });

    return () => {
      view.remove();
    };
  }, [book]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
});

PdfViewer.displayName = 'PdfViewer';
