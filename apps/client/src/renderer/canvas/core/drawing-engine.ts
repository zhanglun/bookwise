import Konva from 'konva';
import { DrawingEngineConfig, Shape, ShapeChangeListener, ToolType } from './types';

export class DrawingEngine {
  private stage: Konva.Stage;
  private layer: Konva.Layer;
  private transformer: Konva.Transformer;
  private shapes = new Map<string, Konva.Shape>();
  private shapeData: Shape[] = [];
  private currentTool: ToolType = 'select';
  private currentColor: string = '#000000';
  private isDrawing: boolean = false;
  private currentShape: Shape | null = null;
  private selectedId: string | null = null;
  private listeners = new Set<ShapeChangeListener>();

  constructor(config: DrawingEngineConfig) {
    this.stage = new Konva.Stage({
      container: config.container,
      width: config.width,
      height: config.height,
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);

    this.transformer = new Konva.Transformer({
      boundBoxFunc: (oldBox, newBox) => {
        if (newBox.width < 5 || newBox.height < 5) {
          return oldBox;
        }
        return newBox;
      },
      enabledAnchors: [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        'top-center',
        'middle-right',
        'middle-left',
        'bottom-center',
      ],
      rotateEnabled: true,
    });
    this.layer.add(this.transformer);

    this.setupEvents();
  }

  private setupEvents() {
    this.stage.on('mousedown', this.handleMouseDown.bind(this));
    this.stage.on('mousemove', this.handleMouseMove.bind(this));
    this.stage.on('mouseup', this.handleMouseUp.bind(this));
    this.stage.on('click tap', this.handleClick.bind(this));
  }

  private handleClick(e: Konva.KonvaEventObject<MouseEvent>) {
    if (this.isDrawing) {
      return;
    }

    if (e.target === this.stage || e.target === this.layer) {
      this.selectShape(null);
      return;
    }

    if (e.target.id()) {
      this.selectShape(e.target.id());
    }
  }

  private handleMouseDown(e: Konva.KonvaEventObject<MouseEvent>) {
    const clickedOnEmpty = e.target === this.stage || e.target === this.layer;

    if (!clickedOnEmpty) {
      return;
    }

    if (this.currentTool === 'select') {
      return;
    }

    // 开始绘制新形状前,取消当前选中状态
    if (this.selectedId) {
      this.selectShape(null);
    }

    this.isDrawing = true;
    const pos = this.stage.getPointerPosition();
    if (!pos) {
      return;
    }

    const id = `shape-${Date.now()}`;

    if (this.currentTool === 'line') {
      this.currentShape = {
        id,
        tool: 'line',
        points: [pos.x, pos.y],
        stroke: this.currentColor,
        strokeWidth: 2,
        tension: 0.5,
        lineCap: 'round',
        lineJoin: 'round',
      };
    } else if (this.currentTool === 'circle') {
      this.currentShape = {
        id,
        tool: 'circle',
        x: pos.x,
        y: pos.y,
        radius: 0,
        fill: this.currentColor,
        startX: pos.x,
        startY: pos.y,
      };
    } else if (this.currentTool === 'rect') {
      this.currentShape = {
        id,
        tool: 'rect',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        fill: this.currentColor,
      };
    }

    if (this.currentShape) {
      this.shapeData.push(this.currentShape);
      this.createKonvaShape(this.currentShape);
      this.notifyListeners();
    }
  }

  private handleMouseMove(e: Konva.KonvaEventObject<MouseEvent>) {
    if (!this.isDrawing || !this.currentShape) {
      return;
    }

    const pos = this.stage.getPointerPosition();
    if (!pos) {
      return;
    }

    const lastShape = this.shapeData[this.shapeData.length - 1];

    if (this.currentTool === 'line' && lastShape.tool === 'line') {
      lastShape.points = lastShape.points.concat([pos.x, pos.y]);
      this.syncKonvaShapeFromData(lastShape);
    } else if (this.currentTool === 'circle' && lastShape.tool === 'circle') {
      const dx = pos.x - lastShape.startX!;
      const dy = pos.y - lastShape.startY!;
      const radius = Math.sqrt(dx * dx + dy * dy);
      lastShape.x = lastShape.startX! + dx / 2;
      lastShape.y = lastShape.startY! + dy / 2;
      lastShape.radius = radius / 2;
      this.syncKonvaShapeFromData(lastShape);
    } else if (this.currentTool === 'rect' && lastShape.tool === 'rect') {
      lastShape.width = pos.x - lastShape.x;
      lastShape.height = pos.y - lastShape.y;
      this.syncKonvaShapeFromData(lastShape);
    }

    this.layer.batchDraw();
  }

  private handleMouseUp() {
    this.isDrawing = false;
    this.currentShape = null;
  }

  private createKonvaShape(shape: Shape): Konva.Shape {
    let konvaShape: Konva.Shape;

    if (shape.tool === 'line') {
      konvaShape = new Konva.Line({
        id: shape.id,
        points: shape.points,
        stroke: shape.stroke,
        strokeWidth: shape.strokeWidth,
        tension: shape.tension,
        lineCap: shape.lineCap as any,
        lineJoin: shape.lineJoin as any,
      });
    } else if (shape.tool === 'circle') {
      konvaShape = new Konva.Circle({
        id: shape.id,
        x: shape.x,
        y: shape.y,
        radius: shape.radius,
        fill: shape.fill,
        draggable: false,
      });
    } else {
      konvaShape = new Konva.Rect({
        id: shape.id,
        x: shape.x,
        y: shape.y,
        width: shape.width,
        height: shape.height,
        fill: shape.fill,
        draggable: false,
      });
    }

    konvaShape.draggable(true);

    konvaShape.on('dragstart', () => {
      // 拖拽开始时自动选中该形状
      if (this.selectedId !== shape.id) {
        this.selectShape(shape.id);
      }
    });

    konvaShape.on('dragend', () => {
      this.updateShapeDataFromKonva(shape.id, {
        x: konvaShape.x(),
        y: konvaShape.y(),
      });
    });

    konvaShape.on('transformend', () => {
      const scaleX = konvaShape.scaleX();
      const scaleY = konvaShape.scaleY();

      if (shape.tool === 'circle') {
        const newRadius = Math.max((konvaShape as Konva.Circle).radius() * scaleX, 5);
        const newX = konvaShape.x();
        const newY = konvaShape.y();

        // 更新数据数组
        this.updateShapeDataFromKonva(shape.id, {
          x: newX,
          y: newY,
          radius: newRadius,
        });

        // 立即更新 Konva 节点
        (konvaShape as Konva.Circle).radius(newRadius);
        konvaShape.x(newX);
        konvaShape.y(newY);
      } else if (shape.tool === 'rect') {
        const newWidth = Math.max(5, (konvaShape as Konva.Rect).width() * scaleX);
        const newHeight = Math.max(5, (konvaShape as Konva.Rect).height() * scaleY);
        const newX = konvaShape.x();
        const newY = konvaShape.y();

        // 更新数据数组
        this.updateShapeDataFromKonva(shape.id, {
          x: newX,
          y: newY,
          width: newWidth,
          height: newHeight,
        });

        // 立即更新 Konva 节点
        (konvaShape as Konva.Rect).width(newWidth);
        (konvaShape as Konva.Rect).height(newHeight);
        konvaShape.x(newX);
        konvaShape.y(newY);
      }

      // 重置 scale
      konvaShape.scaleX(1);
      konvaShape.scaleY(1);

      this.layer.batchDraw();
    });

    this.layer.add(konvaShape);
    this.shapes.set(shape.id, konvaShape);
    this.transformer.moveToTop();
    this.layer.batchDraw();

    return konvaShape;
  }

  // 从数据更新 Konva 节点
  private syncKonvaShapeFromData(shape: Shape) {
    const konvaShape = this.shapes.get(shape.id);
    if (!konvaShape) {
      return;
    }

    if (shape.tool === 'line') {
      (konvaShape as Konva.Line).points(shape.points);
    } else if (shape.tool === 'circle') {
      (konvaShape as Konva.Circle).x(shape.x);
      (konvaShape as Konva.Circle).y(shape.y);
      (konvaShape as Konva.Circle).radius(shape.radius);
    } else if (shape.tool === 'rect') {
      (konvaShape as Konva.Rect).x(shape.x);
      (konvaShape as Konva.Rect).y(shape.y);
      (konvaShape as Konva.Rect).width(shape.width);
      (konvaShape as Konva.Rect).height(shape.height);
    }
  }

  // 从 Konva 节点更新数据数组
  private updateShapeDataFromKonva(id: string, attrs: Partial<Shape>) {
    const index = this.shapeData.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.shapeData[index] = { ...this.shapeData[index], ...attrs } as Shape;
      this.notifyListeners();
    }
  }

