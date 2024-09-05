import { Text, Link, Theme } from "@radix-ui/themes";
import HTMLReactParser, {
  domToReact,
  HTMLReactParserOptions,
  DOMNode,
  attributesToProps,
} from "html-react-parser";
import { useEffect, useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";

// 自定义转换函数，用于替换标签
const options: HTMLReactParserOptions = {
  replace: (node: DOMNode) => {
    //  return node;

    if (node.type === "tag") {
      if (node.name === "body") {
        return <div>{domToReact(node.children as DOMNode[], options)}</div>;
      }

      if (node.name === "p") {
        return (
          <Text
            as="p"
            size="3"
            my="4"
            style={{ textIndent: "2rem", letterSpacing: "0.5px" }}
            {...attributesToProps(node.attribs)}
          >
            {domToReact(node.children as DOMNode[], options)}
          </Text>
        );
      }
      // if (node.name === "h1") {
      //   return (
      //     <Heading {...attributesToProps(node.attribs)} size="8" mb="6">
      //       {domToReact(node.children as DOMNode[], options)}
      //     </Heading>
      //   );
      // }
      // if (node.name === "h2") {
      //   return (
      //     <Heading {...attributesToProps(node.attribs)} size="7" mb="5">
      //       {domToReact(node.children as DOMNode[], options)}
      //     </Heading>
      //   );
      // }
      // if (node.name === "h3") {
      //   return (
      //     <Heading {...attributesToProps(node.attribs)} size="6" mb="4">
      //       {domToReact(node.children as DOMNode[], options)}
      //     </Heading>
      //   );
      // }

      if (node.name === "a") {
        return (
          <Link {...attributesToProps(node.attribs)}>
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
  const { contentString } = props;
  const shadowContainerRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);
  const [, forceUpdate] = useState({});

  const parseContent = useCallback((content: string) => {
    const domParser = new DOMParser();
    const dom = domParser.parseFromString(content, "text/html");
    const head = dom.head;
    const body = dom.body;

    // 提取样式
    const styleElements = head.querySelectorAll('style, link[rel="stylesheet"]');
    let stylesText = '';
    styleElements.forEach(style => {
      if (style.tagName === 'STYLE') {
        stylesText += style.textContent;
      } else if (style.tagName === 'LINK') {
        stylesText += `@import url("${style.getAttribute('href')}");`;
      }
    });

    return { stylesText, bodyContent: body.innerHTML };
  }, []);

  const renderContent = useCallback((shadowRoot: ShadowRoot, stylesText: string, bodyContent: string) => {
    // 清除旧内容
    while (shadowRoot.firstChild) {
      shadowRoot.removeChild(shadowRoot.firstChild);
    }

    // 创建新的内容容器
    const contentContainer = document.createElement('div');
    shadowRoot.appendChild(contentContainer);

    // 渲染新内容
    ReactDOM.render(
      <Theme>
        <style>{stylesText}</style>
        {HTMLReactParser(bodyContent, options)}
      </Theme>,
      contentContainer
    );
  }, []);

  useEffect(() => {
    if (!shadowContainerRef.current) return;

    if (!shadowRootRef.current) {
      shadowRootRef.current = shadowContainerRef.current.attachShadow({ mode: 'open' });
    }

    const { stylesText, bodyContent } = parseContent(contentString);
    renderContent(shadowRootRef.current, stylesText, bodyContent);

    // 强制更新组件以确保React生命周期正确运行
    forceUpdate({});
  }, [contentString, parseContent, renderContent]);

  return <div ref={shadowContainerRef}></div>;
};
