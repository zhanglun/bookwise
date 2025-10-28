import { atom } from 'jotai';
import { ViewerMode, ViewerModeType } from './types';

export const viewerModeAtom = atom<ViewerModeType>(ViewerMode.VIEW);
