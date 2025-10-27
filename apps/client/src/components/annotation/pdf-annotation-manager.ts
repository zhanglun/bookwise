import { AnnotationManager } from './AnnotationManager';
import { Annotation, AnnotationStyle, AnnotationType } from './types';

export class PDFAnnotationManager implements AnnotationManager {
  private pdfDocument: any;
  private annotationStorage: any;
  private pageIndex: number;

  constructor(pdfDocument: any, pageIndex: number) {
    this.pdfDocument = pdfDocument;
    this.annotationStorage = pdfDocument.annotationStorage;
    this.pageIndex = pageIndex;
  }

  async createAnnotation(
    selection: Selection | Range,
    type: AnnotationType,
    style: AnnotationStyle
  ): Promise<Annotation> {
    const id = `pdf-${Date.now()}-${Math.random()}`;

    // 获取选择的边界框(归一化坐标 0-1)
    const boxes = this.getSelectionBoxes(selection);

    const annotation: Annotation = {
      id,
      type,
      format: 'pdf',
      location: {
        pdf: {
          pageIndex: this.pageIndex,
          boxes,
        },
      },
      style,
      content: {
        text: selection instanceof Selection ? selection.toString() : '',
      },
      createdAt: Date.now(),
      modifiedAt: Date.now(),
    };

    // 使用 PDF.js 的 AnnotationStorage 存储
    // 参考 vendor/pdfjs/pdf.mjs 中的实现
    if (type === 'highlight') {
      const editorData = {
        annotationType: 9, // AnnotationEditorType.HIGHLIGHT
        color: this.hexToRgb(style.color),
        opacity: style.opacity || 1,
        boxes,
        pageIndex: this.pageIndex,
      };
      this.annotationStorage.setValue(id, editorData);
    }

    return annotation;
  }

  renderAnnotation(annotation: Annotation, container: HTMLElement): void {
    if (!annotation.location.pdf) {
      return;
    }

    const { boxes } = annotation.location.pdf;

    // 创建高亮覆盖层
    boxes.forEach((box) => {
      const highlight = document.createElement('div');
      highlight.style.cssText = `
        position: absolute;
        left: ${box.x * 100}%;
        top: ${box.y * 100}%;
        width: ${box.width * 100}%;
        height: ${box.height * 100}%;
        background-color: ${annotation.style.color};
        opacity: ${annotation.style.opacity || 0.3};
        pointer-events: auto;
        cursor: pointer;
      `;
      highlight.dataset.annotationId = annotation.id;
      container.appendChild(highlight);
    });
  }

  updateAnnotation(id: string, updates: Partial<Annotation>): void {
    const existing = this.annotationStorage.getRawValue(id);
    if (!existing) {
      return;
    }

    if (updates.style?.color) {
      existing.color = this.hexToRgb(updates.style.color);
    }
    if (updates.style?.opacity !== undefined) {
      existing.opacity = updates.style.opacity;
    }

    this.annotationStorage.setValue(id, existing);
  }

  deleteAnnotation(id: string): void {
    this.annotationStorage.remove(id);
  }

  getAnnotations(): Annotation[] {
    const annotations: Annotation[] = [];
    const storage = this.annotationStorage.getAll();

    if (!storage) {
      return annotations;
    }

    for (const [id, data] of Object.entries(storage)) {
      if (data.pageIndex === this.pageIndex) {
        annotations.push(this.deserializeAnnotation(id, data));
      }
    }

    return annotations;
  }

  private getSelectionBoxes(
    selection: Selection | Range
  ): Array<{ x: number; y: number; width: number; height: number }> {
    const range = selection instanceof Selection ? selection.getRangeAt(0) : selection;
    const rects = range.getClientRects();
    const boxes: Array<{ x: number; y: number; width: number; height: number }> = [];

    // 获取页面容器尺寸用于归一化
    const pageElement = range.startContainer.ownerDocument?.querySelector('.page');
    if (!pageElement) {
      return boxes;
    }

    const pageRect = pageElement.getBoundingClientRect();

    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      boxes.push({
        x: (rect.left - pageRect.left) / pageRect.width,
        y: (rect.top - pageRect.top) / pageRect.height,
        width: rect.width / pageRect.width,
        height: rect.height / pageRect.height,
      });
    }

    return boxes;
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255,
        ]
      : [1, 1, 0]; // 默认黄色
  }

  private deserializeAnnotation(id: string, data: any): Annotation {
    return {
      id,
      type: 'highlight',
      format: 'pdf',
      location: {
        pdf: {
          pageIndex: data.pageIndex,
          boxes: data.boxes,
        },
      },
      style: {
        color: `rgb(${data.color[0] * 255}, ${data.color[1] * 255}, ${data.color[2] * 255})`,
        opacity: data.opacity,
      },
      content: {},
      createdAt: data.createdAt || Date.now(),
      modifiedAt: data.modifiedAt || Date.now(),
    };
  }
}
