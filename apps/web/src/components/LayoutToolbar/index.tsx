import { Button, IconButton } from "@radix-ui/themes";
import { ListFilterIcon } from "lucide-react";

export const LayoutToolbar = () => {
  return (
    <div className="my-3">
      <div>
        <Button variant="ghost">
          <ListFilterIcon size={16} />
          Filter
        </Button>
      </div>
    </div>
  );
};
