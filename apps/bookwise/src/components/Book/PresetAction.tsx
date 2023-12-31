import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
} from "../ui/dialog";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import { MoreVertical } from "lucide-react";
import { BookResItem } from "@/interface/book";
import { request } from "@/helpers/request";
import { useNavigate } from "react-router-dom";
import { useBearStore } from "@/store";
import { MetaForm } from "../MetaForm";

export interface PresetActionProps {
  data: BookResItem;
  children?: React.ReactNode;
}

export function PresetActions(props: PresetActionProps) {
  const store = useBearStore((state) => ({
    bookStack: state.bookStack,
    addBookToStack: state.addBookToStack,
  }));
  const navigate = useNavigate();
  const { data } = props;
  const [open, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const startRead = () => {
    navigate(`/reader/${data.id}`);
  };

  const confirmDelete = () => {
    request
      .delete("/books", {
        params: {
          id: data.id,
        },
      })
      .then((res) => {
        console.log(
          "🚀 ~ file: PresetAction.tsx:48 ~ confirmDelete ~ res:",
          res
        );
      });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="cursor-pointer">
          <MoreVertical size={16} className="hover:text-stone-900 transition-all" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => startRead()}>
            Read it
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsOpen(true)}>
            Edit metadata
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-red-600"
          >
            Delete it
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent className="w-[50%] max-h-[90%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Metadata - {data.title}
            </DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="flex items-start justify-between space-x-4 pt-3">
              <div>
                <MetaForm defaultData={data}/>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This preset will no longer be
              accessible by you or others you&apos;ve shared it with.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteDialog(false);
                confirmDelete();
                toast({
                  description: "This preset has been deleted.",
                });
              }}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
