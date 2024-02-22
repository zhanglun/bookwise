export interface MarkConfig {

}

export interface MarkAnnotation {
  content: "",

}

export interface TextMarkConfig {
  rectFill: string;
  lineStroke: string;
  strokeWidth: number;
}

export enum MarkTypeEnum {
  TEXT = 'text',
  RECT = 'rect'
}

export interface TextMarkNode {
  path: number[]
  offset: number
  text: string
}

export interface TextMark {
  text: string;
  start: TextMarkNode,
  end: TextMarkNode,
}

export interface RectMark {
}

export interface Mark {
  id: string;
  type: MarkTypeEnum,
  data: TextMark,
  annotation: MarkAnnotation,
  config: TextMarkConfig,
}

export interface RectPosition {
  x: number
  y: number
  width: number
  height: number
}
