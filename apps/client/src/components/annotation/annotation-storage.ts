import { Annotation } from './types';

export interface AnnotationStorage {
  save(bookId: string, annotations: Annotation[]): Promise<void>;
  load(bookId: string): Promise<Annotation[]>;
  delete(bookId: string, annotationId: string): Promise<void>;
  export(bookId: string, format: 'json' | 'calibre'): Promise<string>;
}

export class LocalStorageAnnotationStorage implements AnnotationStorage {
  private readonly prefix = 'foliate-annotations-';

  async save(bookId: string, annotations: Annotation[]): Promise<void> {
    const key = this.prefix + bookId;
    const data = JSON.stringify(annotations);
    localStorage.setItem(key, data);
  }

  async load(bookId: string): Promise<Annotation[]> {
    const key = this.prefix + bookId;
    const data = localStorage.getItem(key);
    if (!data) return [];

    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse annotations:', e);
      return [];
    }
  }

  async delete(bookId: string, annotationId: string): Promise<void> {
    const annotations = await this.load(bookId);
    const filtered = annotations.filter((a) => a.id !== annotationId);
    await this.save(bookId, filtered);
  }

  async export(bookId: string, format: 'json' | 'calibre'): Promise<string> {
    const annotations = await this.load(bookId);

    if (format === 'json') {
      return JSON.stringify(annotations, null, 2);
    }

    // Calibre 格式转换
    // 参考 foliate-js 的 Calibre 书签格式
    const calibreData = {
      annotations: annotations.map((a) => ({
        highlighted_text: a.content?.text || '',
        notes: a.content?.note || '',
        timestamp: new Date(a.createdAt).toISOString(),
        type: a.type,
        color: a.style.color,
        // EPUB CFI 或 PDF 位置
        location: a.location.epub?.cfi || `page-${a.location.pdf?.pageIndex}`,
      })),
    };

    return JSON.stringify(calibreData, null, 2);
  }
}

export class IndexedDBAnnotationStorage implements AnnotationStorage {
  private dbName = 'foliate-annotations';
  private storeName = 'annotations';
  private db: IDBDatabase | null = null;

  private async getDB(): Promise<IDBDatabase> {
    if (this.db) return this.db;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          const store = db.createObjectStore(this.storeName, { keyPath: 'bookId' });
          store.createIndex('bookId', 'bookId', { unique: false });
        }
      };
    });
  }

  async save(bookId: string, annotations: Annotation[]): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readwrite');
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ bookId, annotations });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async load(bookId: string): Promise<Annotation[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.get(bookId);

      request.onsuccess = () => {
        const result = request.result;
        resolve(result?.annotations || []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async delete(bookId: string, annotationId: string): Promise<void> {
    const annotations = await this.load(bookId);
    const filtered = annotations.filter((a) => a.id !== annotationId);
    await this.save(bookId, filtered);
  }

  async export(bookId: string, format: 'json' | 'calibre'): Promise<string> {
    const storage = new LocalStorageAnnotationStorage();
    return storage.export(bookId, format);
  }
}
