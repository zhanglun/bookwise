import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { BookResItem } from "./interface/book";

interface BearStore {
  openedBook: BookResItem[];
}

export const useBearStore = create<BearStore>()(
  subscribeWithSelector((set, get) => {
    return {
      openedBook: [], 
    };
  }),
);
