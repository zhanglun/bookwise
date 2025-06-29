/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import ePub, { Book, NavItem } from 'epubjs';
import Section from 'epubjs/types/section';
import { fileTypeFromBuffer } from 'file-type';
import { Button, Loader, ScrollArea } from '@mantine/core';
import { dal } from '@/dal';
import { getAbsoluteUrl } from '@/helpers/book';
import { substitute } from '@/helpers/epub';
import { BookResItem } from '@/interface/book';
import { TocItem } from '../toc';
import { ContentRender } from './content-render';

export interface EpubViewerProps {
  bookUuid: string;
  onTocUpdate?: (items: TocItem[]) => void;
}

export const EpubViewer = memo(({ bookUuid, onTocUpdate }: EpubViewerProps) => {
  const [book, setBook] = useState<Book>();
  const [_bookDetail, setBookDetail] = useState<BookResItem>({} as BookResItem);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<Section>();
  const [content, setContent] = useState<string>('');

  // 将 epub 的 NavItem 转换为通用的 TocItem
  const convertNavItemsToTocItems = (navItems: NavItem[]): TocItem[] => {
    return navItems.map((item) => ({
      label: item.label,
      href: item.href,
      subitems: item.subitems ? convertNavItemsToTocItems(item.subitems) : undefined,
    }));
  };

  useEffect(() => {
    if (book?.navigation) {
      const tocItems = convertNavItemsToTocItems(book.navigation.toc);
      onTocUpdate?.(tocItems);
    }
  }, [book?.navigation, onTocUpdate]);

  const getBookDetail = useCallback(() => {
    return dal.getBookByUuid(bookUuid).then((data) => {
      setBookDetail(data);
      return data;
    });
  }, [bookUuid]);

  const getBookBlob = useCallback(() => {
    return dal.getBookBlob(bookUuid).then((data) => {
      console.log('🚀 ~ returndal.getBookBlob ~ data:', data);
      return data;
    });
  }, [bookUuid]);

  useEffect(() => {
    if (bookUuid) {
      Promise.all([getBookDetail(), getBookBlob()]).then(async ([_bookDetail, record]) => {
        const buffer = record.data;
        const type = (await fileTypeFromBuffer(buffer)) as { mime: string };
        const blob = new Blob([buffer], { type: type.mime as string });
        const book = ePub(blob as unknown as ArrayBuffer);
        console.log('🚀 ~ Promise.all ~ book:', book);

        if (book) {
          try {
            await book.opened;
            console.log('book.open');
            // 等待导航数据加载
            await book.loaded.navigation;
            // 设置 book 状态
            setBook(book);
            const spine_index = '0';

            // 在导航数据加载完成后更新目录
            if (book.navigation) {
              const tocItems = convertNavItemsToTocItems(book.navigation.toc);
              onTocUpdate?.(tocItems);
            }

            display(parseInt(spine_index || '0', 10), book);
            setCurrentSection(book.spine.get(spine_index));
          } catch (error) {
            console.error('Error loading book:', error);
          }
        }
      });
    }
  }, [bookUuid]);

  function display(index: number, book?: Book, anchorId?: string) {
    setLoading(true);

    const section = book?.spine.get(index);

    if (section && book) {
      setCurrentSection(section);
      setContent('');

      const p = section.load(book.load.bind(book));

      // @ts-expect-error library typed error
      p.then((content: HTMLElement) => {
        if (content && content.innerHTML) {
          console.log('🚀 ~ p.then ~ content:', content);
          // const styles = content.querySelectorAll('[type="text/css"]');

          // styles.forEach((s: Element) => s.remove());

          // @ts-expect-error library typed error
          const { urls, replacementUrls } = book.resources;
          const str = substitute(content.innerHTML, urls, replacementUrls);

          setContent(str);
          setCurrentSectionIndex(index);

          setTimeout(() => {
            if (anchorId) {
              const target = document.getElementById(anchorId);

              target?.scrollIntoView();
            } else {
              scrollAreaRef.current && scrollAreaRef.current.scrollTo(0, 0);
            }

            setLoading(false);

            const progress = scrollAreaRef?.current?.scrollTop || 0;

            updateReadProgress(index, progress);
          });
        }
      });
    }

    return section;
  }

  function updateReadProgress(_spine_index: number, _read_progress: number) {
    // const body = {
    //   spine_index: spine_index.toString(),
    //   read_progress,
    //   read_progress_updated_at: new Date(),
    // };
    // request
    //   .post(`/books/${bookUuid}/additional_infos`, {
    //     ...body,
    //   })
    //   .then((res) => {
    //     console.log('%c Line:126 🍎 res', 'color:#fca650', res);
    //   });
  }

  const nextPage = () => {
    display(currentSectionIndex + 1, book);
  };

  const prevPage = () => {
    display(currentSectionIndex - 1, book);
  };

  useEffect(() => {
    const keyListener = function (e: KeyboardEvent) {
      if ((e.keyCode || e.which) === 37) {
        prevPage();
      }

      if ((e.keyCode || e.which) === 39) {
        nextPage();
      }
    };

    document.addEventListener('keyup', keyListener, false);

    return function () {
      document.addEventListener('keyup', keyListener, false);
    };
  }, []);

  useEffect(() => {
    const root = document.getElementById('canvasRoot') as HTMLElement;
    const el = document.getElementById('canvas') as HTMLDivElement;

    if (root && el) {
      // markerRef.current = new Marker(root, el);
    }
  }, []); // 只在组件挂载时初始化一次

  function handleUserClickEvent(e: React.MouseEvent<HTMLElement>) {
    let elem = null;
    const i = e.nativeEvent.composedPath();

    for (let a = 0; a <= i.length - 1; a++) {
      const s = i[a] as HTMLElement;

      if (s.tagName === 'A') {
        elem = s;
        break;
      }
    }

    if (elem && elem.getAttribute('href')) {
      e.preventDefault();
      e.stopPropagation();

      const href = elem.getAttribute('href') || '';

      if (
        href &&
        (href.indexOf('http://') >= 0 || href.indexOf('https://') >= 0 || href.indexOf('www.') >= 0)
      ) {
        window.open(href);
      } else if (currentSection) {
        const realHref = getAbsoluteUrl(currentSection?.href, href);
        const [hrefId, anchorId] = realHref.split('#');
        const section = book?.spine.get(hrefId);

        if (section) {
          setCurrentSection(section);
          setCurrentSectionIndex(section.index as number);
          display(section.index, book, anchorId);
        }
      }
    }
  }

  return (
    <div className="h-full flex flex-col">
      {/* 可视区域 - 盛满剩余高度并可滚动 */}
      <div className="flex-1 min-h-0">
        <ScrollArea
          id="canvasRoot"
          type="hover"
          ref={scrollAreaRef}
          className="h-full relative"
          classNames={{
            root: 'h-full relative',
            viewport: 'viewport',
          }}
        >
          {loading && (
            <div className="absolute z-40 top-6 right-6 bottom-6 left-6 bg-cell flex items-center justify-center rounded-lg">
              <Loader size="3" />
            </div>
          )}
          <div className="relative m-auto max-w-[1020px] px-[40px] py-4">
            <section className="w-full h-full" id="book-section" onClick={handleUserClickEvent}>
              <ContentRender contentString={content} />
            </section>
          </div>
        </ScrollArea>
      </div>

      {/* 操作区域 - 固定高度42px */}
      <div className="h-[42px] border-t border-gray-200 bg-white flex items-center justify-center space-x-4 px-4 flex-shrink-0">
        <Button
          variant="subtle"
          size="sm"
          leftSection={<IconChevronLeft size={16} />}
          onClick={prevPage}
          disabled={currentSectionIndex <= 0}
        >
          上一页
        </Button>
        <Button
          variant="subtle"
          size="sm"
          rightSection={<IconChevronRight size={16} />}
          onClick={nextPage}
        >
          下一页
        </Button>
      </div>
    </div>
  );
});

EpubViewer.displayName = 'EpubViewer';
