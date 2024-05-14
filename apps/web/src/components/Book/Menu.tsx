import { ContextMenu } from "@radix-ui/themes";
import { useBearStore } from "@/store";
import { BookResItem } from "@/interface/book";
import { useNavigate } from "react-router-dom";
import { RouteConfig } from "@/config";

export interface BookContextMenuProps {
  children: React.ReactNode;
  book: BookResItem;
}

export const BookContextMenu = ({ book, children }: BookContextMenuProps) => {
  const navigate = useNavigate();
  const store = useBearStore((state) => ({
    currentEditingBook: state.currentEditingBook,
    setCurrentEditingBook: state.setCurrentEditingBook,
    updateIsEditing: state.updateIsEditing,
  }));

  function editBook() {
    store.setCurrentEditingBook(book);
    store.updateIsEditing(true);
    navigate(RouteConfig.EDITOR.replace(":id", book.id + ""))
  }

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger>
        <div>{children}</div>
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item shortcut="⌘ E" onClick={editBook}>
          Edit
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
  );
};
