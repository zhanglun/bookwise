import { useBearStore } from "@/store";
import { MetaForm } from "@/views/Editor/form";
import { useEffect, useState } from "react";
import { BookResItem } from "@/interface/book";
import { request } from "@/helpers/request";
import { useParams } from "react-router-dom";

export const Editor = () => {
  const store = useBearStore((state) => ({
    isEditing: state.isEditing,
    currentEditingBook: state.currentEditingBook,
  }));

  const { id } = useParams();

  const [detail, setBookDetail] = useState<BookResItem>({});

  useEffect(() => {
    request.get(`books/${id}`).then(({ data }) => {
      console.log(data);
      setBookDetail(data);
    });
  }, [id]);

  return (
    <div className="bg-cell h-full px-4 sm:px-4">
      <MetaForm defaultData={detail} />
    </div>
  );
};
