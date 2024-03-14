import debounce from "lodash-es/debounce";
import TextMarker from "./range";
import { Brush } from "./brush";
import { ExtraInfo, Mark, RectPosition, TextMarkConfig } from "./types";

export class Marker {
  private root: HTMLElement;

  public brush: Brush;
  public textMarker: TextMarker;

  public marks: Mark[];

  constructor(root: HTMLElement) {
    this.root = root;
    this.brush = new Brush(this.root);
    this.textMarker = new TextMarker(this.root);
    this.marks = [];
    this.observeResize();
  }

  getSelectionRange(selection: Selection | null, config: TextMarkConfig, extraInfo: ExtraInfo) {
    selection = selection || document.getSelection();
    console.log("%c Line:24 🍏 selection", "color:#b03734", selection);
    if (!selection) return null;
    return this.textMarker.createRange(selection, config, extraInfo);
  }

  getSelectionPosition(selection?: Selection | null) {
    selection = selection || document.getSelection();
    if (!selection) return null;
    return this.textMarker.getSelectionPosition(selection);
  }

  addMark(mark: Mark): boolean {
    const rects = this.textMarker.createRects(mark);

    if (rects.length === 0) return false;

    this.marks.push(mark);

    const { id, style_config } = mark;

    this.brush.renderRange(rects, id, style_config);

    return true;
  }

  getMark(id: string): Mark | null {
    const mark = this.marks.find((i) => i.id === id);
    console.log("%c Line:70 🥖 range", "color:#4fff4B", mark);
    return mark || null;
  }

  deleteMark(id: string) {
    const index = this.marks.findIndex((i) => i.id === id);

    if (index === -1) return false;

    this.marks.splice(index, 1);
    this.brush.deleteMark(id)

    return true;
  }

  updateMark(mark: Mark) {
    this.deleteMark(mark.id);
    this.addMark(mark);
  }

  getMarkPositions(id: string): RectPosition[] | null {
    return this.brush.getMarkPositions(id);
  }

  getRangeFromMark(mark: Mark | null) {
    if (!mark) {
      return null;
    }

    return this.textMarker.getRangeFromMark(mark);
  }

  getAllRange(): Mark[] {
    return [...this.marks];
  }

  renderRanges(ranges: Mark[]) {
    this.clear();
    ranges.forEach((i) => this.addMark(i));
  }

  clear(): void {
    this.marks = [];
    this.brush.clear();
  }

  observeResize() {
    const observer = new ResizeObserver(
      debounce(this.handleResize.bind(this), 16)
    );
    observer.observe(this.root);
  }

  private handleResize() {
    this.brush.updateStageSize();
    this.renderRanges(this.marks);
  }

  getMarkIdByPointer(x: number, y: number) {
    return this.brush.getGroupIdByPointer(x, y)
  }

  getAllMarkIdByPointer(x: number, y: number) {
    return this.brush.getAllGroupIdByPointer(x, y)
  }
}
