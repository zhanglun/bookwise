import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Controller, useForm } from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import * as z from "zod";
import { toast } from "sonner";

import { BookResItem } from "@/interface/book";
import { Button, TextField } from "@radix-ui/themes";
import { AuthorSelect } from "./AuthorSelect";
import { useEffect, useState } from "react";
import { DevTool } from "@hookform/devtools";
import { TitleField } from "@/views/Editor/form/TitleField";
import { DescriptionField } from "@/views/Editor/form/DescriptionField";
import { AuthorField } from "@/views/Editor/form/AuthorField";

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

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultData,
  });

  useEffect(() => {
    defaultData.author_ids = (defaultData?.authors || []).map((a) => a.id);

    const date = new Date(defaultData.publish_at);

    defaultData.publish_at = isNaN(date.getTime()) ? "" : date;

    form.reset(defaultData);
  }, [defaultData]);

  const handleSubmit = async (event: any) => {
    const inputs = Object.fromEntries(new FormData(event.currentTarget));
    console.log("%c Line:21 🍪 inputs", "color:#93c0a4", inputs);

    event.preventDefault();
    // Submit form data and catch errors in the response
    // request
    //   .post("/apiJingdong/web/login", {
    //     ...inputs,
    //   })
    //   .then((res) => {
    //     const data = res.data;
    //     console.log("%c Line:35 🥟 data", "color:#33a5ff", data);
    //
    //     if (data.loginSuccess && data.randomValue) {
    //       localStorage.setItem("randomValue", data.randomValue);
    //       localStorage.setItem("currentUser", inputs.username.toString());
    //       navigate(RouteConfig.HOME);
    //     } else {
    //       toast.error("登录失败，请检查帐号和密码")
    //     }
    //   });

    event.preventDefault();
  };

  return (
    <>
      <Form.Root className="space-y-8" onSubmit={handleSubmit}>
        <Controller
          name="title"
          control={form.control}
          defaultValue={form.getValues("title")}
          render={({ field }) => <TitleField field={field} label={"Title"} />}
        />
        <Controller
          name="description"
          control={form.control}
          defaultValue={form.getValues("description")}
          render={({ field }) => <DescriptionField field={field} label={"Description"} />}
        />
        <Controller
          name="description"
          control={form.control}
          defaultValue={form.getValues("description")}
          render={({ field }) => <DescriptionField field={field} label={"Description"} />}
        />
        <Controller
          name="author_ids"
          control={form.control}
          defaultValue={form.getValues("author_ids")}
          render={({ field }) => <AuthorField field={field} label={"Authors"} />}
        />
        <Form.Submit asChild>
          <Button type="primary">Confirm</Button>
        </Form.Submit>
      </Form.Root>
      <DevTool control={form.control} /> {/* set up the dev tool */}
    </>
  );
}
