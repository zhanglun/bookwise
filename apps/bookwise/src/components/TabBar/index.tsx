import { TabBarItem } from "./TabBarItem"

export const TabBar = () => {
  return <div className="w-full h-full flex space-x-1">
    <TabBarItem title="Home" />
    <TabBarItem title="经典科普：地球的故事三部曲（套装共3册）" />
  </div>
}