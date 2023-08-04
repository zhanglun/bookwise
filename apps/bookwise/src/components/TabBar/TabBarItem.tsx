import { X } from "lucide-react"

export interface TabBarItemProps {
  title: string; 
}
export const TabBarItem = (props: TabBarItemProps) => {
  const { title } = props;

  return <div className="relative flex flex-1 justify-center items-center bg-white border border-slate-100 rounded-lg h-full">
    <X size={14} className="absolute left-3"/>
    <span className="text-xs">
      {title}
    </span>
  </div>
}