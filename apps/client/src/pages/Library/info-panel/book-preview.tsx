import { useEffect, useState, useRef } from 'react';
import { makeBook } from 'foliate-js/view.js';
import { IconChevronLeft, IconChevronRight, IconBook } from '@tabler/icons-react';
import { ActionIcon, Button, LoadingOverlay, Text, Tooltip } from '@mantine/core';
import { dal } from '@/dal';
import { BookResItem } from '@/interface/book';
import classes from './book-preview.module.css';

interface BookPreviewProps {
  book: BookResItem;
  maxPages?: number;
}

export const BookPreview = ({ book, maxPages = 3 }: BookPreviewProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasPreview, setHasPreview] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);

  // 加载书籍预览
  useEffect(() => {
    const loadPreview = async () => {
      if (!book.uuid) return;

      setIsLoading(true);
      setError(null);

      try {
        const blob = await dal.getBookBlob(book.uuid);
        if (!blob?.data) {
          setError('无法加载书籍内容');
          setHasPreview(false);
          return;
        }

        const file = new File([blob.data], book.title);
        
        // 根据格式处理
        if (book.format === 'pdf') {
          // PDF 格式 - 使用 PDF.js 或其他方式预览
          await loadPdfPreview(file);
        } else if (book.format === 'epub' || book.format === 'mobi') {
          // EPUB/MOBI 格式 - 使用 foliate-js
          await loadEpubPreview(file);
        } else {
          // 其他格式尝试用 foliate-js
          await loadEpubPreview(file);
        }
      } catch (err) {
        console.error('Preview loading error:', err);
        setError('加载预览失败');
        setHasPreview(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreview();
  }, [book.uuid, book.format, book.title]);

  // 加载 EPUB 预览
  const loadEpubPreview = async (file: File) => {
    try {
      const bookInstance = await makeBook(file as unknown as string);
      
      if (!bookInstance.sections || bookInstance.sections.length === 0) {
        setError('书籍没有可预览的内容');
        setHasPreview(false);
        return;
      }

      setTotalPages(Math.min(bookInstance.sections.length, maxPages));
      setHasPreview(true);

      // 创建 Shadow DOM
      if (contentRef.current && !shadowRootRef.current) {
        shadowRootRef.current = contentRef.current.attachShadow({ mode: 'open' });
      }

      // 加载第一页
      await loadSection(0, bookInstance);
    } catch (err) {
      console.error('EPUB preview error:', err);
      setError('EPUB 预览加载失败');
      setHasPreview(false);
    }
  };

  // 加载 PDF 预览
  const loadPdfPreview = async (file: File) => {
    try {
      // 对于 PDF，我们可以创建一个简单的预览提示
      // 实际项目中可以使用 PDF.js 来渲染第一页
      setContent(`
        <div class="pdf-preview-placeholder">
          <div class="pdf-icon">📄</div>
          <p>PDF 格式预览</p>
          <p class="pdf-hint">点击"开始阅读"查看完整内容</p>
        </div>
      `);
      setTotalPages(1);
      setHasPreview(true);

      // 创建 Shadow DOM 并显示内容
      if (contentRef.current && !shadowRootRef.current) {
        shadowRootRef.current = contentRef.current.attachShadow({ mode: 'open' });
      }

      renderContent();
    } catch (err) {
      console.error('PDF preview error:', err);
      setError('PDF 预览加载失败');
      setHasPreview(false);
    }
  };

  // 加载指定 section
  const loadSection = async (index: number, bookInstance: any) => {
    if (!bookInstance?.sections?.[index] || !shadowRootRef.current) return;

    try {
      const section = bookInstance.sections[index];
      const html = await section.load?.();

      if (html) {
        // 清理 HTML，只保留正文内容
        const cleanedHtml = cleanHtmlContent(html);
        setContent(cleanedHtml);
        setCurrentPage(index);
        renderContent();
      }
    } catch (err) {
      console.error('Section loading error:', err);
    }
  };

  // 渲染内容到 Shadow DOM
  const renderContent = () => {
    if (!shadowRootRef.current) return;

    // 清空旧内容
    while (shadowRootRef.current.firstChild) {
      shadowRootRef.current.removeChild(shadowRootRef.current.firstChild);
    }

    // 创建容器
    const container = document.createElement('div');
    container.className = classes.previewContent;
    container.innerHTML = content;

    // 注入样式
    const style = document.createElement('style');
    style.textContent = getPreviewStyles();
    container.appendChild(style);

    shadowRootRef.current.appendChild(container);
  };

  // 清理 HTML 内容
  const cleanHtmlContent = (html: string): string => {
    // 移除脚本和样式标签
    let cleaned = html.replace(/<script[^>]*>.*?<\/script>/gi, '');
    cleaned = cleaned.replace(/<style[^>]*>.*?<\/style>/gi, '');
    
    // 限制内容长度，只保留前 2000 个字符
    if (cleaned.length > 2000) {
      cleaned = cleaned.substring(0, 2000) + '...';
    }

    return cleaned;
  };

  // 获取预览样式
  const getPreviewStyles = () => `
    .${classes.previewContent} {
      font-family: 'Source Han Serif CN', 'Noto Serif SC', Georgia, serif;
      font-size: 14px;
      line-height: 1.6;
      color: #374151;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: 'Source Han Sans CN', 'Noto Sans SC', -apple-system, sans-serif;
      font-weight: 600;
      color: #1f2937;
      margin-top: 1em;
      margin-bottom: 0.5em;
      line-height: 1.3;
    }

    h1 { font-size: 1.5em; }
    h2 { font-size: 1.3em; }
    h3 { font-size: 1.1em; }

    p {
      margin: 0.8em 0;
      text-align: justify;
      text-indent: 2em;
    }

    img {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 1em auto;
      border-radius: 4px;
    }

    .pdf-preview-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      text-align: center;
      color: #6b7280;
    }

    .pdf-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .pdf-hint {
      font-size: 12px;
      color: #9ca3af;
      margin-top: 8px;
    }

    blockquote {
      margin: 1em 0;
      padding: 0.5em 1em;
      border-left: 3px solid #d1d5db;
      background: rgba(0,0,0,0.02);
      font-style: italic;
      color: #6b7280;
    }
  `;

  // 上一页
  const handlePrev = () => {
    if (currentPage > 0) {
      // 这里需要重新获取 book instance，简化处理
      setCurrentPage(currentPage - 1);
    }
  };

  // 下一页
  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) {
    return (
      <div className={classes.previewContainer}>
        <LoadingOverlay visible={true} overlayProps={{ radius: 'sm', blur: 2 }} />
        <div className={classes.previewPlaceholder}>
          <IconBook size={32} className={classes.placeholderIcon} />
          <Text size="sm" c="dimmed">正在加载预览...</Text>
        </div>
      </div>
    );
  }

  if (error || !hasPreview) {
    return (
      <div className={classes.previewContainer}>
        <div className={classes.previewPlaceholder}>
          <IconBook size={32} className={classes.placeholderIcon} />
          <Text size="sm" c="dimmed">{error || '暂无预览'}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.previewContainer}>
      <div className={classes.previewHeader}>
        <Text size="xs" fw={500} c="dimmed">内容预览</Text>
        {totalPages > 1 && (
          <div className={classes.pageIndicator}>
            <Text size="xs" c="dimmed">
              {currentPage + 1} / {totalPages}
            </Text>
          </div>
        )}
      </div>

      <div className={classes.previewContentWrapper}>
        <div ref={contentRef} className={classes.previewViewport} />
      </div>

      {totalPages > 1 && (
        <div className={classes.previewControls}>
          <Tooltip label="上一页">
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={handlePrev}
              disabled={currentPage === 0}
            >
              <IconChevronLeft size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="下一页">
            <ActionIcon
              variant="subtle"
              size="sm"
              onClick={handleNext}
              disabled={currentPage >= totalPages - 1}
            >
              <IconChevronRight size={16} />
            </ActionIcon>
          </Tooltip>
        </div>
      )}
    </div>
  );
};
