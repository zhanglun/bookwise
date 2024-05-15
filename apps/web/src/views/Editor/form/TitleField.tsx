import { TextField } from "@radix-ui/themes";
import { BookIcon } from "lucide-react";
import * as Form from "@radix-ui/react-form";

export const TitleField = ({ label, field }) => {
  return (
    <Form.Field name={label}>
      <Form.Label>{label}</Form.Label>
      <Form.Control asChild>
          <TextField.Root {...field}>
            <TextField.Slot>
              <BookIcon height="16" width="16" strokeWidth={1.5} />
            </TextField.Slot>
          </TextField.Root>
      </Form.Control>
    </Form.Field>
  );
};
