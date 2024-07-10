import { RouteConfig } from "@/config";
import { request } from "@/helpers/request";
import { LanguageResItem } from "@/interface/book";
import { Avatar, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import {
  createSearchParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { CategoryEnum } from ".";
import clsx from "clsx";

export interface LanguageItemProps
  extends React.ComponentPropsWithoutRef<"div"> {
  language: LanguageResItem;
}

export const LanguageItem = ({ language, className }: LanguageItemProps) => {
  const { code, _count } = language;
  const navigate = useNavigate();

  function navigateToFilterPage() {
    console.log("%c Line:28 🍬 language", "color:#7f2b82", language);
    navigate(
      `${RouteConfig.FILTER}?${createSearchParams({
        category: CategoryEnum.Language,
        language_id: language.id + "",
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
      <Avatar size="2" fallback={code.slice(0, 1).toUpperCase()}></Avatar>
      <Text truncate={true} className="flex-1">
        {code}
      </Text>
      <span>{_count.books}</span>
    </div>
  );
};

export const LanguageList = () => {
  const [languages, setLanguages] = useState<LanguageResItem[]>([]);
  const [currentLanguage, setCurrentLanguage] = useState<number>();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    request.get("/langs").then(({ data }) => {
      setLanguages(data);
    });
  }, []);

  useEffect(() => {
    if (searchParams.get("language_id")) {
      setCurrentLanguage(
        parseInt(searchParams.get("language_id") as string, 10)
      );
    }
  }, [searchParams]);

  return (
    <div className="px-2 pt-3 flex flex-col">
      {languages.map((item) => {
        return (
          <LanguageItem
            language={item}
            className={clsx({
              "bg-accent-6": currentLanguage == item.id,
            })}
          />
        );
      })}
    </div>
  );
};