  private selectShape(id: string | null) {
    this.selectedId = id;

    if (id) {
      const konvaShape = this.shapes.get(id);
      if (konvaShape) {
        // konvaShape.draggable(true);
        this.transformer.nodes([konvaShape]);
        this.transformer.moveToTop();
      }
    } else {
      this.transformer.nodes([]);
    }

    this.layer.batchDraw();
  }

  public setTool(tool: ToolType) {
    this.currentTool = tool;
    // 切换到绘制工具时,取消当前选中状态
    if (tool !== 'select' && this.selectedId) {
      this.selectShape(null);
    }
  }

  public setColor(color: string) {
    this.currentColor = color;

    // 如果有选中的形状,同时修改该形状的颜色
    if (this.selectedId) {
      const index = this.shapeData.findIndex((s) => s.id === this.selectedId);
      if (index === -1) {
        return;
      }

      const shape = this.shapeData[index];

      // 线条修改 stroke,其他形状修改 fill
      if (shape.tool === 'line') {
        shape.stroke = color;
      } else if (shape.tool === 'circle' || shape.tool === 'rect') {
        shape.fill = color;
      }

      // 立即同步到 Konva 节点
      const konvaShape = this.shapes.get(this.selectedId);
      if (konvaShape) {
        if (shape.tool === 'line') {
          (konvaShape as Konva.Line).stroke(color);
        } else {
          konvaShape.fill(color);
        }
        this.layer.batchDraw();
      }

      this.notifyListeners();
    }
  }

  public clear() {
    this.shapes.forEach((shape) => shape.destroy());
    this.shapes.clear();
    this.shapeData = [];
    this.selectedId = null;
    this.transformer.nodes([]);
    this.layer.batchDraw();
    this.notifyListeners();
  }

  public getShapes(): Shape[] {
    return [...this.shapeData];
  }

  public getSelectedId(): string | null {
    return this.selectedId;
  }

  public subscribe(listener: ShapeChangeListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener([...this.shapeData]));
  }

  public destroy() {
    this.stage.destroy();
    this.shapes.clear();
    this.listeners.clear();
  }

  public resize(width: number, height: number) {
    this.stage.width(width);
    this.stage.height(height);
    this.layer.batchDraw();
  }
}
