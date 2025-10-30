import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import { dal } from '@/dal';
import { BookResItem } from '@/interface/book';
import { TocItem } from '../../../components/toc-bubble/toc';

// 存储当前详情的 UUID
export const currentDetailUuidAtom = atom<string | null>(null);

export const detailDataAtom = atomWithQuery((get) => {
  const uuid = get(currentDetailUuidAtom);

  if (!uuid) {
    return { queryKey: ['detail', 'no-uuid'], queryFn: () => null };
  }

  return {
    queryKey: ['detail', uuid],
    queryFn: async (): Promise<BookResItem> => {
      const res = await dal.getBookByUuid(uuid);
      return res;
    },
  };
});

export const blobDataAtom = atomWithQuery((get) => {
  const uuid = get(currentDetailUuidAtom);

  if (!uuid) {
    return { queryKey: ['blob', 'no-uuid'], queryFn: () => null };
  }

  return {
    queryKey: ['blob', uuid],
    queryFn: async (): Promise<{ uuid: string; data: Uint8Array | null }> => {
      return dal.getBookBlob(uuid);
    },
  };
});

export const tocItemsAtom = atom<TocItem[]>([]);
