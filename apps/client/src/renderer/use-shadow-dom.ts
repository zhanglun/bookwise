import { useCallback, useEffect, useRef } from 'react';
import { getAbsoluteUrl } from '@/helpers/book';
import { substitute } from '@/helpers/epub';

export const useShadowDOMManager = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const contentElementRef = useRef<HTMLDivElement | null>(null);
  const blobUrlsRef = useRef<string[]>([]); // 用于跟踪创建的 blob URLs

  // 初始化 Shadow DOM
  useEffect(() => {
    if (!containerRef.current || shadowRootRef.current) {
      return;
    }

    // 创建 Shadow DOM (使用 open 模式以便调试)
    const shadowRoot = containerRef.current.attachShadow({ mode: 'open' });
    shadowRootRef.current = shadowRoot;

    // 创建内容容器
    const contentElement = document.createElement('div');
    contentElement.style.cssText = `
      width: 100%;
      height: 100%;
      overflow: auto;
      box-sizing: border-box;
    `;

    shadowRoot.appendChild(contentElement);
    contentElementRef.current = contentElement;
  }, []);

  // 提取并注入样式
  const injectStyles = useCallback(async (doc: Document, shadowRoot: ShadowRoot) => {
    // 1. 提取内联样式
    const styleElements = doc.querySelectorAll('style');
    styleElements.forEach((styleEl) => {
      const newStyle = document.createElement('style');
      newStyle.textContent = styleEl.textContent;
      shadowRoot.appendChild(newStyle);
    });

    // 2. 提取外部样式表
    const linkElements = doc.querySelectorAll('link[rel="stylesheet"]');
    for (const linkEl of Array.from(linkElements)) {
      const href = linkEl.getAttribute('href');
      if (!href) {
        continue;
      }

      try {
        // 获取 CSS 内容
        const response = await fetch(href);
        const cssText = await response.text();

        const style = document.createElement('style');
        style.textContent = cssText;
        shadowRoot.appendChild(style);
      } catch (error) {
        console.warn(`Failed to load stylesheet: ${href}`, error);
      }
    }

    // 3. 添加基础样式重置
    const resetStyle = document.createElement('style');
    resetStyle.textContent = `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
      * {
        box-sizing: border-box;
      }
    `;
    shadowRoot.insertBefore(resetStyle, shadowRoot.firstChild);
  }, []);

  // 加载 section 内容到 Shadow DOM
  const loadContent = useCallback(
    async (book: any, section: any) => {
      if (!shadowRootRef.current || !contentElementRef.current) {
        console.error('Shadow DOM not initialized');
        return null;
      }

      try {
        // 获取 section 的 Document 对象
        const doc = await section.createDocument();

        // 清空之前的内容
        contentElementRef.current.innerHTML = '';

        // 移除旧的样式
        const oldStyles = shadowRootRef.current.querySelectorAll('style, link[rel="stylesheet"]');
        oldStyles.forEach((el) => el.remove());

        // 提取并注入样式
        await injectStyles(doc, shadowRootRef.current);

        // 替换图片路径
        for (const image of doc.querySelectorAll('img[src], image')) {
          let attr = 'src';
          let href: string = image.getAttribute('src') || '';

          if (!href) {
            href = image.getAttributeNS('http://www.w3.org/1999/xlink', 'href') || '';
            attr = 'href';
          }

          if (!href) {
            href = image.getAttribute('xlink:href') || '';
            attr = 'xlink:href';
          }

          console.log('🚀 ~ useShadowDOMManager ~ href:', href);
          console.log('🚀 ~ useShadowDOMManager ~ book:', book);

          href = await section.resolveHref(href);

          if (href && !href.startsWith('blob:') && !href.startsWith('http')) {
            const blob = await book.loadBlob(href);
            console.log('🚀 ~ useShadowDOMManager ~ blob:', blob);
            const resolvedSrc = URL.createObjectURL(blob);

            if (resolvedSrc) {
              // 记录创建的 blob URL 以便后续清理
              blobUrlsRef.current.push(resolvedSrc);
              image.setAttribute(attr, resolvedSrc);
            }
          }
        }

        // 提取并注入 HTML 内容
        const bodyContent = doc.body.cloneNode(true) as HTMLElement;
        console.log('🚀 ~ useShadowDOMManager ~ bodyContent:', bodyContent);
        contentElementRef.current.appendChild(bodyContent);
        console.log(
          '🚀 ~ useShadowDOMManager ~ contentElementRef.current:',
          contentElementRef.current
        );

        return contentElementRef.current;
      } catch (error) {
        console.error('Failed to load content:', error);
        return null;
      }
    },
    [injectStyles]
  );

  // 获取 Shadow DOM 内的文档
  const getDocument = () => {
    return contentElementRef.current;
  };

  // 清理
  const cleanup = useCallback(() => {
    if (contentElementRef.current) {
      console.log('🚀 ~ useShadowDOMManager ~ contentElementRef.current:', 'clearup');
      contentElementRef.current.innerHTML = '';
    }

    // 清理所有创建的 blob URLs
    blobUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (error) {
        console.warn('Failed to revoke object URL:', error);
      }
    });
    blobUrlsRef.current = [];

    // 清理 shadow root
    if (shadowRootRef.current) {
      while (shadowRootRef.current.firstChild) {
        shadowRootRef.current.removeChild(shadowRootRef.current.firstChild);
      }
    }
  }, []);

  // 组件卸载时自动清理
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return {
    containerRef,
    shadowRoot: shadowRootRef.current,
    loadContent,
    getDocument,
    cleanup,
  };
};
