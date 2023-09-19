import { NavLink } from "react-router-dom";
import clsx from "clsx";

export interface NavItemProps {
  title: string | React.ReactNode;
  icon: React.ReactNode,
  to: string;
}

export const NavItem = (props: NavItemProps) => {
  const { title, icon, to } = props;

  return (
    <NavLink
      className={
        ({
           isActive,
           isPending,
         }: {
          isActive: boolean;
          isPending: boolean;
        }) => {
          return clsx("side-menu-item", isActive ? "side-menu-item--active" : isPending ? "pending" : "");
        }
      }
      to={ to }
    >
      <div className="text-stone-600">
        { icon }
      </div>
    </NavLink>
  );
};
