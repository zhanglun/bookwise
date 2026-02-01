import { atom } from 'jotai';

// 阅读器界面状态
export const leftPanelOpenAtom = atom(true);
export const rightPanelOpenAtom = atom(true);
export const toolbarVisibleAtom = atom(true);
export const currentThemeAtom = atom<'light' | 'dark'>('light');

// 字体大小
export const fontSizeAtom = atom(18);

// 行高
export const lineHeightAtom = atom(1.8);

// 批注相关
export interface Annotation {
  id: string;
  text: string;
  type: 'highlight' | 'underline' | 'note';
  note?: string;
  color: string;
  sectionIndex: number;
  rangeStart?: string;
  rangeEnd?: string;
  createdAt: Date;
}

export const annotationsAtom = atom<Annotation[]>([]);
export const selectedTextAtom = atom<string>('');
export const floatingToolbarPositionAtom = atom<{ x: number; y: number; visible: boolean }>({
  x: 0,
  y: 0,
  visible: false,
});
export const activeAnnotationIdAtom = atom<string | null>(null);
