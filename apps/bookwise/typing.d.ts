import { API } from "./electron/api";
export {};

declare global {
  interface Window {
    electronAPI: API; // 👈️ turn off type checking
  }
}

// 添加模块声明
declare module "react" {
  interface IntrinsicElements {
    "custom-element": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}
