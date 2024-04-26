import * as Toolbar from "@radix-ui/react-toolbar";
import {
  StrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  FontBoldIcon,
  FontItalicIcon,
  ArrowLeftIcon,
} from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";

export const MenuBar = () => {
  const navigate = useNavigate();
  const backToHome = () => {
    navigate("/");
  };

  return (
    <Toolbar.Root
      className="flex p-2 w-full min-w-max rounded-md bg-app shadow-[0_2px_10px] shadow-blackA4"
      aria-label="Formatting options"
    >
      <Toolbar.Button
        className="flex-shrink-0 flex-grow-0 basis-auto h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center ml-0.5 outline-none hover:bg-accent-3 hover:text-accent-11 focus:relative focus:shadow focus:shadow-accent-7 first:ml-0 data-[state=on]:bg-accent-5 data-[state=on]:text-accent-11"
        onClick={backToHome}
      >
        <ArrowLeftIcon />
      </Toolbar.Button>
      <Toolbar.Separator />
      <Toolbar.ToggleGroup type="multiple" aria-label="Text formatting">
        <Toolbar.ToggleItem
          className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-accent-3 hover:text-accent-11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-accent-7 first:ml-0 data-[state=on]:bg-accent-5 data-[state=on]:text-accent-11"
          value="bold"
          aria-label="Bold"
        >
          <FontBoldIcon />
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem
          className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-accent-3 hover:text-accent-11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-accent-7 first:ml-0 data-[state=on]:bg-accent-5 data-[state=on]:text-accent-11"
          value="italic"
          aria-label="Italic"
        >
          <FontItalicIcon />
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem
          className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-accent-3 hover:text-accent-11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-accent-7 first:ml-0 data-[state=on]:bg-accent-5 data-[state=on]:text-accent-11"
          value="strikethrough"
          aria-label="Strike through"
        >
          <StrikethroughIcon />
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
      <Toolbar.Separator className="w-[1px] bg-mauve6 mx-[10px]" />
      <Toolbar.ToggleGroup
        type="single"
        defaultValue="center"
        aria-label="Text alignment"
      >
        <Toolbar.ToggleItem
          className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-accent-3 hover:text-accent-11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-accent-7 first:ml-0 data-[state=on]:bg-accent-5 data-[state=on]:text-accent-11"
          value="left"
          aria-label="Left aligned"
        >
          <TextAlignLeftIcon />
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem
          className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-accent-3 hover:text-accent-11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-accent-7 first:ml-0 data-[state=on]:bg-accent-5 data-[state=on]:text-accent-11"
          value="center"
          aria-label="Center aligned"
        >
          <TextAlignCenterIcon />
        </Toolbar.ToggleItem>
        <Toolbar.ToggleItem
          className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-accent-3 hover:text-accent-11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-accent-7 first:ml-0 data-[state=on]:bg-accent-5 data-[state=on]:text-accent-11"
          value="right"
          aria-label="Right aligned"
        >
          <TextAlignRightIcon />
        </Toolbar.ToggleItem>
      </Toolbar.ToggleGroup>
      <Toolbar.Separator className="w-[1px] bg-mauve7 mx-[10px]" />
      <Toolbar.Link
        className="bg-transparent text-mauve11 hidden sm:inline-flex justify-center items-center hover:bg-transparent hover:cursor-pointer flex-shrink-0 flex-grow-0 basis-auto h-[25px] px-[5px] rounded text-[13px] leading-none bg-white ml-0.5 outline-none hover:text-accent-11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-accent-7 first:ml-0 data-[state=on]:bg-accent-5 data-[state=on]:text-accent-11"
        href="#"
        target="_blank"
        style={{ marginRight: 10 }}
      >
        Edited 2 hours ago
      </Toolbar.Link>
      <Toolbar.Button
        className="px-[10px] text-white bg-accent-9 flex-shrink-0 flex-grow-0 basis-auto h-[25px] rounded inline-flex text-[13px] leading-none items-center justify-center outline-none hover:bg-accent10 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-accent-7"
        style={{ marginLeft: "auto" }}
      >
        Share
      </Toolbar.Button>
    </Toolbar.Root>
  );
};
