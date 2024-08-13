import { StateCreator } from "zustand";

export interface ConfigSlice {
  leftSidebarExpanded: boolean;
  updateLeftSidebarExpanded: (status: boolean) => void;
}

export const createConfigSlice: StateCreator<
  ConfigSlice,
  [],
  [],
  ConfigSlice
> = (set, get) => {
  return {
    leftSidebarExpanded: true,
    updateLeftSidebarExpanded(status: boolean) {
      set(() => ({
        leftSidebarExpanded: status,
      }));
    },
  };
};
