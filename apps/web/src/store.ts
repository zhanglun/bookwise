import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

interface BearStore {
  interactiveObject: any[];
  updateInteractiveObject: (t: any[]) => void;
}

export const useBearStore = create<BearStore>()(
  subscribeWithSelector((set, get) => {
    return {
      interactiveObject: [],
      updateInteractiveObject(obj) {
        set(() => ({ interactiveObject: obj }));
      },
    };
  })
);
