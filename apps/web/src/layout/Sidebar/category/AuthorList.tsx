import { RouteConfig } from "@/config";
import { request } from "@/helpers/request";
import { AuthorResItem } from "@/interface/book";
import { Avatar, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import {
  createSearchParams,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { CategoryEnum } from ".";
import clsx from "clsx";

export interface AuthorItemProps extends React.ComponentPropsWithoutRef<"div"> {
  author: AuthorResItem;
}

export const AuthorItem = ({ author, className }: AuthorItemProps) => {
  const { name } = author;
  const navigate = useNavigate();

  function navigateToFilterPage() {
    // navigate(RouteConfig.FILTER, {
    //   state: {
    //     category: CategoryEnum.Author,
    //     author: author,
    //   },
    // });
    navigate(
      `${RouteConfig.FILTER}?${createSearchParams({
        category: CategoryEnum.Author,
        author_id: author.id,
      })}`
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-2 p-1 text-sm cursor-pointer",
        className
      )}
      onClick={navigateToFilterPage}
    >
      <Avatar size="2" fallback={name.slice(0, 1).toUpperCase()}></Avatar>
      <Text truncate={true}>{name}</Text>
    </div>
  );
};

export const AuthorList = () => {
  const [authors, setAuthors] = useState<AuthorResItem[]>([]);
  const [currentAuthor, setCurrentAuthor] = useState<number>();
  const { state } = useLocation();
  const [searchParams] = useSearchParams();

  console.log("%c Line:13 🍻 state", "color:#fca650", state);

  useEffect(() => {
    request.get("/authors").then(({ data }) => {
      setAuthors(data);
    });
  }, []);

  useEffect(() => {
    if (searchParams.get("author_id")) {
      setCurrentAuthor(parseInt(searchParams.get("author.id") as string, 10));
    }
  }, [searchParams]);

  return (
    <div className="px-2 pt-3 flex flex-col gap-2">
      {authors.map((item) => {
        return (
          <AuthorItem
            author={item}
            className={clsx({
              "bg-accent-6": currentAuthor === item.id,
            })}
          />
        );
      })}
    </div>
  );
};
