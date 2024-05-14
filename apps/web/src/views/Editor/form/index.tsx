import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import * as z from "zod";
import { toast } from "sonner";

import { BookResItem } from "@/interface/book";
import { Button, TextField } from "@radix-ui/themes";
import { AuthorSelect } from "./AuthorSelect";
import { BookIcon } from "lucide-react";
import { useEffect, useState } from "react";

const formSchema = z.object({
  title: z.string(),
  author_id: z.array(z.number()),
  description: z.string(),
  publish_at: z.date(),
});

type FormValues = z.infer<typeof BookResItem>;
export interface MetaFormProps {
  defaultData: Partial<FormValues>;
}

export function MetaForm(props: any) {
  const { defaultData } = props;

  console.log("default data", defaultData);

  defaultData.author_ids = (defaultData?.authors || []).map(a => a.id);

  const date = new Date(defaultData.publish_at);

  if (isNaN(date.getTime())) {
    defaultData.publish_at = "";
  } else {
    // 日期有效
    defaultData.publish_at = date;
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultData,
  });

  function onSubmit(data: formValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form.Root onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <Form.Field control={form.control} name="title">
        <Form.Label>Title</Form.Label>
        <Form.Control asChild>
          {/*<Input placeholder="" { ...field } />*/}
          <TextField.Root placeholder="Book name">
            <TextField.Slot>
              <BookIcon height="16" width="16" />
            </TextField.Slot>
          </TextField.Root>
        </Form.Control>
      </Form.Field>
      <Button type="submit">Confirm</Button>
    </Form.Root>
  );
}
