import { BookPlus } from "lucide-react"
import {Book} from "@/components/Book";

export const Library = () => {
  return <div className="max-w-5xl m-auto  grid grid-flow-row gap-3">
    <div className="px-3 pt-7 pb-2 text-2xl font-bold text-stone-900">
     Library 
    </div>
    <div className="px-3 py-3 space-x-3">
      <div className="border border-stone-200 rounded-lg pl-6 py-3 w-[340px] flex items-center space-x-3 hover:bg-stone-100">
        <BookPlus size={20} className="text-indigo-500"/>
        <div className="grid grid-flow-row">
          <span className="text-sm font-bold text-stone-700">New Book</span>
          <span className="text-[10px] text-stone-500">Start reading a new book</span>
        </div>
      </div>
    </div>
    <div className="px-3 py-2 grid grid-flow-col grid-cols-5 gap-5">
      <Book data={{}} />
      <Book data={{}} />
      <Book data={{}} />
      <Book data={{}} />
      <Book data={{}} />
      <Book data={{}} />
    </div>
    <div className="px-3 pt-5 pb-2 text-xl font-bold text-stone-900">
      Recently reading
    </div>
    <div className="px-3 py-2 grid grid-flow-col grid-cols-5 gap-5">
      <Book data={{}} />
      <Book data={{}} />
      <Book data={{}} />
      <Book data={{}} />
      <Book data={{}} />
      <Book data={{}} />
    </div>
  </div>
}