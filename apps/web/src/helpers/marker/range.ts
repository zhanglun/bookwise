import { Mark } from "./types";
import {
  getStartAndEndRangeText,
  getTextNodeRects,
  getTextNodesByDfs,
  getCharRect,
  uuid,
} from "./utils";
import { MarkTypeEnum, TextMarkConfig } from "./types";

export default class TextMarker {
  private root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
  }

  getSelectionPosition(selection: Selection) {
    if (!this.isValidSelection(selection)) return null;

    const {
      startContainer: start,
      startOffset,
      endContainer: end,
      endOffset,
    } = selection.getRangeAt(0);

    if (!this.isValidTextNode(start) || !this.isValidTextNode(end)) return null;

    return {
      start: getCharRect(start, startOffset),
      end: getCharRect(end, endOffset),
    };
  }

  private isValidSelection(selection: Selection) {
    if (selection.isCollapsed || selection.getRangeAt(0).collapsed)
      return false;
    return true;
  }

  createRange(selection: Selection, config: TextMarkConfig): Mark | null {
    if (!this.isValidSelection(selection)) return null;

    const {
      startContainer: start,
      startOffset,
      endContainer: end,
      endOffset,
    } = selection.getRangeAt(0);

    if (!this.isValidTextNode(start) || !this.isValidTextNode(end)) return null;

    const sPath = this.getPath(start);
    const ePath = start === end ? sPath : this.getPath(end);

    if (!sPath || !ePath) return null;

    const text = getStartAndEndRangeText(start, startOffset, end, endOffset);

    const { rectFill, lineStroke, strokeWidth } = config;

    return {
      id: uuid(8),
      type: MarkTypeEnum.TEXT,
      data: {
        text: selection.toString(),
        start: {
          path: sPath,
          offset: startOffset,
          text: text.start,
        },
        end: {
          path: ePath,
          offset: endOffset,
          text: text.end,
        },
      },
      config: {
        rectFill,
        lineStroke,
        strokeWidth,
      },
    };
  }

  private isValidTextNode(node: Node): node is Text {
    return this.root.contains(node) && node.nodeType === 3;
  }

  private getPath(textNode: Text) {
    const path = [0];
    let parentNode = textNode.parentNode;
    let cur: Node = textNode;

    while (parentNode) {
      if (cur === parentNode.firstChild) {
        if (parentNode === this.root) {
          break;
        } else {
          cur = parentNode;
          parentNode = cur.parentNode;
          path.unshift(0);
        }
      } else {
        cur = cur.previousSibling!;
        path[0]++;
      }
    }

    return parentNode ? path : null;
  }

  createRects(mark: Mark) {
    const rects: DOMRect[] = [];
    const { start, end } = mark.data;
    const startNode = this.getNodeByPath(start.path);
    const endNode = this.getNodeByPath(end.path);

    if (
      !startNode ||
      !endNode ||
      !this.isValidTextNode(startNode) ||
      !this.isValidTextNode(endNode)
    )
      return [];

    if (startNode === endNode) {
      rects.push(...getTextNodeRects(startNode, start.offset, end.offset));
    } else {
      const textNodes = getTextNodesByDfs(startNode, endNode);
      rects.push(...getTextNodeRects(startNode, start.offset));
      textNodes.forEach((i) => {
        const nodeRects = getTextNodeRects(i);
        if (
          nodeRects.length === 1 &&
          (nodeRects[0].width === 0 || nodeRects[0].height === 0)
        ) {
          // 过滤空 Text
        } else {
          rects.push(...nodeRects);
        }
      });
      rects.push(...getTextNodeRects(endNode, 0, end.offset));
    }

    return rects;
  }

  private getNodeByPath(path: number[]) {
    let node: Node = this.root;
    for (let i = 0; i < path.length; i++) {
      if (node && node.childNodes && node.childNodes[path[i]]) {
        node = node.childNodes[path[i]];
      } else {
        return null;
      }
    }
    return node;
  }

  getRangeFromMark(mark: Mark) {
    const startContainer = this.getNodeByPath(mark.data.start.path);
    const endContainer = this.getNodeByPath(mark.data.end.path);

    const range = document.createRange();

    startContainer && range.setStart(startContainer, mark.data.start.offset);
    endContainer && range.setEnd(endContainer,  mark.data.end.offset);

    return range;
  }
}
