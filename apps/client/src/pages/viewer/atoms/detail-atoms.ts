import { atom } from 'jotai';
import { atomWithQuery } from 'jotai-tanstack-query';
import { dal } from '@/dal';
import { BookResItem } from '@/interface/book';

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
      return dal.getBookByUuid(uuid);
    },
  };
});
