import { request } from "@/helpers/request";
import { Heading, Text } from "@radix-ui/themes";
import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

export const Filter = () => {
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), []);

  function getFilterList(params: any) {
    request
      .get("/books", {
        params,
      })
      .then((res) => {
        console.log("%c Line:15 🍷 res", "color:#4fff4B", res);
      });
  }

  useEffect(() => {
    // const category = query.get("category") || undefined;
    const author_id = query.get("author_id") || undefined;
    console.log("%c Line:10 🍻 location", "color:#42b983", query);

    getFilterList({
      filter: [`author_id:eq:${author_id}`],
    });
  }, [query]);

  return (
    <div>
      <Heading size="5">Filter</Heading>
      <Text>{query}</Text>
    </div>
  );
};
