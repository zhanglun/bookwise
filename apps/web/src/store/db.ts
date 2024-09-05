import Dexie, { type EntityTable } from 'dexie';

interface BookCached {
  id: number;
  book_id: number;
  title: string;
  isActive: number;
}

const db = new Dexie('BookWiseDatabase') as Dexie & {
  bookCached: EntityTable<
    BookCached,
    'id' // primary key "id" (for the typings only)
  >;
};

// Schema declaration:
db.version(1).stores({
  bookCached: '++id, &book_id, title, isActive' // 添加 isActive 到 schema
});

export type { BookCached };
export { db };
