import { request } from "@/helpers/request";
import { AuthorResItem } from "@/interface/book";
import { Avatar, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";

export const AuthorItem = ({ author }: { author: AuthorResItem }) => {
  const { name } = author;

  return (
    <div className="flex items-center gap-2 text-sm cursor-pointer">
      <Avatar size="2" fallback={name.slice(0, 1).toUpperCase()}></Avatar>
      <Text truncate={true}>{name}</Text>
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
    <div className="pl-3 pt-3 flex flex-col gap-2 bg-slate-300">
      {authors.map((item) => {
        return <AuthorItem author={item} />;
      })}
    </div>
  );
};
