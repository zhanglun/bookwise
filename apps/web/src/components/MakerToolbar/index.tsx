import React, { useEffect, useState } from "react";
import { Theme, IconButton } from "@radix-ui/themes";
import * as Toolbar from "@radix-ui/react-toolbar";
import { useSize } from "@radix-ui/react-use-size";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  StrikethroughIcon,
  TextAlignLeftIcon,
  TextAlignCenterIcon,
  TextAlignRightIcon,
  FontBoldIcon,
  FontItalicIcon,
} from "@radix-ui/react-icons";

import {
  useFloating,
  useDismiss,
  useInteractions,
  autoUpdate,
  offset,
  shift,
  limitShift,
  flip,
  hide,
  arrow as floatingUIarrow,
  inline,
} from "@floating-ui/react";
import type { Placement, Middleware } from "@floating-ui/react";

interface MarkerToolbarProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
  whileSelect?: boolean;
  disabled?: boolean;
  openDelay?: number;
  closeDelay?: number;
  onSelectColor: (color: string) => void;
}

function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

function getSideAndAlignFromPlacement(placement: Placement) {
  const [side, align = "center"] = placement.split("-");
  return [side as Side, align as Align] as const;
}

const transformOrigin = (options: {
  arrowWidth: number;
  arrowHeight: number;
}): Middleware => ({
  name: "transformOrigin",
  options,
  fn(data) {
    const { placement, rects, middlewareData } = data;

    const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
    const isArrowHidden = cannotCenterArrow;
    const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
    const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;

    const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
    const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[
      placedAlign
    ];

    const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
    const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;

    let x = "";
    let y = "";

    if (placedSide === "bottom") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${-arrowHeight}px`;
    } else if (placedSide === "top") {
      x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
      y = `${rects.floating.height + arrowHeight}px`;
    } else if (placedSide === "right") {
      x = `${-arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    } else if (placedSide === "left") {
      x = `${rects.floating.width + arrowHeight}px`;
      y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
    }

    return { data: { x, y } };
  },
});

