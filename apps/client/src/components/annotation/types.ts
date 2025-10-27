export type AnnotationType = 'highlight' | 'note' | 'ink' | 'shape';
export type ShapeType = 'circle' | 'rect' | 'polygon';

export interface AnnotationLocation {
  epub?: {
    sectionIndex: number;
    cfi?: string;
    range?: {
      startContainer: string;
      startOffset: number;
      endContainer: string;
      endOffset: number;
    };
  };
  pdf?: {
    pageIndex: number;
    boxes: Array<{ x: number; y: number; width: number; height: number }>;
  };
}

export interface AnnotationStyle {
  color: string;
  opacity?: number;
  strokeWidth?: number;
}

export interface AnnotationContent {
  text?: string;
  note?: string;
  inkPath?: string;
  shapeType?: ShapeType;
  shapeData?: any;
}

export interface Annotation {
  id: string;
  type: AnnotationType;
  format: 'epub' | 'pdf';
  location: AnnotationLocation;
  style: AnnotationStyle;
  content?: AnnotationContent;
  createdAt: number;
  modifiedAt: number;
}
