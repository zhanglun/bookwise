import { useEffect, useState, useCallback, useRef } from 'react';
import { makeBook } from 'foliate-js/view.js';
import { useAtom, useSetAtom } from 'jotai';
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
  Annotation,
} from './atoms/reader-atoms';
import classes from './viewer.module.css';

export const Viewer = () => {
  const { uuid } = useParams();
  const setCurrentUuid = useSetAtom(currentDetailUuidAtom);
  const { detail, blob } = useDetail();
  const [, setTocItems] = useAtom(tocItemsAtom);
  const [book, setBook] = useState<any>(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [leftOpen] = useAtom(leftPanelOpenAtom);
  const [rightOpen] = useAtom(rightPanelOpenAtom);
  const [theme] = useAtom(currentThemeAtom);
  const [fontSize] = useAtom(fontSizeAtom);
  const [lineHeight] = useAtom(lineHeightAtom);
  const setSelectedText = useSetAtom(selectedTextAtom);
  const setFloatingPosition = useSetAtom(floatingToolbarPositionAtom);
  const [annotations] = useAtom(annotationsAtom);

  const contentRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);

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
        const f = new File([blob.data], detail.title);
        const bookInstance = await makeBook(f);

        setTocItems(bookInstance.toc || []);
        setBook(bookInstance);
        setTotalSections(bookInstance.sections?.length || 0);

        // 创建 Shadow DOM
        if (contentRef.current && !shadowRootRef.current) {
          shadowRootRef.current = contentRef.current.attachShadow({ mode: 'open' });
        }

        // 加载第一个 section
        await loadSection(0, bookInstance);
      }
    })();
  }, [blob, detail, setTocItems]);

  // 加载 section
  const loadSection = async (index: number, bookInstance: any = book) => {
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
      padding: 48px 32px;
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
            await loadSection(resolved.index, bookInstance);
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
            y: rect.top,
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
    if (!shadowRootRef.current || annotations.length === 0) return;

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
  }, [annotations, currentSection, classes.contentContainer]);

  // 导航处理
  const handlePrev = useCallback(() => {
    if (currentSection > 0) {
      loadSection(currentSection - 1);
    }
  }, [currentSection]);

  const handleNext = useCallback(() => {
    if (currentSection < totalSections - 1) {
      loadSection(currentSection + 1);
    }
  }, [currentSection, totalSections]);

  const handleSectionChange = useCallback((section: number) => {
    loadSection(section);
  }, []);

  const handleProgressChange = useCallback((p: number) => {
    const section = Math.floor(p * totalSections);
    loadSection(Math.min(section, totalSections - 1));
  }, [totalSections]);

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
      />

      <div className={classes.mainLayout}>
        <div
          className={`${classes.leftPanel} ${leftOpen ? classes.open : classes.closed}`}
        >
          <TocPanel isOpen={leftOpen} />
        </div>

        <div className={classes.contentArea}>
          <ScrollArea className={classes.scrollArea} scrollbarSize={8}>
            <div className={classes.contentWrapper}>
              <div ref={contentRef} className={classes.shadowHost} />
            </div>
          </ScrollArea>

          {isLoading && (
            <div className={classes.loadingOverlay}>
              <div className={classes.loadingSpinner} />
            </div>
          )}

          <FloatingToolbar currentSection={currentSection} />
        </div>

        <div
          className={`${classes.rightPanel} ${rightOpen ? classes.open : classes.closed}`}
        >
          <AnnotationPanel isOpen={rightOpen} currentSection={currentSection} />
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
      />
    </div>
  );
};

export default Viewer;