export const MarkerToolbar = (props: MarkerToolbarProps) => {
  const {
    open: openProp,
    defaultOpen,
    onOpenChange,
    whileSelect = false,
    disabled = false,
    openDelay,
    closeDelay,
    side = "top",
    sideOffset = 0,
    align = "center",
    alignOffset = 0,
    arrowPadding = 0,
    sticky = "partial",
    collisionBoundary = [],
    collisionPadding: collisionPaddingProp = 0,
    hideWhenDetached = false,
    avoidCollisions = true,
    onEscapeKeyDown,
    onPointerDownOutside,
    onFocusOutside,
    onInteractOutside,
    ...contentProps
  } = props;
  const openTimerRef = React.useRef(0);
  const closeTimerRef = React.useRef(0);
  const [content, setContent] = React.useState<HTMLDivElement | null>(null);
  const [virtualRef, setVirtualRef] = React.useState({
    getBoundingClientRect: () => DOMRect.fromRect(),
    getClientRects: () => new DOMRectList(),
  });
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const handleOpen = React.useCallback(
    (callback: () => void) => {
      clearTimeout(closeTimerRef.current);
      openTimerRef.current = window.setTimeout(callback, openDelay);
    },
    [openDelay]
  );
  const handleClose = React.useCallback(() => {
    clearTimeout(openTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => setOpen(false), closeDelay);
  }, [closeDelay, setOpen]);

  const [isOpen, setIsOpen] = useState(false);
  const [arrow, setArrow] = React.useState<HTMLSpanElement | null>(null);
  const arrowSize = useSize(arrow);
  const arrowWidth = arrowSize?.width ?? 0;
  const arrowHeight = arrowSize?.height ?? 0;

  const desiredPlacement = (side +
    (align !== "center" ? "-" + align : "")) as Placement;
  const collisionPadding =
    typeof collisionPaddingProp === "number"
      ? collisionPaddingProp
      : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
  const boundary = Array.isArray(collisionBoundary)
    ? collisionBoundary
    : [collisionBoundary];
  const hasExplicitBoundaries = boundary.length > 0;
  const detectOverflowOptions = {
    padding: collisionPadding,
    boundary: boundary.filter(isNotNull),
    altBoundary: hasExplicitBoundaries,
  };

  const {
    x,
    y,
    strategy,
    floatingStyles,
    placement,
    refs,
    middlewareData,
    isPositioned,
    context,
  } = useFloating({
    strategy: "fixed",
    placement: desiredPlacement,
    whileElementsMounted: autoUpdate,
    middleware: [
      inline(),
      // anchorCssProperties(),
      offset({
        mainAxis: sideOffset + arrowHeight,
        alignmentAxis: alignOffset,
      }),
      avoidCollisions ? flip(detectOverflowOptions) : undefined,
      avoidCollisions
        ? shift({
            mainAxis: true,
            crossAxis: false,
            limiter: sticky === "partial" ? limitShift() : undefined,
            ...detectOverflowOptions,
          })
        : undefined,
      arrow
        ? floatingUIarrow({ element: arrow, padding: arrowPadding })
        : undefined,
      transformOrigin({ arrowWidth, arrowHeight }),
      hideWhenDetached ? hide({ strategy: "referenceHidden" }) : undefined,
    ],
  });

  const dismiss = useDismiss(context);

  const { getFloatingProps } = useInteractions([dismiss]);

  useEffect(() => {
    const handleSelection = () => {
      const selection = document.getSelection();
      if (!selection) return;

      const range =
        typeof selection?.rangeCount === "number" && selection.rangeCount > 0
          ? selection.getRangeAt(0)
          : null;

      if (selection?.isCollapsed) {
        setIsOpen(false);
        return;
      }

      if (range) {
        refs.setReference({
          getBoundingClientRect: () => range.getBoundingClientRect(),
          getClientRects: () => range.getClientRects(),
        });
        setIsOpen(true);
      }
    };
    document.addEventListener("selectionchange", handleSelection);
    return () =>
      document.removeEventListener("selectionchange", handleSelection);
  }, []);

  return (
    // <Selection.Root whileSelect open={open}>
    //   <Selection.Trigger ref={forwardedRef} asChild>
    //     {children}
    //   </Selection.Trigger>
    //   <Selection.Portal>
    //     <Theme asChild>
    //       <Selection.Content
    //         className="rounded-md border bg-popover bg-white p-1 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
    //         avoidCollisions={true}
    //         hideWhenDetached={true}
    //       >
    //         <div className="px-2 py-1">
    //           <div className="flex gap-4">
    //             <IconButton>
    //               <Highlighter size={14} />
    //             </IconButton>
    //             <IconButton>
    //               <MessageSquare size={14} />
    //             </IconButton>
    //             <IconButton variant="ghost">
    //               <Share size={14} />
    //             </IconButton>
    //             <IconButton variant="ghost">
    //               <Underline size={14} />
    //             </IconButton>
    //           </div>
    //           <div className="flex gap-2">
    //             {colorList.map((color) => {
    //               return (
    //                 <span
    //                   className="w-5 h-5 rounded-full opacity-90 hover:rounded-sm hover:opacity-100"
    //                   key={color}
    //                   style={{ backgroundColor: color }}
    //                   onClick={() => {
    //                     onSelectColor(color);
    //                     setOpen(false);
    //                   }}
    //                 ></span>
    //               );
    //             })}
    //           </div>
    //         </div>
    //       </Selection.Content>
    //     </Theme>
    //   </Selection.Portal>
    // </Selection.Root>
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        padding: 4,
      }}
      {...getFloatingProps()}
    >
      {isOpen && <Toolbar.Root
        className="flex p-[10px] w-full min-w-max rounded-md bg-white shadow-[0px_0px_0px_1px_rgba(60,64,67,0.05),0px_1.5px_4px_rgba(60,64,67,0.1),0px_3px_10px_rgba(60,64,67,0.2)]"
        aria-label="Formatting options"
      >
        <Toolbar.ToggleGroup type="multiple" aria-label="Text formatting">
          <Toolbar.ToggleItem
            className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
            value="bold"
            aria-label="Bold"
          >
            <FontBoldIcon />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
            value="italic"
            aria-label="Italic"
          >
            <FontItalicIcon />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
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
            className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
            value="left"
            aria-label="Left aligned"
          >
            <TextAlignLeftIcon />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
            value="center"
            aria-label="Center aligned"
          >
            <TextAlignCenterIcon />
          </Toolbar.ToggleItem>
          <Toolbar.ToggleItem
            className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
            value="right"
            aria-label="Right aligned"
          >
            <TextAlignRightIcon />
          </Toolbar.ToggleItem>
        </Toolbar.ToggleGroup>
        <Toolbar.Separator className="w-[1px] bg-mauve6 mx-[10px]" />
        <Toolbar.Link
          className="bg-transparent text-mauve11 hidden sm:inline-flex justify-center items-center hover:bg-transparent hover:cursor-pointer flex-shrink-0 flex-grow-0 basis-auto h-[25px] px-[5px] rounded text-[13px] leading-none bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet11 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet5 data-[state=on]:text-violet11"
          href="#"
          target="_blank"
          style={{ marginRight: 10 }}
        >
          Edited 2 hours ago
        </Toolbar.Link>
        <Toolbar.Button
          className="px-[10px] text-white bg-violet9 flex-shrink-0 flex-grow-0 basis-auto h-[25px] rounded inline-flex text-[13px] leading-none items-center justify-center outline-none hover:bg-violet10 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7"
          style={{ marginLeft: "auto" }}
        >
          Share
        </Toolbar.Button>
      </Toolbar.Root>}
    </div>
  );
};
