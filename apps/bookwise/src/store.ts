import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { BookResItem } from "./interface/book";

interface BearStore {
  openedBook: BookResItem[];
  sidebarCollapse: boolean;
  updateSidebarCollapse: (status?: boolean) => boolean;
}

export const useBearStore = create<BearStore>()(
  subscribeWithSelector((set, get) => {
    return {
      openedBook: [], 
      sidebarCollapse: false,
      updateSidebarCollapse(status) {
        if (status !== undefined && status !== null) {
          set(() => ({ sidebarCollapse: status})) 
        } else {
          set(() => ({ sidebarCollapse: !get().sidebarCollapse})) 
        }

        return get().sidebarCollapse;
      },
    };
  }),
);
