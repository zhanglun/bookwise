export interface MarkConfig {}

export interface ExtraInfo {
  spine_index: number;
  spine_name: string;
}

export interface TextMarkConfig {
  rectFill: string;
  lineStroke: string;
  strokeWidth: number;
}

export enum MarkTypeEnum {
  TEXT = "TEXT",
  RECT = "RECT",
}

export interface TextMarkNode {
  path: number[];
  offset: number;
  text: string;
}

export interface TextMark {
  start: TextMarkNode;
  end: TextMarkNode;
}

export interface RectMark {}

export interface Mark {
  id: string;
  type: MarkTypeEnum;
  spine_index: number;
  spine_name: string;
  title?: string;
  content?: string;
  data: TextMark;
  config: TextMarkConfig;
}

export interface RectPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}
