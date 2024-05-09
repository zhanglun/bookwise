import { request } from "@/helpers/request";
import { Heading, Text } from "@radix-ui/themes";
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const Filter = () => {
  const [searchParams] = useSearchParams();

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
    const author_id = searchParams.get("author_id") || undefined;
    console.log("%c Line:10 🍻 location", "color:#42b983", searchParams);

    getFilterList({
      filter: [`author_id:eq:${author_id}`],
    });
  }, [searchParams]);

  return (
    <div>
      <Heading size="5">Filter</Heading>
      <Text>{searchParams}</Text>
    </div>
  );
};
