import { useEffect, useState, useCallback, useRef } from 'react';
import { makeBook } from 'foliate-js/view.js';
import { useAtom, useSetAtom, useAtomValue } from 'jotai';
import { useParams } from 'react-router-dom';
import { ScrollArea } from '@mantine/core';
import { currentDetailUuidAtom, tocItemsAtom } from './atoms/detail-atoms';
import { useDetail } from './hooks/use-detail';
import { Toolbar } from './components/toolbar';
import { TocPanel } from './components/toc-panel';
import { AnnotationPanel } from './components/annotation-panel';
import { FloatingToolbar } from './components/floating-toolbar';
import { ProgressBar } from './components/progress-bar';
import {
  leftPanelOpenAtom,
  rightPanelOpenAtom,
  currentThemeAtom,
  fontSizeAtom,
  lineHeightAtom,
  selectedTextAtom,
  floatingToolbarPositionAtom,
  annotationsAtom,
} from './atoms/reader-atoms';
import classes from './viewer.module.css';

export const Viewer = () => {
  const { uuid } = useParams();
  const setCurrentUuid = useSetAtom(currentDetailUuidAtom);
  const { detail, blob } = useDetail();
  const [, setTocItems] = useAtom(tocItemsAtom);
  
  // 书籍状态
  const [book, setBook] = useState<any>(null);
  const [bookFormat, setBookFormat] = useState<string>('');
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 阅读器状态
  const [leftOpen] = useAtom(leftPanelOpenAtom);
  const [rightOpen] = useAtom(rightPanelOpenAtom);
  const [theme] = useAtom(currentThemeAtom);
  const [fontSize] = useAtom(fontSizeAtom);
  const [lineHeight] = useAtom(lineHeightAtom);
  const setSelectedText = useSetAtom(selectedTextAtom);
  const setFloatingPosition = useSetAtom(floatingToolbarPositionAtom);
  const annotations = useAtomValue(annotationsAtom);

  // DOM 引用
  const contentRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const pdfViewRef = useRef<any>(null);

  // 设置当前 UUID
  useEffect(() => {
    if (uuid) {
      setCurrentUuid(uuid);
    }
    return () => {
      setCurrentUuid(null);
    };
  }, [uuid, setCurrentUuid]);

  // 加载书籍
  useEffect(() => {
    (async () => {
      console.log('=== blob 调试 ===');
      console.log('blob:', blob);
      console.log('blob?.data exists:', blob?.data !== null && blob?.data !== undefined);
      console.log('detail:', detail?.data?.title, detail?.data?.format);
      console.log('====================');
      
      if (blob?.data && detail) {
        setIsLoading(true);
        try {
          // 调试：检查文件魔数
          const uint8Array = blob.data instanceof Uint8Array ? blob.data : new Uint8Array(blob.data);
          console.log('=== 文件魔数调试 ===');
          console.log('Blob 数据类型:', blob.data.constructor.name);
          console.log('Blob 数据长度:', uint8Array.length);
          console.log('前10个字节 (Hex):', Array.from(uint8Array.slice(0, 10)).map(b => b.toString(16).padStart(2, '0')).join(' '));
          if (uint8Array.length > 0) {
            console.log('第一个字节:', uint8Array[0], '应该是 0x50 (PK) 或 0x25 (%)');
          }
          console.log('前10个字节 (ASCII):', String.fromCharCode(...uint8Array.slice(0, 10)).replace(/[\x00-\x1F\x7F]/g, '.'));
          
          // 识别格式
          const isZip = uint8Array[0] === 0x50 && uint8Array[1] === 0x4b && uint8Array[2] === 0x03 && uint8Array[3] === 0x04;
          const isPdf = uint8Array[0] === 0x25 && uint8Array[1] === 0x50 && uint8Array[2] === 0x44 && uint8Array[3] === 0x46 && uint8Array[4] === 0x2d;
          console.log('是 ZIP (EPUB):', isZip);
          console.log('是 PDF:', isPdf);
          console.log('====================');
          
          // 从数据库获取格式信息
          const format = (detail.format || 'EPUB').toUpperCase();
          
          // 确定文件扩展名
          let fileExtension = '.epub';
          let mimeType = 'application/epub+zip';
          
          if (format === 'PDF') {
            fileExtension = '.pdf';
            mimeType = 'application/pdf';
          } else if (format === 'MOBI') {
            fileExtension = '.mobi';
            mimeType = 'application/x-mobipocket-ebook';
          } else if (format === 'TEXT' || format === 'TXT') {
            fileExtension = '.txt';
            mimeType = 'text/plain';
          }
          
          // 构建文件名 - 必须使用正确的扩展名
          let filename = detail.title || 'book';
          // 移除可能存在的错误扩展名
          filename = filename.replace(/\.[^/.]+$/, '');
          // 添加正确的扩展名
          filename = `${filename}${fileExtension}`;
          
          console.log('Loading book with format:', format);
          console.log('File details:', { filename, mimeType, format });
          console.log('Blob data size:', blob.data?.byteLength || blob.data?.length || 'unknown');
          
          // 创建 File 对象 - 必须使用正确的扩展名和 MIME 类型
          const f = new File([blob.data], filename, { type: mimeType });
          
          console.log('Created file:', f.name, 'size:', f.size, 'type:', f.type);
          
          // 使用 foliate-js 解析书籍
          const bookInstance = await makeBook(f);

          console.log('Book parsed successfully:', {
            detectedFormat: bookInstance.format,
            sections: bookInstance.sections?.length,
            toc: bookInstance.toc?.length,
          });

          // 使用检测到的格式或回退到数据库格式
          const actualFormat = bookInstance.format || format;
          setBookFormat(actualFormat);
          setTocItems(bookInstance.toc || []);
          setBook(bookInstance);
          setTotalSections(bookInstance.sections?.length || 1);

          // 根据检测到的格式初始化渲染
          if (actualFormat === 'pdf') {
            await initPdfViewer(bookInstance);
          } else {
            await initEpubViewer(bookInstance);
          }
        } catch (error: any) {
          console.error('Failed to load book:', error);
          console.error('Error details:', {
            message: error?.message,
            name: error?.name,
            stack: error?.stack,
          });
        } finally {
          setIsLoading(false);
        }
      }
    })();

    // 清理
    return () => {
      if (pdfViewRef.current) {
        pdfViewRef.current.remove?.();
        pdfViewRef.current = null;
      }
    };
  }, [blob, detail, setTocItems]);

  // 初始化 EPUB 阅读器
  const initEpubViewer = async (bookInstance: any) => {
    if (!contentRef.current) return;

    // 创建 Shadow DOM
    if (!shadowRootRef.current) {
      shadowRootRef.current = contentRef.current.attachShadow({ mode: 'open' });
    }

    // 加载第一个 section
    await loadEpubSection(0, bookInstance);
  };

  // 初始化 PDF 阅读器
  const initPdfViewer = async (bookInstance: any) => {
    if (!pdfContainerRef.current) return;

    // 清理旧内容
    while (pdfContainerRef.current.firstChild) {
      pdfContainerRef.current.removeChild(pdfContainerRef.current.firstChild);
    }

    // 创建 foliate-view 元素
    const view = document.createElement('foliate-view');
    pdfViewRef.current = view;

    // 设置样式
    view.style.width = '100%';
    view.style.height = '100%';
    view.style.overflow = 'auto';

    pdfContainerRef.current.appendChild(view);

    // 监听事件
    view.addEventListener('load', (e: any) => {
      console.log('PDF page loaded:', e.detail);
    });

    view.addEventListener('relocate', (e: any) => {
      console.log('PDF relocated:', e.detail);
      const { index, fraction } = e.detail || {};
      if (index !== undefined) {
        setCurrentSection(index);
        setProgress(fraction || index / (bookInstance.sections?.length || 1));
      }
    });

    try {
      await view.open(bookInstance);
      // 显示第一页
      if (view.renderer) {
        view.renderer.next?.();
      }
    } catch (err) {
      console.error('Failed to open PDF:', err);
    }
  };

  // 加载 EPUB section
  const loadEpubSection = async (index: number, bookInstance: any = book) => {
    if (!bookInstance?.sections?.[index] || !shadowRootRef.current) return;

    setIsLoading(true);
    try {
      const section = bookInstance.sections[index];
      const html = await section.load?.();

      if (html && shadowRootRef.current) {
        // 清空旧内容
        while (shadowRootRef.current.firstChild) {
          shadowRootRef.current.removeChild(shadowRootRef.current.firstChild);
        }

        // 创建容器
        const container = document.createElement('div');
        container.className = classes.contentContainer;
        container.innerHTML = html;

        // 注入样式
        const style = document.createElement('style');
        style.textContent = getReaderStyles();
        container.appendChild(style);

        shadowRootRef.current.appendChild(container);

        // 处理内部链接
        handleInternalLinks(container, index, bookInstance);

        // 设置文本选择监听
        setupTextSelection(container, index);

        setCurrentSection(index);
        setProgress(index / (bookInstance.sections.length || 1));
      }
    } catch (error) {
      console.error('Failed to load section:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取阅读器样式
  const getReaderStyles = () => `
    .${classes.contentContainer} {
      font-family: 'Source Han Serif CN', 'Noto Serif SC', Georgia, serif;
      font-size: ${fontSize}px;
      line-height: ${lineHeight};
      color: ${theme === 'dark' ? '#e5e7eb' : '#374151'};
      max-width: 720px;
      margin: 0 auto;
      padding: 48px 32px 80px;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Source Han Sans CN', 'Noto Sans SC', -apple-system, sans-serif;
      font-weight: 600;
      color: ${theme === 'dark' ? '#f3f4f6' : '#1f2937'};
      margin-top: 1.5em;
      margin-bottom: 0.75em;
      line-height: 1.3;
    }

    h1 { font-size: 1.8em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.3em; }
    h4 { font-size: 1.1em; }

    p {
      margin: 1em 0;
      text-align: justify;
      text-indent: 2em;
      letter-spacing: 0.3px;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 1.5em auto;
      border-radius: 4px;
    }

    a {
      color: ${theme === 'dark' ? '#60a5fa' : '#3b82f6'};
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s;
    }

    a:hover {
      border-bottom-color: currentColor;
    }

    blockquote {
      margin: 1.5em 0;
      padding: 0.75em 1.25em;
      border-left: 3px solid ${theme === 'dark' ? '#4b5563' : '#d1d5db'};
      background: ${theme === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'};
      font-style: italic;
      color: ${theme === 'dark' ? '#9ca3af' : '#6b7280'};
    }

    /* 批注高亮样式 */
    .annotation-highlight {
      background: #fef3c7;
      border-radius: 2px;
      padding: 1px 2px;
    }

    .annotation-underline {
      border-bottom: 2px solid #93c5fd;
      text-decoration: none;
    }

    ::selection {
      background: ${theme === 'dark' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.2)'};
    }

    /* PDF 在 Shadow DOM 内的样式 */
    @media print {
      .${classes.contentContainer} {
        max-width: none;
        padding: 0;
      }
    }
  `;

  // 处理内部链接
  const handleInternalLinks = (container: HTMLElement, index: number, bookInstance: any) => {
    const links = container.querySelectorAll('a[href]');
    links.forEach((link) => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (!href) return;

        try {
          const resolved = bookInstance.resolveHref?.(href);
          if (resolved && resolved.index !== undefined) {
            await loadEpubSection(resolved.index, bookInstance);
            if (resolved.anchor) {
              setTimeout(() => {
                const anchor = container.querySelector(`[id="${resolved.anchor}"]`);
                anchor?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }
        } catch (error) {
          console.error('Navigation failed:', error);
        }
      });
    });
  };

  // 设置文本选择监听
  const setupTextSelection = (container: HTMLElement, sectionIndex: number) => {
    container.addEventListener('mouseup', (e) => {
      const selection = window.getSelection();
      const text = selection?.toString().trim();

      if (text && text.length > 0) {
        setSelectedText(text);

        const range = selection?.getRangeAt(0);
        const rect = range?.getBoundingClientRect();

        if (rect) {
          setFloatingPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 10,
            visible: true,
          });
        }
      }
    });

    container.addEventListener('mousedown', () => {
      setFloatingPosition((prev) => ({ ...prev, visible: false }));
    });
  };

  // 应用当前批注
  useEffect(() => {
    if (bookFormat === 'pdf' || !shadowRootRef.current || annotations.length === 0) return;

    const container = shadowRootRef.current.querySelector(`.${classes.contentContainer}`);
    if (!container) return;

    // 清除旧的批注标记
    container.querySelectorAll('.annotation-highlight, .annotation-underline').forEach((el) => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent || ''), el);
        parent.normalize();
      }
    });

    // 应用当前 section 的批注
    const sectionAnnotations = annotations.filter((a) => a.sectionIndex === currentSection);

    sectionAnnotations.forEach((annotation) => {
      const walker = document.createTreeWalker(
        container,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );

      let textNode;
      while ((textNode = walker.nextNode())) {
        const text = textNode.textContent || '';
        const index = text.indexOf(annotation.text);

        if (index !== -1) {
          const range = document.createRange();
          range.setStart(textNode, index);
          range.setEnd(textNode, index + annotation.text.length);

          const span = document.createElement('span');
          span.className =
            annotation.type === 'highlight' ? 'annotation-highlight' : 'annotation-underline';
          span.style.background = annotation.type === 'highlight' ? annotation.color : 'transparent';
          span.style.borderBottomColor = annotation.color;

          try {
            range.surroundContents(span);
          } catch (e) {
            // 跨元素选择时可能会失败，忽略
          }
          break;
        }
      }
    });
  }, [annotations, currentSection, bookFormat, classes.contentContainer]);

  // 导航处理 - EPUB
  const handlePrev = useCallback(() => {
    if (bookFormat === 'pdf') {
      // PDF 导航
      if (pdfViewRef.current?.renderer?.prev) {
        pdfViewRef.current.renderer.prev();
      }
    } else {
      // EPUB 导航
      if (currentSection > 0) {
        loadEpubSection(currentSection - 1);
      }
    }
  }, [bookFormat, currentSection]);

  const handleNext = useCallback(() => {
    if (bookFormat === 'pdf') {
      // PDF 导航
      if (pdfViewRef.current?.renderer?.next) {
        pdfViewRef.current.renderer.next();
      }
    } else {
      // EPUB 导航
      if (currentSection < totalSections - 1) {
        loadEpubSection(currentSection + 1);
      }
    }
  }, [bookFormat, currentSection, totalSections]);

  const handleSectionChange = useCallback((section: number) => {
    if (bookFormat === 'pdf') {
      // PDF 跳转到指定页
      if (pdfViewRef.current?.goTo) {
        pdfViewRef.current.goTo({ index: section });
      }
    } else {
      // EPUB 跳转到指定章节
      loadEpubSection(section);
    }
  }, [bookFormat]);

  const handleProgressChange = useCallback((p: number) => {
    const section = Math.floor(p * totalSections);
    handleSectionChange(Math.min(section, totalSections - 1));
  }, [totalSections, handleSectionChange]);

  // 加载状态
  if (!detail.data && !blob.data) {
    return (
      <div className={classes.loadingContainer}>
        <div className={classes.loadingSpinner} />
        <p>正在加载书籍...</p>
      </div>
    );
  }

  const bookData = detail.data;

  return (
    <div className={classes.reader} data-theme={theme}>
      <Toolbar
        book={bookData}
        currentSection={currentSection}
        totalSections={totalSections}
        bookFormat={bookFormat}
      />

      <div className={classes.mainLayout}>
        <div
          className={`${classes.leftPanel} ${leftOpen ? classes.open : classes.closed}`}
        >
          <TocPanel isOpen={leftOpen} bookFormat={bookFormat} />
        </div>

        <div className={classes.contentArea}>
          {/* EPUB 阅读区域 */}
          {bookFormat !== 'pdf' && (
            <ScrollArea className={classes.scrollArea} scrollbarSize={8}>
              <div className={classes.contentWrapper}>
                <div ref={contentRef} className={classes.shadowHost} />
              </div>
            </ScrollArea>
          )}

          {/* PDF 阅读区域 */}
          {bookFormat === 'pdf' && (
            <div 
              ref={pdfContainerRef} 
              className={classes.pdfContainer}
              style={{ width: '100%', height: '100%', overflow: 'auto' }}
            />
          )}

          {isLoading && (
            <div className={classes.loadingOverlay}>
              <div className={classes.loadingSpinner} />
            </div>
          )}

          {bookFormat !== 'pdf' && <FloatingToolbar currentSection={currentSection} />}
        </div>

        <div
          className={`${classes.rightPanel} ${rightOpen ? classes.open : classes.closed}`}
        >
          <AnnotationPanel isOpen={rightOpen} currentSection={currentSection} bookFormat={bookFormat} />
        </div>
      </div>

      <ProgressBar
        currentSection={currentSection}
        totalSections={totalSections}
        progress={progress}
        onSectionChange={handleSectionChange}
        onProgressChange={handleProgressChange}
        onPrev={handlePrev}
        onNext={handleNext}
        bookFormat={bookFormat}
      />
    </div>
  );
};

export default Viewer;
