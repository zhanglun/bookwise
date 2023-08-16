import {create} from "zustand";
import {subscribeWithSelector} from "zustand/middleware";
import {BookResItem} from "./interface/book";

interface BearStore {
  bookStack: BookResItem[];
  addBookToStack: (book: BookResItem) => BookResItem[];
  removeBookFromStack: (book: BookResItem) => [BookResItem | null, BookResItem[]];
  sidebarCollapse: boolean;
  updateSidebarCollapse: (status?: boolean) => boolean;
}

export const useBearStore = create<BearStore>()(
  subscribeWithSelector((set, get) => {
    return {
      bookStack: [],
      addBookToStack: (book: BookResItem) => {
        const books = get().bookStack;

        if (books.some((b) => b.id === book.id)) {
          return books;
        } else {
          set(() => ({
            bookStack: [...books, book],
          }));
        }
      },
      removeBookFromStack: (book: BookResItem) => {
        const books = get().bookStack;
        const idx = books.findIndex((b) => b.id === book.id);

        if (idx >= 0) {
          const droped = {...books[i]};
          const newStack = [...books.slice(0, idx), ...books[idx + 1]];

          set(() => ({
            bookStack: newStack,
          }));

          return [droped, get().bookStack];
        }

        return [null, books];
      },
      sidebarCollapse: false,
      updateSidebarCollapse(status) {
        if (status !== undefined && status !== null) {
          set(() => ({sidebarCollapse: status}));
        } else {
          set(() => ({sidebarCollapse: !get().sidebarCollapse}));
        }

        return get().sidebarCollapse;
      },
    };
  })
);
