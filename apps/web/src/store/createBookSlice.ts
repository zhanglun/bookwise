import { StateCreator } from "zustand";
import { BookCacheItem, BookResItem } from "@/interface/book";
import { NavItem } from "epubjs";
import { dal } from "@/dal";
import { drizzleDB } from "@/db";
import { bookCaches, books } from "@/db/schema";
import { eq } from "drizzle-orm";

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

  bookCaches: BookCacheItem[];
  getBookCachesRefresh: () => Promise<BookCacheItem[]>;
  updateBookCaches: (c: BookCacheItem[]) => void;
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
    bookCaches: [],

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

      dal.getRecentReading({}).then((books) => {
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

      dal.getRecentAdding({}).then((books) => {
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

    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Updates the book cache. This is called when the user opens or closes a book.
     * @param bookCaches The new book cache
     */
    /******  f4a13280-54b7-484d-967f-2f6973dd204e  *******/
    updateBookCaches: (bookCaches: BookCacheItem[]) => {
      set(() => ({
        bookCaches,
      }));
    },

    /*************  ✨ Codeium Command ⭐  *************/
    /**
     * Refreshes the book cache list from the database and updates the store.
     * This is called when the user opens the book list.
     * @returns The book cache list
     */
    /******  83d7ab28-a476-409a-a8a8-ec78789c7b40  *******/
    getBookCachesRefresh: async () => {
      const caches = await drizzleDB.select({
        book_id: bookCaches.book_id,
        is_active: bookCaches.is_active,
        book_title: books.title
      }).from(bookCaches).leftJoin(books, eq(bookCaches.book_id, books.id));

      set(() => ({
        bookCaches: caches as BookCacheItem[],
      }))

      return caches as BookCacheItem[]
    }
  };
};
