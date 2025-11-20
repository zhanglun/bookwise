import React, { useEffect, useRef, useState } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { ScrollArea } from '@mantine/core';
import {
  currentIndexAtom,
  currentTocHrefAtom,
  currentTocItemAtom,
  navigationFunctionAtom,
} from '@/pages/viewer/atoms/navigation-atoms';
import { NavigationBar } from './navigation';
import { useNavigationManager } from './use-navigation';
import { useShadowDOMManager } from './use-shadow-dom';

interface RendererProps {
  book: any;
  onRelocate?: (location: { index: number; fraction: number }) => void;
}

// SectionProgress 类 - 从 foliate-js 移植
class SectionProgress {
  sizes: number[];
  sizePerLoc: number;
  sizePerTimeUnit: number;
  sizeTotal: number;
  sectionFractions: number[];

  constructor(sections: any[], sizePerLoc: number, sizePerTimeUnit: number) {
    this.sizes = sections.map((s) => (s.linear !== 'no' && s.size > 0 ? s.size : 0));
    this.sizePerLoc = sizePerLoc;
    this.sizePerTimeUnit = sizePerTimeUnit;
    this.sizeTotal = this.sizes.reduce((a, b) => a + b, 0);
    this.sectionFractions = this.getSectionFractions();
  }

  private getSectionFractions() {
    const { sizeTotal } = this;
    const results = [0];
    let sum = 0;
    for (const size of this.sizes) {
      results.push((sum += size) / sizeTotal);
    }
    return results;
  }

  getProgress(index: number, fractionInSection: number, pageFraction = 0) {
    const { sizes, sizePerLoc, sizePerTimeUnit, sizeTotal } = this;
    const sizeInSection = sizes[index] ?? 0;
    const sizeBefore = sizes.slice(0, index).reduce((a, b) => a + b, 0);
    const size = sizeBefore + fractionInSection * sizeInSection;
    const nextSize = size + pageFraction * sizeInSection;
    const remainingTotal = sizeTotal - size;
    const remainingSection = (1 - fractionInSection) * sizeInSection;
    return {
      fraction: nextSize / sizeTotal,
      section: {
        current: index,
        total: sizes.length,
      },
      location: {
        current: Math.floor(size / sizePerLoc),
        next: Math.floor(nextSize / sizePerLoc),
        total: Math.ceil(sizeTotal / sizePerLoc),
      },
      time: {
        section: remainingSection / sizePerTimeUnit,
        total: remainingTotal / sizePerTimeUnit,
      },
    };
  }

  getSection(fraction: number): [number, number] {
    if (fraction <= 0) return [0, 0];
    if (fraction >= 1) return [this.sizes.length - 1, 1];
    fraction = fraction + Number.EPSILON;
    const { sizeTotal } = this;
    let index = this.sectionFractions.findIndex((x) => x > fraction) - 1;
    if (index < 0) return [0, 0];
    while (!this.sizes[index]) index++;
    const fractionInSection =
      (fraction - this.sectionFractions[index]) / (this.sizes[index] / sizeTotal);
    return [index, fractionInSection];
  }
}

const getTocItemForSection = (book: any, sectionIndex: number) => {
  if (!book.toc || !book.sections) {
    return null;
  }
  const section = book.sections[sectionIndex];
  if (!section) {
    return null;
  }

  const findMatchingItem = (items: any[]): any => {
    for (const item of items) {
      const resolved = book.resolveHref?.(item.href);
      if (resolved?.index === sectionIndex) {
        return item;
      }
      if (item.subitems) {
        const found = findMatchingItem(item.subitems);
        if (found) {
          return found;
        }
      }
    }
    return null;
  };

  return findMatchingItem(book.toc);
};

