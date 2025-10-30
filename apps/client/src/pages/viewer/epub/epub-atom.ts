import { atom } from 'jotai';
import { TocItem } from '../../../components/toc-bubble/toc';

export const currentTocItemAtom = atom<TocItem | null>(null);
export const currentSectionAtom = atom(null);
export const currentSectionIndexAtom = atom(0);
