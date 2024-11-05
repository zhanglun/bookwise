import { dal } from "@/dal";
import { useState, useRef, useEffect, KeyboardEvent } from "react";

export type RichMetaHookType<I> = {
  inputRef: React.MutableRefObject<HTMLTextAreaElement | null>;
  initialValue: I;
  fieldName: string;
  uuid: string;
};

export const useRichMetaHook = <I,>({
  inputRef,
  initialValue,
  fieldName,
  uuid,
}: RichMetaHookType<I>) => {
  const [value, setValue] = useState<I>(initialValue);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const previousValue = useRef(value);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      setValue(previousValue.current);
      setError(undefined);
      setIsEditing(false);
    } else if (e.key === "Enter") {
      handleSave();
    }
  };

  function handleClick() {
    if (!isLoading) {
      setIsEditing(true);
    }
  }

  function resizeTextArea() {
    if (inputRef.current) {
      inputRef.current.style.height = "30px";
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }

  function submit<T>(fieldName: string, value: T) {
    // TODO: submit update
    console.log("fieldName", fieldName);
    console.log("value", value);

    dal.updateBook({ [fieldName]: value, uuid }).then((res) => {
      console.log("🚀 ~ file: hook.tsx:53 ~ dal.updateBook ~ res:", res);
    });
  }

  const handleInput = () => {
    resizeTextArea();
  };

  const handleSave = () => {
    if (value === previousValue.current) {
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(undefined);
      submit(fieldName, value);
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

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      resizeTextArea();
    }
  }, [inputRef, isEditing]);

  return {
    value,
    setValue,
    isEditing,
    setIsEditing,
    isHovered,
    setIsHovered,
    error,
    setError,
    isLoading,
    setIsLoading,

    handleClick,
    handleInput,
    handleKeyDown,
    handleBlur,
    handleSave,

    previousValue,
    resizeTextArea,
    submit,
  };
};
