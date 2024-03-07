import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export interface Setting {
  libPath: string;
}

interface BearStore {
  interactiveObject: any[];
  updateInteractiveObject: (t: any[]) => void;

  settings: Setting;
  updateSetting: (cfg: Setting) => void;
}

export const useBearStore = create<BearStore>()(
  subscribeWithSelector((set, get) => {
    return {
      interactiveObject: [],
      updateInteractiveObject(obj) {
        set(() => ({ interactiveObject: obj }));
      },

      settings: {
        libPath: '',
      },
      updateSetting(cfg) {

      }
    };
  })
);
