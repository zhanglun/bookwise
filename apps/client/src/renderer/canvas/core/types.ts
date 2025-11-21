export type ToolType = 'line' | 'circle' | 'rect' | 'select';

export interface BaseShape {
  id: string;
  tool: ToolType;
}

export interface LineShape extends BaseShape {
  tool: 'line';
  points: number[];
  stroke: string;
  strokeWidth: number;
  tension: number;
  lineCap: string;
  lineJoin: string;
}

export interface CircleShape extends BaseShape {
  tool: 'circle';
  x: number;
  y: number;
  radius: number;
  fill: string;
  startX?: number;
  startY?: number;
}

export interface RectShape extends BaseShape {
  tool: 'rect';
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
}

export type Shape = LineShape | CircleShape | RectShape;

export interface DrawingEngineConfig {
  width: number;
  height: number;
  container: HTMLDivElement;
}

export type ShapeChangeListener = (shapes: Shape[]) => void;
