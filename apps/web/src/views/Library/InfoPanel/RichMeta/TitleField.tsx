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

  function resizeTextArea() {
    if (inputRef.current) {
      inputRef.current.style.height = "30px";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }

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
      setError(undefined);
      setIsEditing(false);
    } else if (e.key === "Enter") {
      //await handleSave();
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

  const handleInput = () => {
    resizeTextArea();
  };

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      resizeTextArea();
    }
  }, [isEditing]);

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
              className="w-full !h-auto !min-h-0 autosize"
              ref={inputRef}
              row={1}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleBlur}
              onInput={handleInput}
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
