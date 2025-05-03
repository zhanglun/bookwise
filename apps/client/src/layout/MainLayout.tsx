import { Outlet } from 'react-router-dom';
import { TopBar } from './Topbar';
import classes from './layout.module.css';

export const MainLayout = () => {
  return (
    <div className={classes.mainLayout}>
      <div className={classes.layoutSidebar}>
        <TopBar />
      </div>
      <div className={classes.layoutView}>
        <Outlet />
      </div>
    </div>
  );
};
