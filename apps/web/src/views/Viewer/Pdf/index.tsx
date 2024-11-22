import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ScrollArea, Spinner } from "@radix-ui/themes";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import * as pdfjsLib from "pdfjs-dist";
import { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist";
import { TocItem } from "../Toc";
import { useBearStore } from "@/store";
import { dal } from "@/dal";

// 设置 PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

interface PdfViewerProps {
  bookUuid: string;
  onTocUpdate?: (items: TocItem[]) => void;
}

export const PdfViewer = memo(({ bookUuid, onTocUpdate }: PdfViewerProps) => {
  const [loading, setLoading] = useState(false);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.5);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // 将 PDF 大纲转换为 TocItem 格式
  const convertOutlineToTocItems = (outline: any[]): TocItem[] => {
    return outline.map((item) => ({
      label: item.title,
      href: `#page=${item.dest?.[0]}`,
      subitems: item.items ? convertOutlineToTocItems(item.items) : undefined,
    }));
  };

  // 渲染当前页面
  const renderPage = useCallback(
    async (pageNumber: number) => {
      if (!pdf || !canvasRef.current) return;

      try {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error("Error rendering page:", error);
      }
    },
    [pdf, scale]
  );

  // 处理文件加载成功
  const onReadLocalFileSuccess = useCallback(
    async (_e: unknown, { type, buffer }: { ext: string; type: string; buffer: Buffer }) => {
      setLoading(true);
      try {
        const loadingTask = pdfjsLib.getDocument({ data: buffer });
        const pdf = await loadingTask.promise;
        
        setPdf(pdf);
        setTotalPages(pdf.numPages);
        
        // 获取并转换目录
        const outline = await pdf.getOutline();
        if (outline) {
          const tocItems = convertOutlineToTocItems(outline);
          onTocUpdate?.(tocItems);
        }

        // 渲染第一页
        setCurrentPage(1);
        await renderPage(1);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading PDF:", error);
        setLoading(false);
      }
    },
    [onTocUpdate, renderPage]
  );

  // 监听文件加载事件
  useEffect(() => {
    window.electronAPI.onReadLocalFileSuccess(onReadLocalFileSuccess);
    return () => {
      window.electronAPI.removeListener?.("read-local-file-success", onReadLocalFileSuccess);
    };
  }, [onReadLocalFileSuccess]);

  // 获取书籍详情
  useEffect(() => {
    if (bookUuid) {
      dal.getBookByUuid(bookUuid).then((detail) => {
        const { path } = detail;
        window.electronAPI.readLocalFile({ path });
      });
    }
  }, [bookUuid]);

  // 监听页面变化
  useEffect(() => {
    if (currentPage > 0 && currentPage <= totalPages) {
      renderPage(currentPage);
    }
  }, [currentPage, totalPages, renderPage]);

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // 处理缩放
  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.2);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(0.5, prevScale - 0.2));
  };

  return (
    <ScrollArea
      id="canvasRoot"
      size="1"
      type="hover"
      scrollbars="vertical"
      ref={scrollAreaRef}
      className="h-[calc(100vh-68px)] px-6 relative"
    >
      {loading && (
        <div className="absolute z-40 top-6 right-6 bottom-6 left-6 bg-cell flex items-center justify-center rounded-lg">
          <Spinner size="3" />
        </div>
      )}
      <div className="relative">
        <div className="relative m-auto max-w-[980px] px-[60px] pb-20 mb-20">
          <section className="py-16 w-full h-full flex flex-col items-center" id="pdf-section">
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleZoomOut}
                className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                缩小
              </button>
              <button
                onClick={handleZoomIn}
                className="px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                放大
              </button>
              <span className="px-2 py-1">
                {currentPage} / {totalPages}
              </span>
            </div>
            <canvas ref={canvasRef} className="shadow-lg" />
          </section>
        </div>
      </div>
      <span
        className="absolute left-2 top-1/2 -translate-y-1/2 z-50 px-2 py-16 rounded-md cursor-pointer transition-all text-[var(--gray-10)] hover:text-[var(--gray-12)] hover:bg-[var(--gray-3)]"
        onClick={prevPage}
      >
        <ChevronLeftIcon width={22} height={22} />
      </span>
      <span
        className="absolute right-2 top-1/2 -translate-y-1/2 z-50 px-2 py-16 rounded-md cursor-pointer transition-all text-[var(--gray-10)] hover:text-[var(--gray-12)] hover:bg-[var(--gray-3)]"
        onClick={nextPage}
      >
        <ChevronRightIcon width={22} height={22} />
      </span>
    </ScrollArea>
  );
});

PdfViewer.displayName = "PdfViewer";
