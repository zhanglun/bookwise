import { useAtomValue } from 'jotai';
import { detailDataAtom } from '../atoms/detail-atoms';

export const useDetail = () => {
  const result = useAtomValue(detailDataAtom);

  return result;
};
