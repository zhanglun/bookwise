import * as Form from "@radix-ui/react-form";
import {AuthorSelect} from "@/views/Library/InfoPanel/form/AuthorSelect.tsx";
import { ControllerRenderProps, FieldValues} from "react-hook-form";

export const AuthorField = ({ label, field }: { label: string, field:  ControllerRenderProps<FieldValues, string> }) => {

  return (
    <Form.Field name={label}>
      <Form.Label>{label}</Form.Label>
      <Form.Control asChild>
        <AuthorSelect
           {...field} />
      </Form.Control>
    </Form.Field>
  );
};
