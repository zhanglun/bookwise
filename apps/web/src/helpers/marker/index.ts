import debounce from "lodash-es/debounce";
import TextMarker from "./range";
import { Brush } from "./brush";
import { Mark, RectPosition, TextMarkConfig } from "./types";

export class Marker {
  private root: HTMLElement;

  private brush: Brush;
  private textMarker: TextMarker;

  public marks: Mark[];

  constructor(root: HTMLElement) {
    this.root = root;
    this.brush = new Brush(this.root);
    this.textMarker = new TextMarker(this.root);
    this.marks = [];
    this.observeResize();
  }

  getSelectionRange(selection: Selection | null, config: TextMarkConfig) {
    selection = selection || document.getSelection();
    if (!selection) return null;
    return this.textMarker.createRange(selection, config);
  }

  getSelectionPosition(selection?: Selection | null) {
    selection = selection || document.getSelection();
    if (!selection) return null;
    return this.textMarker.getSelectionPosition(selection);
  }

  addMark(mark: Mark): boolean {
    const rects = this.textMarker.createRects(mark);
    console.log("%c Line:34 🍞 rects", "color:#ea7e5c", rects);

    if (rects.length === 0) return false;

    this.marks.push(mark);

    const { id, config } = mark;

    this.brush.renderRange(rects, id, config);

    return true;
  }

  getMark(id: string): Mark | null {
    const range = this.marks.find((i) => i.id === id);
    console.log("%c Line:70 🥖 range", "color:#4fff4B", range);
    return range || null;
  }

  deleteRange(id: string) {
    const index = this.marks.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.marks.splice(index, 1);
    // this.brush.deleteRange(id)
    return true;
  }

  updateMark(range: Mark) {
    this.deleteRange(range.id);
    this.addMark(range);
  }

  getRangePositions(id: string): RectPosition[] | null {
    return this.brush.getRangePositions(id);
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

  getMarkerIdByPointer(x: number, y: number) {
    return this.brush.getGroupIdByPointer(x, y)
  }

  getAllMarkerIdByPointer(x: number, y: number) {
    return this.brush.getAllGroupIdByPointer(x, y)
  }
}
