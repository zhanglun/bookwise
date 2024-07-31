import { StateCreator } from "zustand";
import { BookResItem } from "@/interface/book";
import { request } from "@/helpers/request";

function findIndex(book: BookResItem, list: BookResItem[]): number {
  return list.findIndex((item) => item.id === book.id);
}

export interface BookSlice {
  books: BookResItem[];
  recentlyAddList: BookResItem[];
  loadingRecentlyAdd: boolean;
  recentlyReadingList: BookResItem[];
  loadingRecentlyReading: boolean;

  addBooks: (books: BookResItem[]) => void;
  updateRecentlyReadingList: (book: BookResItem) => void;

  initBookSliceData: () => void;

  currentEditingBook: BookResItem | null;
  setCurrentEditingBook: (book: BookResItem) => void;
  isEditing: boolean;
  updateIsEditing: (status: boolean) => void;
}

export const createBookSlice: StateCreator<BookSlice, [], [], BookSlice> = (
  set,
  get
) => {
  return {
    books: [],
    loadingRecentlyAdd: true,
    recentlyAddList: [],
    loadingRecentlyReading: true,
    recentlyReadingList: [],

    addBooks: (books: BookResItem[]) => {
      set((state) => {
        return {
          books: [...books, ...state.books],
          recentlyAddList: [...books, ...state.recentlyAddList],
        };
      });
    },

    updateRecentlyReadingList: (book: BookResItem) => {
      const list = get().recentlyReadingList;
      const idx = findIndex(book, list);

      if (idx <= 0) {
        set(() => ({ recentlyReadingList: [book, ...list] }));
      } else {
        set(() => ({ recentlyReadingList: [book, ...list.splice(idx, 1)] }));
      }
    },

    initBookSliceData() {
      set(() => ({
        loadingRecentlyReading: true,
        recentlyReadingList: [],
        loadingRecentlyAdd: true,
        recentlyAddList: [],
      }));

      request
        .get("/books/recently-add", {
          params: {
            sort: "created_at:desc",
          },
        })
        .then((res) => {
          const items = res.data;

          set(() => ({ recentlyAddList: items, loadingRecentlyAdd: false }));
        });
      request
        .get("/books/recently-reading", {
          data: {
            sort: "created_at:desc",
          },
        })
        .then((res) => {
          const items = res.data;

          set(() => ({
            recentlyReadingList: items,
            loadingRecentlyReading: false,
          }));
        });
    },

    currentEditingBook: null,
    setCurrentEditingBook: (book: BookResItem | null) => {
      set(() => ({
        currentEditingBook: book
      }));
    },
    isEditing: false,
    updateIsEditing: (status: boolean) => {
      set(() => ({
        isEditing: status,
      }));
    },
  };
};
