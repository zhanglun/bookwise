import { TextArea } from "@radix-ui/themes";
import { useRef } from "react";
import { useRichMetaHook } from "./hook";
import { stripHtml } from "@/helpers/string";

type RichMetaItemType = {
  label: string;
  initialValue: string;
  fieldName: string;
  uuid: string;
};

export const TitleField = ({
  label,
  initialValue,
  fieldName,
  uuid,
}: RichMetaItemType) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const {
    value,
    setValue,
    isEditing,
    setIsHovered,
    handleClick,
    handleInput,
    handleKeyDown,
    handleBlur,
  } = useRichMetaHook({ inputRef, initialValue, fieldName, uuid });

  const displayValue = fieldName === "description" ? stripHtml(value as string) : value;

  return (
    <>
      <div className="pt-[6px] text-sm text-right">{label}</div>
      <div
        className="min-w-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {isEditing ? (
          <TextArea
            className="w-full !h-auto !min-h-0 autosize"
            ref={inputRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              handleKeyDown(e);
            }}
            onBlur={handleBlur}
            onInput={handleInput}
          ></TextArea>
        ) : (
          <div className="min-h-[32px] px-[8px] py-[6px] text-sm rounded hover:bg-[var(--gray-a3)] whitespace-pre-wrap">
            {displayValue}
          </div>
        )}
      </div>
    </>
  );
};
