import { Overlayer } from 'foliate-js/overlayer.js';
import { AnnotationManager, SelectionInfo } from './annotation-manager';
import { Annotation, AnnotationStyle, AnnotationType } from './types';

export class EPUBAnnotationManager implements AnnotationManager {
  private overlayers = new Map<number, Overlayer>();
  private annotations = new Map<string, Annotation>();
  private iframes = new Map<number, HTMLIFrameElement>();

  constructor(private book: any) {}

  // 为每个章节创建 Overlayer
  createOverlayer(doc: Document, iframe: HTMLIFrameElement, index: number): Overlayer {
    if (this.overlayers.has(index)) {
      return this.overlayers.get(index)!;
    }

    const overlayer = new Overlayer();
    this.overlayers.set(index, overlayer);
    this.iframes.set(index, iframe);

    // 监听点击事件
    doc.addEventListener('click', (e) => {
      const [value, range] = overlayer.hitTest(e);
      if (value) {
        const annotation = this.annotations.get(value);
        if (annotation) {
          this.onAnnotationClick?.(annotation);
        }
      }
    });

    return overlayer;
  }

  async createAnnotation(
    selection: SelectionInfo,
    type: AnnotationType,
    style: AnnotationStyle
  ): Promise<Annotation> {
    const { text, range, index } = selection;

    if (!range) {
      throw new Error('Range is required for EPUB annotations');
    }

    const id = `epub-${Date.now()}-${Math.random()}`;

    // 序列化 Range
    const serializedRange = {
      startContainer: this.getNodePath(range.startContainer),
      startOffset: range.startOffset,
      endContainer: this.getNodePath(range.endContainer),
      endOffset: range.endOffset,
    };

    // 生成 CFI (如果可用)
    let cfi: string | undefined;
    if (this.book.getCFI) {
      try {
        cfi = this.book.getCFI(index, range);
      } catch (e) {
        console.warn('Failed to generate CFI:', e);
      }
    }

    const annotation: Annotation = {
      id,
      type,
      format: 'epub',
      location: {
        epub: {
          sectionIndex: index,
          cfi,
          range: serializedRange,
        },
      },
      style,
      content: { text },
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    this.annotations.set(id, annotation);
    this.renderAnnotation(annotation);

    return annotation;
  }

  renderAnnotation(annotation: Annotation): void {
    const { id, location, style, type } = annotation;
    const sectionIndex = location.epub?.sectionIndex;

    if (sectionIndex === undefined) {
      return;
    }

    const overlayer = this.overlayers.get(sectionIndex);
    const iframe = this.iframes.get(sectionIndex);

    if (!overlayer || !iframe) {
      return;
    }

    const doc = iframe.contentDocument;
    if (!doc) {
      return;
    }

    // 反序列化 Range
    const range = this.deserializeRange(doc, location.epub!.range!);
    if (!range) {
      return;
    }

    // 根据类型选择绘制函数
    let drawFunc;
    if (type === 'highlight') {
      drawFunc = Overlayer.highlight;
    } else if (type === 'note') {
      drawFunc = Overlayer.underline;
    } else {
      drawFunc = Overlayer.outline;
    }

    overlayer.add(id, range, drawFunc, { color: style.color });
  }

  async updateAnnotation(id: string, updates: Partial<Annotation>): Promise<void> {
    const annotation = this.annotations.get(id);
    if (!annotation) {
      return;
    }

    Object.assign(annotation, updates);
    annotation.modifiedAt = Date.now();

    // 重新渲染
    const sectionIndex = annotation.location.epub?.sectionIndex;
    if (sectionIndex !== undefined) {
      const overlayer = this.overlayers.get(sectionIndex);
      overlayer?.remove(id);
      this.renderAnnotation(annotation);
    }
  }

  async deleteAnnotation(id: string): Promise<void> {
    const annotation = this.annotations.get(id);
    if (!annotation) {
      return;
    }

    const sectionIndex = annotation.location.epub?.sectionIndex;
    if (sectionIndex !== undefined) {
      const overlayer = this.overlayers.get(sectionIndex);
      overlayer?.remove(id);
    }

    this.annotations.delete(id);
  }

  getAllAnnotations(): Annotation[] {
    return Array.from(this.annotations.values());
  }

  hitTest(event: MouseEvent): Annotation | null {
    // 找到对应的 overlayer
    for (const [index, overlayer] of this.overlayers) {
      const [value] = overlayer.hitTest(event);
      if (value) {
        return this.annotations.get(value) || null;
      }
    }
    return null;
  }

  destroy(): void {
    this.overlayers.clear();
    this.annotations.clear();
    this.iframes.clear();
  }

  // 辅助方法
  private getNodePath(node: Node): string {
    const path: number[] = [];
    let current: Node | null = node;

    while (current && current.parentNode) {
      const parent = current.parentNode;
      const index = Array.from(parent.childNodes).indexOf(current as ChildNode);
      path.unshift(index);
      current = parent;
    }

    return path.join('/');
  }

  private deserializeRange(doc: Document, serialized: any): Range | null {
    try {
      const range = doc.createRange();
      const startNode = this.getNodeByPath(doc, serialized.startContainer);
      const endNode = this.getNodeByPath(doc, serialized.endContainer);

      if (!startNode || !endNode) {
        return null;
      }

      range.setStart(startNode, serialized.startOffset);
      range.setEnd(endNode, serialized.endOffset);

      return range;
    } catch (e) {
      console.error('Failed to deserialize range:', e);
      return null;
    }
  }

  private getNodeByPath(doc: Document, path: string): Node | null {
    const indices = path.split('/').map(Number);
    let current: Node = doc;

    for (const index of indices) {
      if (!current.childNodes[index]) {
        return null;
      }
      current = current.childNodes[index];
    }

    return current;
  }

  onAnnotationClick?: (annotation: Annotation) => void;
}
