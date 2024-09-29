import { useState } from "react";
import { Switch } from "@radix-ui/themes";
import { NavLink } from "react-router-dom";

export const ModeSwitch = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);

    if (darkMode) {
      document.body.classList.remove("dark-theme");
    } else {
      document.body.classList.add("dark-theme");
    }
  };

  return (
    <div className="fixed right-1 top-1 z-50">
      <NavLink to={"/repl"}>repl</NavLink>
      <Switch onCheckedChange={toggleDarkMode} />
    </div>
  );
};
