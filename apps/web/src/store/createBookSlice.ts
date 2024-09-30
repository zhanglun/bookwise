import { StateCreator } from "zustand";
import { BookResItem } from "@/interface/book";
import { request } from "@/helpers/request";
import { NavItem } from "epubjs";
import { dal } from "@/dal";

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

  getRecentReadingList: () => void;
  initBookSliceData: () => void;

  currentEditingBook: BookResItem | null;
  setCurrentEditingBook: (book: BookResItem) => void;
  isEditing: boolean;
  updateIsEditing: (status: boolean) => void;

  handleTocClick: (item: NavItem) => void;
  currentTocItem: NavItem | null;
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

    getRecentReadingList() {
      set(() => ({
        loadingRecentlyReading: true,
      }));

      dal.getBooks().then((books) => {
        console.log(
          "🚀 ~ file: createBookSlice.ts:106 ~ dal.getAllBooks ~ books:",
          books
        );
        set(() => ({
          recentlyReadingList: books,
          loadingRecentlyReading: false,
        }));
      });
    },

    initBookSliceData() {
      set(() => ({
        loadingRecentlyReading: true,
        recentlyReadingList: [],
        loadingRecentlyAdd: true,
        recentlyAddList: [],
      }));

      dal.getBooks().then((books) => {
        console.log(
          "🚀 ~ file: createBookSlice.ts:106 ~ dal.getAllBooks ~ books:",
          books
        );
        set(() => ({ recentlyAddList: books, loadingRecentlyAdd: false }));
      });

      get().getRecentReadingList();
    },

    currentEditingBook: null,
    setCurrentEditingBook: (book: BookResItem | null) => {
      set(() => ({
        currentEditingBook: book,
      }));
    },
    isEditing: false,
    updateIsEditing: (status: boolean) => {
      set(() => ({
        isEditing: status,
      }));
    },

    currentTocItem: null,
    handleTocClick(item: NavItem) {
      console.log("item", item);
      set(() => ({
        currentTocItem: item,
      }));
    },
  };
};
