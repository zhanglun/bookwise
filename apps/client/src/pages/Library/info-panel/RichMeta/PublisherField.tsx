import { Select } from "@radix-ui/themes";
import {useEffect, useRef} from "react";
import { useRichMetaHook } from "./hook";

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
  const inputRef = useRef<HTMLSelectElement>(null);
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

  function getPublisherList() {

  }

  useEffect(() => {
    getPublisherList()
  }, []);

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
            <Select.Root value={value} onValueChange={setValue}>
              <Select.Trigger />
              <Select.Content>
                  <Select.Item value="orange">Orange</Select.Item>
              </Select.Content>
            </Select.Root>
        ) : (
          <div className="min-h-[32px] px-[8px] py-[6px] text-sm rounded hover:bg-[var(--gray-a3)]">
            {value}
          </div>
        )}
      </div>
    </>
  );
};
