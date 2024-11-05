import { TextArea } from "@radix-ui/themes";
import { KeyboardEventHandler, useEffect, useRef, useState } from "react";

export const TitleField = ({ label, initialValue, fieldName }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const previousValue = useRef(value);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!isLoading) {
      setIsEditing(true);
    }
  };

  const handleKeyDown = async (
    e: KeyboardEventHandler<HTMLTextAreaElement>
  ) => {
    console.log(e);
    if (e.key === "Escape") {
      setValue(previousValue.current);
      // setValue(e.target.value)
      setError(undefined);
      setIsEditing(false);
    } else if (e.key === "Enter") {
      await handleSave();
    }
  };

  const handleSave = async () => {
    if (value === previousValue.current) {
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(undefined);
      //await onSave?.(value);
      previousValue.current = value;
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBlur = () => {
    handleSave();
  };

  return (
    <>
      <div className="pt-[4px]">{label}</div>
      <div
        className="min-w-0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {isEditing ? (
          <>
            <TextArea
              className="w-full"
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
            ></TextArea>
          </>
        ) : (
          <div className="px-[8px] py-[6px] text-sm rounded hover:bg-[var(--gray-a3)]">
            {value}
          </div>
        )}
      </div>
    </>
  );
};
