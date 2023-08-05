import { X } from "lucide-react"
import { clsx } from 'clsx';

export interface TabBarItemProps {
  title: string; 
  active?: boolean;
}
export const TabBarItem = (props: TabBarItemProps) => {
  const { title, active } = props;

  return <div className={clsx("relative flex flex-1 justify-center items-center rounded-lg h-full bg-gray-300/50", {
    'bg-gray-50/90': active,
  })}>
    <X size={14} className="absolute left-3"/>
    <span className="text-xs">
      {title}
    </span>
  </div>
}