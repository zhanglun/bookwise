import { useCallback } from "react";
import { NodeProps } from "reactflow";
import { clsx } from "clsx";

export function NoteNode(props: NodeProps) {
  const { data, selected } = props;
  const onChange = useCallback((e) => {
    console.log(e)
  }, []);

  return <div className={ clsx("rounded-lg bg-white p-4 border", {
    "shadow-[0_0_0_0.5px_hsl(var(--border))]": selected,
  }) }>
    <div className="text-md text-primary">NoteNode demo</div>
  </div>
}
