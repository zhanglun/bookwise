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
      if (blob?.data && detail) {
        setIsLoading(true);
        try {
          // 根据格式确定文件扩展名
          const format = detail.format?.toLowerCase() || 'epub';
          const fileExtension = format === 'pdf' ? '.pdf' : 
                               format === 'mobi' ? '.mobi' : 
                               format === 'txt' ? '.txt' : '.epub';
          
          // 确保文件名有正确的扩展名
          let filename = detail.title || 'book';
          if (!filename.toLowerCase().endsWith(fileExtension)) {
            filename = `${filename}${fileExtension}`;
          }
          
          console.log('Loading book:', {
            uuid: detail.uuid,
            title: detail.title,
            format: detail.format,
            filename,
            blobSize: blob.data?.byteLength || blob.data?.length,
          });
          
          const f = new File([blob.data], filename, { 
            type: format === 'pdf' ? 'application/pdf' : 
                  format === 'epub' ? 'application/epub+zip' : 
                  'application/octet-stream'
          });
          
          console.log('File created:', {
            name: f.name,
            size: f.size,
            type: f.type,
          });
          
          const bookInstance = await makeBook(f);

          console.log('Book loaded successfully:', {
            format: bookInstance.format,
            sections: bookInstance.sections?.length,
            toc: bookInstance.toc?.length,
            metadata: bookInstance.metadata,
          });

          setBookFormat(bookInstance.format || format);
          setTocItems(bookInstance.toc || []);
          setBook(bookInstance);
          setTotalSections(bookInstance.sections?.length || 1);

          // 根据格式初始化渲染
          if (bookInstance.format === 'pdf' || format === 'pdf') {
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
          
          // 显示错误提示（可以添加 Toast 提示）
          alert(`加载书籍失败: ${error?.message || '未知错误'}`);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log('Waiting for book data...', { 
          hasBlob: !!blob?.data, 
          hasDetail: !!detail,
          blobData: blob?.data,
        });
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
