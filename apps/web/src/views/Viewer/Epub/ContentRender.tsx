import { Heading, Text, Link } from "@radix-ui/themes";
import HTMLReactParser, {
  domToReact,
  HTMLReactParserOptions,
  DOMNode,
} from "html-react-parser";
import { useEffect, useState } from "react";

// 自定义转换函数，用于替换标签
const options: HTMLReactParserOptions = {
  replace: (node: DOMNode) => {
    console.log("%c Line:7 🍡 node", "color:#fca650", node);
    if (node.type === "tag") {
      if (node.name === "body") {
        return <div>{domToReact(node.children as DOMNode[], options)}</div>;
      }

      if (node.name === "p") {
        return (
          <Text as="p" size="3" my="5">
            {domToReact(node.children as DOMNode[], options)}
          </Text>
        );
      }
      if (node.name === "h1") {
        return (
          <Heading {...node.attribs} size="8" mb="6">
            {domToReact(node.children as DOMNode[], options)}
          </Heading>
        );
      }
      if (node.name === "h2") {
        return (
          <Heading {...node.attribs} size="7" mb="5">
            {domToReact(node.children as DOMNode[], options)}
          </Heading>
        );
      }
      if (node.name === "h3") {
        return (
          <Heading {...node.attribs} size="6" mb="4">
            {domToReact(node.children as DOMNode[], options)}
          </Heading>
        );
      }

      if (node.name === "a") {
        return (
          <Link {...node.attribs}>
            {domToReact(node.children as DOMNode[], options)}
          </Link>
        );
      }
    }

    return node;
  },
};
export interface ContentRenderProps {
  contentString: string;
}

export const ContentRender = (props: ContentRenderProps) => {
  const [parsedComponent, setParsedComponent] = useState<
    string | JSX.Element | JSX.Element[]
  >("");
  useEffect(() => {
    const parsed = HTMLReactParser(props.contentString, options);

    setParsedComponent(parsed);
  }, [props.contentString]);
  return <>{parsedComponent}</>;
};
