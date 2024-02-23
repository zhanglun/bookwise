import React, { useEffect, useState } from "react";
import { Theme, IconButton } from "@radix-ui/themes";
import * as Toolbar from "@radix-ui/react-toolbar";
import { useSize } from "@radix-ui/react-use-size";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import {
  UnderlineIcon,
  StrikethroughIcon,
  CopyIcon,
  Share1Icon,
} from "@radix-ui/react-icons";

import {
  useFloating,
  useClick,
  useRole,
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

const colorList = [
  "#ffd500",
  "#BFFF00",
  "#FF7F50",
  "#4B0082",
  "#008080",
  "#EE82EE",
  "#FF6F61",
  "#87CEEB",
  "#F44336",
  "#778899",
  "#00A86B",
];

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
  onStrokeChange: (stroke: string) => void;
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

export const MarkerToolbar = React.memo((props: MarkerToolbarProps) => {
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
    onSelectColor,
    onStrokeChange,
    ...contentProps
  } = props;
  const openTimerRef = React.useRef(0);
  const closeTimerRef = React.useRef(0);
  const [content, setContent] = React.useState<HTMLDivElement | null>(null);
  const [virtualRef, setVirtualRef] = React.useState({
    getBoundingClientRect: () => DOMRect.fromRect(),
    getClientRects: () => new DOMRectList(),
  });
  const [isOpen , setIsOpen] = useState(openProp);
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
    open: isOpen,
    onOpenChange: setIsOpen,
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

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);

  const { getFloatingProps } = useInteractions([dismiss, click,role]);

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

  function handleStrokeChange (value: string) {
    console.log("%c Line:249 🍯 value", "color:#6ec1c2", value);
    onStrokeChange(value);
  }

  useEffect(() => {
    setIsOpen(openProp);
  }, [openProp]);

  return (
    <div
      ref={refs.setFloating}
      style={{
        ...floatingStyles,
        padding: 4,
      }}
      {...getFloatingProps()}
    >
      {isOpen && (
        <Toolbar.Root
          className="flex p-[10px] w-full min-w-max rounded-md bg-white shadow-[0px_0px_0px_1px_rgba(60,64,67,0.05),0px_1.5px_4px_rgba(60,64,67,0.1),0px_3px_10px_rgba(60,64,67,0.2)]"
          aria-label="Formatting options"
        >
          <Theme asChild>
            <div>
              <Toolbar.ToggleGroup type="single" aria-label="Draw stroke" onValueChange={handleStrokeChange}>
                <Toolbar.ToggleItem
                  className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet-900 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet-500 data-[state=on]:text-violet-900"
                  value="underline"
                  aria-label="Underline"
                >
                  <UnderlineIcon />
                </Toolbar.ToggleItem>
                <Toolbar.ToggleItem
                  className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet-900 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet-500 data-[state=on]:text-violet-900"
                  value="strikethrough"
                  aria-label="Strike through"
                >
                  <StrikethroughIcon />
                </Toolbar.ToggleItem>
              </Toolbar.ToggleGroup>
              <Toolbar.Separator className="w-[1px] bg-mauve6 mx-[10px]" />
              <Toolbar.Button
                className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet-900 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet-500 data-[state=on]:text-violet-900"
                value="strikethrough"
                aria-label="Strike through"
              >
                <CopyIcon />
              </Toolbar.Button>
              <Toolbar.Button
                className="flex-shrink-0 flex-grow-0 basis-auto text-mauve11 h-[25px] px-[5px] rounded inline-flex text-[13px] leading-none items-center justify-center bg-white ml-0.5 outline-none hover:bg-violet3 hover:text-violet-900 focus:relative focus:shadow-[0_0_0_2px] focus:shadow-violet7 first:ml-0 data-[state=on]:bg-violet-500 data-[state=on]:text-violet-900"
                value="strikethrough"
                aria-label="Strike through"
              >
                <Share1Icon />
              </Toolbar.Button>
              <Toolbar.Separator className="w-[1px] bg-mauve6 mx-[10px]" />
              <div>
                <div className="flex gap-2">
                  {colorList.map((color) => {
                    return (
                      <span
                        className="w-5 h-5 rounded-full opacity-90 hover:rounded-sm hover:opacity-100 select-none"
                        key={color}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          onSelectColor(color);
                          setIsOpen(false);
                        }}
                      ></span>
                    );
                  })}
                </div>
              </div>
            </div>
          </Theme>
        </Toolbar.Root>
      )}
    </div>
  );
});
