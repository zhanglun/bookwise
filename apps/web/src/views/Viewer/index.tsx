import { useParams } from "react-router-dom";
import { EpubViewer } from "@/views/Viewer/Epub";
import { useState } from "react";
import { Switch } from "@radix-ui/themes";

export const Viewer = () => {
  const { uuid } = useParams();
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
    <div className="text-foreground bg-app w-full h-full">
      <Switch
        onCheckedChange={toggleDarkMode}
        className="fixed right-1 top-1 z-10"
      />

      {uuid && <EpubViewer bookId={uuid} />}
    </div>
  );
};
