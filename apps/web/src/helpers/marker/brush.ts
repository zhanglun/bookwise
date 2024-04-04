import Konva from "konva";
import {RectPosition, TextMarkConfig} from "./types";

const RECT_PREFIX = "rect-";
const LINE_PREFIX = "line-";
const SHAPE_PREFIX = "shape-";

export class Brush {
  public root: HTMLElement;
  public window: Window;
  private container: HTMLDivElement;
  private config: any;

  private stage: Konva.Stage;
  private layer: Konva.Layer;

  private groups: Array<{
    id: string;
    group: Konva.Group;
    positions: RectPosition[];
  }> = [];

  constructor(root: HTMLElement, canvasContainer: HTMLDivElement, win: Window, config?: any) {
    this.root = root;
    this.window = win;
    this.config = config;
    this.container = canvasContainer;

    const styles = getComputedStyle(this.container);
    const { width, height }= styles;

    Konva.pixelRatio = 1;
    this.stage = new Konva.Stage({
      container: this.container,
      width: parseInt(width, 10),
      height: parseInt(height, 10),
    });


    this.layer = new Konva.Layer();
    if (this.config?.pixelRatio)
      this.layer.getCanvas().setPixelRatio(this.config.pixelRatio);
    this.stage.add(this.layer);
  }

  renderRange(domRects: DOMRect[], id: string, config: TextMarkConfig) {
    const {group, rectGroup, lineGroup, shapeGroup} = this.createGroup(
      id,
      config
    );

    const {top, left} = this.getRootPosition();
    const positions: RectPosition[] = [];
    domRects.forEach((i, index) => {
      const x = i.left - left;
      const y = i.top - top;
      const position = {
        x,
        y,
        width: i.width,
        height: i.height,
      };
      positions.push(position);

      const shapeConstructors = this.config?.shapeConstructors;
      if (shapeGroup && shapeConstructors) {
        shapeConstructors.forEach((fn) => {
          shapeGroup.add(fn(position, id, domRects, index));
        });
      }
      rectGroup.add(this.createRect(position, config));
      lineGroup.add(this.createLine(position, config));
    });
    this.groups.push({id, group, positions});
    this.layer.add(group);
  }

  getGroupIdByPointer(x: number, y: number) {
    const {top, left} = this.getRootPosition();
    x = x - left;
    y = y - top;

    const target = this.groups.find((i) => {
      return i.positions.some((j) => {
        return (
          x >= j.x && x <= j.x + j.width && y >= j.y && y <= j.y + j.height
        );
      });
    });

    if (target) {
      return target.group.id();
    } else {
      return null;
    }
  }

  getAllGroupIdByPointer(x: number, y: number) {
    const {top, left} = this.getRootPosition();

    x = x - left;
    y = y - top;

    return this.groups
      .filter((i) => {
        return i.positions.some((j) => {
          return (
            x >= j.x && x <= j.x + j.width && y >= j.y && y <= j.y + j.height
          );
        });
      })
      .map((i) => i.group.id());
  }

  deleteMark(id: string) {
    const index = this.groups.findIndex((i) => i.id === id);

    if (index === -1) return false;

    this.groups.splice(index, 1);

    const group = this.layer.find("#" + id)[0];

    group && group.destroy();
  }

  getMarkPositions(id: string) {
    const group = this.groups.find((i) => i.id === id);
    return group ? group.positions : null;
  }

  clear() {
    this.layer.destroyChildren();
    this.groups = [];
  }

  updateStageSize() {
    const {width, height} = this.getRootPosition();
    this.stage.setSize({width, height});
  }

  private createGroup(id: string, config: TextMarkConfig) {
    const group = new Konva.Group({id, x: 0, y: 0});
    const rectGroup = new Konva.Group({
      id: RECT_PREFIX + id,
      x: 0,
      y: 0,
      visible: true,
    });
    const lineGroup = new Konva.Group({
      id: LINE_PREFIX + id,
      x: 0,
      y: 0,
      visible: true,
    });
    const shapeConstructors = this.config?.shapeConstructors;
    let shapeGroup: Konva.Group | null = null;
    if (shapeConstructors && shapeConstructors.length > 0) {
      shapeGroup = new Konva.Group({
        id: SHAPE_PREFIX + id,
        x: 0,
        y: 0,
      });
      group.add(shapeGroup);
    }
    group.add(rectGroup);
    group.add(lineGroup);
    return {group, rectGroup, lineGroup, shapeGroup};
  }

  private createRect(position: RectPosition, config: TextMarkConfig) {
    return new Konva.Rect({
      ...position,
      fill: config.rectFill,
      ...config.konvaConfig,
    });
  }

  private createLine(position: RectPosition, config: TextMarkConfig) {
    const {x, y, width, height} = position;
    return new Konva.Line({
      points: [x, y + height, x + width, y + height],
      stroke: config.lineStroke,
      strokeWidth: config.strokeWidth,
      ...config.konvaConfig,
    });
  }

  private getRootPosition() {
    return this.root.getBoundingClientRect();
  }
}
