import { X } from "lucide-react"
import { clsx } from 'clsx';

export interface TabBarItemProps {
  title: string; 
  active?: boolean;
}
export const TabBarItem = (props: TabBarItemProps) => {
  const { title, active } = props;

  return <div className={clsx("relative flex flex-1 justify-center items-center border border-slate-50 rounded-lg h-full bg-white/30", {
    'bg-white/100 border-slate-100': active,
  })}>
    <X size={14} className="absolute left-3"/>
    <span className="text-sm">
      {title}
    </span>
  </div>
}