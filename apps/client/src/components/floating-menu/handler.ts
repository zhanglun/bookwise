interface SelectionHandler {
  format: 'epub' | 'pdf';

  // 监听选择变化
  onSelectionChange: (callback: (selection: SelectionInfo) => void) => void;

  // 创建标注
  createAnnotation: (type: AnnotationType, data: any) => Promise<Annotation>;

  // 渲染标注
  renderAnnotation: (annotation: Annotation) => void;
}

// EPUB 实现
class EPUBSelectionHandler implements SelectionHandler {
  format = 'epub' as const;
  private overlayers: Map<number, any>;

  onSelectionChange(callback) {
    // 监听 iframe 内的 selectionchange
    doc.addEventListener('selectionchange', () => {
      const selection = doc.getSelection();
      if (!selection || selection.isCollapsed) return;

      const range = selection.getRangeAt(0);
      const rects = range.getClientRects();

      callback({
        text: selection.toString(),
        range: range,
        position: this.calculatePosition(rects, iframe),
      });
    });
  }

  async createAnnotation(type, data) {
    const { range, color, note } = data;
    const overlayer = this.overlayers.get(data.sectionIndex);

    // 使用 Overlayer 绘制
    const value = `annotation-${Date.now()}`;
    overlayer.add(value, range, Overlayer.highlight, { color });

    return { value, type, color, note, range };
  }
}

// PDF 实现
class PDFSelectionHandler implements SelectionHandler {
  format = 'pdf' as const;
  private uiManager: any; // 不使用 PDF.js 的 UI,只用其底层 API

  onSelectionChange(callback) {
    document.addEventListener('selectionchange', () => {
      const selection = document.getSelection();
      if (!selection || selection.isCollapsed) return;

      // 获取选择框
      const boxes = this.getSelectionBoxes(selection);

      callback({
        text: selection.toString(),
        boxes: boxes,
        position: this.calculatePosition(boxes),
      });
    });
  }

  async createAnnotation(type, data) {
    // 直接调用 PDF.js 的底层 API,绕过其 UI
    const { boxes, color, note } = data;

    // 使用 AnnotationStorage 而不是 UI Manager
    const editor = await this.createHighlightEditor(boxes, color);

    return { id: editor.id, type, color, note, boxes };
  }

  private createHighlightEditor(boxes, color) {
    // 直接创建编辑器对象,不通过 UI
    const layer = this.uiManager.currentLayer;
    return layer.deserialize({
      annotationType: 9, // HIGHLIGHT
      color: color,
      boxes: boxes,
    });
  }
}
