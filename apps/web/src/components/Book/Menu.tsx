import { ContextMenu, DropdownMenu } from "@radix-ui/themes";
import { useBearStore } from "@/store";
import { BookResItem } from "@/interface/book";
import { useNavigate } from "react-router-dom";
import { RouteConfig } from "@/config";

export interface BookContextMenuProps {
  children: React.ReactNode;
  book: BookResItem;
  variant?: "context" | "dropdown";
}

export const BookContextMenu = ({
  book,
  children,
  variant,
}: BookContextMenuProps) => {
  const navigate = useNavigate();
  const store = useBearStore((state) => ({
    currentEditingBook: state.currentEditingBook,
    setCurrentEditingBook: state.setCurrentEditingBook,
    updateIsEditing: state.updateIsEditing,
  }));

  function editBook() {
    store.setCurrentEditingBook(book);
    store.updateIsEditing(true);
    navigate(RouteConfig.EDITOR.replace(":id", book.uuid + ""));
  }

  return variant === "context" ? (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div>{children}</div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item shortcut="⌘ E" onClick={editBook}>
          Edit2
        </ContextMenu.Item>
        <ContextMenu.Item shortcut="⌘ D">Duplicate</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘ N">Archive</ContextMenu.Item>

        <ContextMenu.Sub>
          <ContextMenu.SubTrigger>More</ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item>Move to project…</ContextMenu.Item>
            <ContextMenu.Item>Move to folder…</ContextMenu.Item>
            <ContextMenu.Separator />
            <ContextMenu.Item>Advanced options…</ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>

        <ContextMenu.Separator />
        <ContextMenu.Item>Share</ContextMenu.Item>
        <ContextMenu.Item>Add to favorites</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item shortcut="⌘ ⌫" color="red">
          Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  ) : (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <div>{children}</div>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item shortcut="⌘ E" onClick={editBook}>
          Edit
        </DropdownMenu.Item>
        <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
            <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>

        <DropdownMenu.Separator />
        <DropdownMenu.Item>Share</DropdownMenu.Item>
        <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘ ⌫" color="red">
          Delete
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
