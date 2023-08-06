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
      className={clsx(
        "side-menu-item",
        ({
          isActive,
          isPending,
        }: {
          isActive: boolean;
          isPending: boolean;
        }) => {
          return isActive ? "active" : isPending ? "pending" : "";
        }
      )}
      to={to}
    >
      <span className="text-stone-600" >
        {icon}
      </span>
      <span>{title}</span>
    </NavLink>
  );
};
