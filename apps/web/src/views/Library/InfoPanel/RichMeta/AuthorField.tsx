import { useEffect, useRef, useState } from "react";
import { useRichMetaHook } from "./hook";
import { AuthorSelect } from "@/views/Library/InfoPanel/form/AuthorSelect.tsx";
import { AuthorResItem } from "@/interface/book";

type RichMetaItemType = {
  label: string;
  initialValue: AuthorResItem[];
  fieldName: string;
  uuid: string;
};

export const AuthorField = ({
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
    submit,
  } = useRichMetaHook({ inputRef, initialValue, fieldName, uuid });

  const [renderName, setRenderName] = useState(
    initialValue.map((a) => a.name).join(", ")
  );

  function onChange(value: AuthorResItem[]) {
    console.log("🚀 ~ file: AuthorField.tsx:23 ~ onChange ~ value:", value);
    setValue(value);
  }

  useEffect(() => {
    setRenderName(value.map((a) => a.name).join(", "));
  }, [value]);

  return (
    <>
      <div>
        <div className="pt-[6px] text-sm text-right">{label}</div>
      </div>
      <div
        className="min-w-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {isEditing ? (
          <AuthorSelect
            defaultOpen={isEditing}
            value={value}
            onChange={onChange}
            onOpenChange={(status) => {
              if (!status) {
                submit('author_uuids', value.map(v => v.uuid));
              }
            }}
          />
        ) : (
          <div className="min-h-[32px] px-[8px] py-[6px] text-sm rounded hover:bg-[var(--gray-a3)]">
            {renderName}
          </div>
        )}
      </div>
    </>
  );
};
