import { Annotation, AnnotationStyle, AnnotationType } from './types';

export interface SelectionInfo {
  text: string;
  range?: Range;
  boxes?: Array<{ x: number; y: number; width: number; height: number }>;
  index: number;
}

export interface AnnotationManager {
  // 创建标注
  createAnnotation: (
    selection: SelectionInfo,
    type: AnnotationType,
    style: AnnotationStyle
  ) => Promise<Annotation>;

  // 渲染标注
  renderAnnotation: (annotation: Annotation) => void;

  // 更新标注
  updateAnnotation: (id: string, updates: Partial<Annotation>) => Promise<void>;

  // 删除标注
  deleteAnnotation: (id: string) => Promise<void>;

  // 获取所有标注
  getAllAnnotations: () => Annotation[];

  // 点击测试
  hitTest: (event: MouseEvent) => Annotation | null;

  // 清理资源
  destroy: () => void;
}
