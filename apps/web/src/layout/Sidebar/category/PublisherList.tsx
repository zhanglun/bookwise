import { RouteConfig } from "@/config";
import { request } from "@/helpers/request";
import { PublisherResItem } from "@/interface/book";
import { Avatar, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { CategoryEnum } from ".";
import clsx from "clsx";

export interface PublisherItemProps extends React.ComponentPropsWithoutRef<"div"> {
  publisher: PublisherResItem;
}

export const PublisherItem = ({ publisher, className }: PublisherItemProps) => {
  const { name, _count } = publisher;
  const navigate = useNavigate();

  function navigateToFilterPage() {
        console.log("%c Line:28 🍬 publisher", "color:#7f2b82", publisher);
    navigate(
      `${RouteConfig.FILTER}?${createSearchParams({
        category: CategoryEnum.Publisher,
        publisher_id: publisher.id + "",
      })}`
    );
  }

  return (
    <div
      className={clsx(
        "flex items-center gap-2 p-2 rounded-md text-sm cursor-pointer",
        className
      )}
      onClick={navigateToFilterPage}
    >
      <Avatar size="2" fallback={name.slice(0, 1).toUpperCase()}></Avatar>
      <Text truncate={true} className="flex-1">{name}</Text>
      <span>{_count.books}</span>
    </div>
  );
};

export const PublisherList = () => {
  const [publishers, setPublishers] = useState<PublisherResItem[]>([]);
  const [currentPublisher, setCurrentPublisher] = useState<number>();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    request.get("/publishers").then(({ data }) => {
      const { items } = data;

      setPublishers(items);
    });
  }, []);

  useEffect(() => {
    if (searchParams.get("publisher_id")) {
      setCurrentPublisher(parseInt(searchParams.get("publisher_id") as string, 10));
    }
  }, [searchParams]);

  return (
    <div className="px-2 pt-3 flex flex-col">
      {publishers.map((item) => {
        return (
          <PublisherItem
            publisher={item}
            className={clsx({
              "bg-accent-6": currentPublisher == item.id,
            })}
          />
        );
      })}
    </div>
  );
};