export const Renderer = React.forwardRef<any, RendererProps>(({ book, onRelocate }, ref) => {
  const shadowDOM = useShadowDOMManager();
  const navigation = useNavigationManager(book);
  const [currentIndex, setCurrentIndex] = useAtom(currentIndexAtom);
  const setNavigationFunction = useSetAtom(navigationFunctionAtom);
  const setCurrentTocHref = useSetAtom(currentTocHrefAtom);
  const setCurrentTocItem = useSetAtom(currentTocItemAtom);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [sectionProgress, setSectionProgress] = useState<SectionProgress | null>(null);
  const bookRef = useRef(book);

  // 更新 book ref
  useEffect(() => {
    bookRef.current = book;
  }, [book]);

  // 初始化 SectionProgress
  useEffect(() => {
    if (book?.sections) {
      const progress = new SectionProgress(book.sections, 1500, 1600);
      setSectionProgress(progress);
    }
  }, [book]);

  // 加载当前 section
  const loadCurrentSection = async (index: number) => {
    if (!bookRef.current?.sections?.[index]) {
      console.warn(`Section ${index} not found`);
      return;
    }

    setIsLoading(true);
    try {
      const section = bookRef.current.sections[index];
      const element = await shadowDOM.loadContent(book, section);

      if (element) {
        handleInternalLinks(element, index);
        setCurrentIndex(index);

        // 计算并更新进度
        if (sectionProgress) {
          const progressData = sectionProgress.getProgress(index, 0, 0);
          setProgress(progressData.fraction);

          if (onRelocate) {
            onRelocate({ index, fraction: progressData.fraction });
          }
        }

        const tocItem = getTocItemForSection(book, index);
        if (tocItem) {
          setCurrentTocHref(tocItem.href);
          setCurrentTocItem(tocItem);
        }
      }
    } catch (error) {
      console.error(`Failed to load section ${index}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理页面内链接
  const handleInternalLinks = (element: HTMLElement, currentIndex: number) => {
    const links = element.querySelectorAll('a[href]');
    const section = bookRef.current.sections[currentIndex];

    links.forEach((link) => {
      link.addEventListener('click', async (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (!href) {
          return;
        }

        try {
          const resolved = bookRef.current?.resolveHref?.(section.resolveHref(href));
          if (resolved) {
            await goTo(section.resolveHref(href));

            if (resolved.anchor) {
              requestAnimationFrame(() => {
                const shadowRoot = shadowDOM.containerRef.current?.shadowRoot;
                if (shadowRoot) {
                  const doc = shadowRoot.querySelector('*')?.ownerDocument || document;
                  const targetElement = resolved.anchor(doc);
                  targetElement?.scrollIntoView({ behavior: 'smooth' });
                }
              });
            }
          }
        } catch (error) {
          console.error('Failed to navigate:', error);
        }
      });
    });
  };

  // 导航方法
  const goTo = async (target: string | number) => {
    const resolved = await navigation.resolveTarget(target);
    if (!resolved) {
      console.warn('Could not resolve target:', target);
      return;
    }

    await loadCurrentSection(resolved.index);

    if (resolved && resolved.anchor) {
      requestAnimationFrame(() => {
        const shadowRoot = shadowDOM.containerRef.current?.shadowRoot;
        if (shadowRoot && resolved.anchor) {
          const doc = shadowRoot.querySelector('*')?.ownerDocument || document;
          const targetElement = resolved.anchor(doc);
          targetElement && (targetElement as HTMLElement).scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  };

  // 通过进度值跳转
  const goToFraction = async (fraction: number) => {
    if (!sectionProgress) return;

    const [index, fractionInSection] = sectionProgress.getSection(fraction);
    await loadCurrentSection(index);
  };

  // 前进/后退方法
  const next = async () => {
    if (currentIndex < (bookRef.current?.sections?.length ?? 0) - 1) {
      await goTo(currentIndex + 1);
    }
  };

  const prev = async () => {
    if (currentIndex > 0) {
      await goTo(currentIndex - 1);
    }
  };

  // 暴露导航方法给父组件
  React.useImperativeHandle(ref, () => ({
    goTo,
    next,
    prev,
    goToFraction,
    currentIndex,
  }));

  // 注册导航函数到 Jotai atom
  useEffect(() => {
    setNavigationFunction(() => goTo);
    return () => setNavigationFunction(null);
  }, [goTo, setNavigationFunction]);

  // 初始化
  useEffect(() => {
    if (book) {
      loadCurrentSection(0);
    }
  }, [book]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ScrollArea style={{ height: '100%', minHeight: '100%' }}>
        <div ref={shadowDOM.containerRef} style={{ padding: '0 30px 80px 30px' }} />

        {isLoading && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '4px',
              zIndex: 1000,
            }}
          >
            Loading...
          </div>
        )}
      </ScrollArea>

      <div
        style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          padding: '12px 24px',
          zIndex: 1000,
        }}
      >
        <NavigationBar
          book={book}
          currentIndex={currentIndex}
          isLoading={isLoading}
          progress={progress}
          onProgressChange={goToFraction}
          prev={prev}
          next={next}
        />
      </div>
    </div>
  );
});

Renderer.displayName = 'Renderer';
