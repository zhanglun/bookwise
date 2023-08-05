import { AspectRatio } from "@/components/ui/aspect-ratio"

export interface BookProps {
    data: any;
}
export const Book = (props: BookProps) => {
    return <div>
        <AspectRatio ratio={7 / 10} className="bg-muted">
            <img
                src="https://source.unsplash.com/random?w=800&dpr=2&q=80"
                alt="Photo by Drew Beamer"
                className="rounded-md w-full h-full object-fill"
            />
        </AspectRatio>
    </div>
}