import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { BookResItem } from "./interface/book";

interface BearStore {
  bookStack: BookResItem[];
  addBookToStack: (book: BookResItem) => BookResItem[];
  removeBookFromStack: (book: BookResItem) => ([BookResItem, BookResItem[]]);
  sidebarCollapse: boolean;
  updateSidebarCollapse: (status?: boolean) => boolean;
}

export const useBearStore = create<BearStore>()(
  subscribeWithSelector((set, get) => {
    return {
      bookStack: [],
      addBookToStack: (book: BookResItem) => {
        const books = get().bookStack;

        if (books.some(b => b.id === book.id)) {
          return books
        } else {
          set(() => ({
            bookStack: [...books, book]
          }))
        }
      },
        addBookToStack: (book: BookResItem) => {
            const books = get().bookStack;

            if (books.some(b => b.id === book.id)) {
                return books
            } else {
                set(() => ({
                    bookStack: [...books, book]
                }))
            }
        },
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
