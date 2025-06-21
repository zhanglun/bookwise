import { TextArea } from "@radix-ui/themes";
import * as Form from "@radix-ui/react-form";

export const DescriptionField = ({ label, field }) => {
  return (
    <Form.Field name={label}>
      <Form.Label>{label}</Form.Label>
      <Form.Control asChild>
        <TextArea placeholder="You can add some description" {...field}></TextArea>
      </Form.Control>
    </Form.Field>
  );
};
