import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <div className="grid h-full w-[320px] gap-3">
      <div className=" bg-panel rounded-md">
        <NavLink to={"/"}>Home</NavLink>
        <NavLink to={"/search"}>Search</NavLink>
      </div>
      <div className=" bg-panel rounded-md">
        <div>Library</div>
      </div>
    </div>
  );
};
