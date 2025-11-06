import { atom } from 'jotai';

// 当前章节索引
export const currentIndexAtom = atom(0);

// 当前 TOC 项的 href
export const currentTocHrefAtom = atom<string | null>(null);

// 当前 TOC 项的完整信息
export const currentTocItemAtom = atom<any | null>(null);

// 导航目标 atom (用于触发跳转)
export const navigationTargetAtom = atom<string | number | null>(null);

// 导航函数 atom (存储 renderer 的 goTo 方法)
export const navigationFunctionAtom = atom<((target: string | number) => Promise<void>) | null>(null);

// 派生 atom:执行导航
export const navigateAtom = atom(
  null,
  async (get, set, target: string | number) => {
    const goToFn = get(navigationFunctionAtom);

    if (goToFn) {
      await goToFn(target);
      set(navigationTargetAtom, target);
    }
  }
);
