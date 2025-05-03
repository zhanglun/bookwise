import {
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightExpand,
  IconSquareRoundedArrowLeft,
  IconSquareRoundedArrowRight,
} from '@tabler/icons-react';
import { ActionIcon, ScrollArea } from '@mantine/core';
import { BufferTab } from '@/components/BufferTab';

export const TopBar = () => {
  return (
    <div className="h-[36px] grid grid-cols-[auto_1fr]">
      <div className="h-[32px] flex flex-row items-center gap-3 px-3">
        <ActionIcon variant="white">
          <IconLayoutSidebarLeftExpand size={20} color="gray" />
        </ActionIcon>
        {/* <ActionIcon variant="white">
          <IconLayoutSidebarRightExpand size={20} />
        </ActionIcon> */}
        <ActionIcon variant="white">
          <IconSquareRoundedArrowLeft size={20} color="gray" />
        </ActionIcon>
        <ActionIcon variant="white">
          <IconSquareRoundedArrowRight size={20} color="gray" />
        </ActionIcon>
      </div>

      <ScrollArea style={{ flex: 1, height: '100%' }}>
        <BufferTab />
      </ScrollArea>
    </div>
  );
};
