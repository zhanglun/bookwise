import { useEffect, useState } from 'react';
import { dal } from '@/dal';
import { InfoPanel } from './InfoPanel';
import { LibraryToolbar } from './LibraryToolbar';
import classes from './library.module.css';

export const Library = () => {
  const [selectItem, setSelectItem] = useState([]);
  const getList = async () => {
    const list = await dal.getBooks({});
    console.log('🚀 ~ getList ~ list:', list);
  };

  useEffect(() => {
    const get = async () => {
      await getList();
    };
    get();
  }, []);
  return (
    <div className={classes.main}>
      <div className={classes.leftSide}>f</div>
      <div className={classes.content}>
        <LibraryToolbar />
        <div className="flex-1 overflow-auto min-h-0">asdfasdf</div>
      </div>
      <div className={classes.rightSide}>
        <InfoPanel data={selectItem} />
      </div>
    </div>
  );
};
