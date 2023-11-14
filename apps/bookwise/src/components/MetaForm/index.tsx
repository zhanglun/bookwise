import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { cn } from "@/helpers/utils"
import { BookResItem } from "@/interface/book";
import { Button } from "@ui/button"
import { Calendar } from "@ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@ui/command"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@ui/form"
import { Input } from "@ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@ui/popover"
import { toast } from "@ui/use-toast"
import { AuthorSelect } from "@/components/MetaForm/AuthorSelect";

const languages = [
  { label: "English", value: "en" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Spanish", value: "es" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Japanese", value: "ja" },
  { label: "Korean", value: "ko" },
  { label: "Chinese", value: "zh" },
] as const

const formSchema = z.object({
  title: z.string(),
  author_id: z.array(z.number()),
  description: z.string(),
  publish_at: z.date(),
})

type FormValues = z.infer<typeof BookResItem>
export interface MetaFormProps {
  defaultData: Partial<FormValues>
}

export function MetaForm(props: any) {
  const { defaultData } = props;

  console.log("default data", defaultData)

  defaultData.author_id = defaultData.author?.id;

  const date = new Date(defaultData.publish_at);

  if (isNaN(date.getTime())) {
    defaultData.publish_at = "";
  } else {
    // 日期有效
    defaultData.publish_at = date;
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultData
  })

  function onSubmit(data: formValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{ JSON.stringify(data, null, 2) }</code>
        </pre>
      ),
    })
  }

  return (
    <Form { ...form }>
      <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-8">
        <FormField
          control={ form.control }
          name="title"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Book name" { ...field } />
              </FormControl>
              {/* <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription> */ }
              <FormMessage/>
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="author_id"
          render={ ({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <AuthorSelect onValueChange={field.onChange} defaultValue={field.value} />
              </FormControl>
              {/* <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription> */ }
              <FormMessage/>
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="publish_at"
          render={ ({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of publish</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={ "outline" }
                      className={ cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      ) }
                    >
                      { field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      ) }
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={ field.value }
                    onSelect={ field.onChange }
                    disabled={ (date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {/*<FormDescription>*/}
              {/*  Your date of birth is used to calculate your age.*/}
              {/*</FormDescription>*/}
              <FormMessage/>
            </FormItem>
          ) }
        />
        <FormField
          control={ form.control }
          name="language"
          render={ ({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={ cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      ) }
                    >
                      { field.value
                        ? languages.find(
                          (language) => language.value === field.value
                        )?.label
                        : "Select language" }
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..."/>
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      { languages.map((language) => (
                        <CommandItem
                          value={ language.label }
                          key={ language.value }
                          onSelect={ () => {
                            form.setValue("language", language.value)
                          } }
                        >
                          <CheckIcon
                            className={ cn(
                              "mr-2 h-4 w-4",
                              language.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            ) }
                          />
                          { language.label }
                        </CommandItem>
                      )) }
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage/>
            </FormItem>
          ) }
        />
        <Button type="submit">Confirm</Button>
      </form>
    </Form>
  )
}
