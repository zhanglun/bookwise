import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, SubmitHandler, useForm} from "react-hook-form";
import * as Form from "@radix-ui/react-form";
import * as z from "zod";

import { BookResItem } from "@/interface/book";
import { Button } from "@radix-ui/themes";
import React, { useEffect } from "react";
import { DevTool } from "@hookform/devtools";
import { TitleField } from "./TitleField";
import { DescriptionField } from "./DescriptionField";
import { AuthorField } from "./AuthorField";

const formSchema = z.object({
  title: z.string(),
  author_uuids: z.array(z.string()),
  description: z.string(),
  publish_at: z.date(),
});

type FormValues = z.infer<typeof BookResItem>;

export interface MetaFormProps {
  defaultData: Partial<FormValues> & { author_uuids: string[] };
}

export function MetaForm(props: MetaFormProps) {
  const { defaultData } = props;

  console.log('defaultData', defaultData)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultData,
      author_uuids: (defaultData?.authors || []).map((a) => a.uuid),
    },
  });

  useEffect(() => {
    defaultData.author_uuids = (defaultData?.authors || []).map((a) => a.uuid);

    const date = new Date(defaultData?.publish_at ?? '');

    defaultData.publish_at = isNaN(date.getTime()) ? "" : defaultData.publish_at;

    form.reset(defaultData);
  }, [defaultData]);

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    // async request which may result error
    try {
      // await fetch()
      console.log(data)
    } catch (e) {
      console.log(e)
      // handle your error
    }
  };


  function handleSubmit(event: React.FormEvent<HTMLButtonElement>) {
    form.handleSubmit(onSubmit)()
    event.preventDefault()
  }


  return (
    <>
      <Form.Root className="space-y-8">
          <Controller
            name="title"
            control={form.control}
            defaultValue={form.getValues("title")}
            render={({field}) => <TitleField field={field} label={"Title"}/>}
          />
          <Controller
            name="description"
            control={form.control}
            defaultValue={form.getValues("description")}
            render={({field}) => <DescriptionField field={field} label={"Description"}/>}
          />
          <Controller
            name="author_uuids"
            control={form.control}
            defaultValue={form.getValues("author_uuids")}
            render={({field}) => <AuthorField field={field} label={"Authors"}/>}
          />
        <Button variant={"solid"} onClick={handleSubmit}>Confirm</Button>
      </Form.Root>
      <DevTool control={form.control}/> {/* set up the dev tool */}
    </>
  );
}
