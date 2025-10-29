import { useAtomValue } from 'jotai';
import { blobDataAtom, detailDataAtom } from '../atoms/detail-atoms';

export const useDetail = () => {
  const detail = useAtomValue(detailDataAtom);
  const blob = useAtomValue(blobDataAtom);

  return { detail, blob };
};
