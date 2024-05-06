import { request } from "@/helpers/request";
import { AuthorResItem } from "@/interface/book";
import { Avatar } from "@radix-ui/themes";
import { useEffect, useState } from "react";

export const AuthorItem = ({ author }: { author: AuthorResItem }) => {
  const { name } = author;

  return (
    <div className="flex items-center gap-2 text-sm">
      <Avatar size="2" fallback={name.slice(0, 1).toUpperCase()}></Avatar>
      <span>{name}</span>
    </div>
  );
};

export const AuthorList = () => {
  const [authors, setAuthors] = useState<AuthorResItem[]>([]);

  useEffect(() => {
    request.get("/authors").then(({ data }) => {
      setAuthors(data);
    });
  }, []);

  return (
    <div>
      {authors.map((item) => {
        return <AuthorItem author={item} />;
      })}
    </div>
  );
};
