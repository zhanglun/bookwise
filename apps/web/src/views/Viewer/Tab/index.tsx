import { FileIcon } from "@radix-ui/react-icons"
import './index.css';

export const ViewTab = () => {
  return <div className="tab">
    <div className="tab-item">
      <FileIcon />
      <span>这里是文件名字</span>
    </div>
    <div className="tab-item">
      <FileIcon />
      <span>这里是文件名字</span>
    </div>
    <div className="tab-item tab-item--active">
      <FileIcon />
      <span>这里是文件名字</span>
    </div>
  </div>
}
