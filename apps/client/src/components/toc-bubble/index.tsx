import { IconList } from '@tabler/icons-react';
import { ActionIcon, Popover } from '@mantine/core';
import { Toc } from '@/pages/viewer/toc';

export const TocBubble = () => {
  return (
    <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
      <Popover.Target>
        <ActionIcon>
          <IconList />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <Toc />
      </Popover.Dropdown>
    </Popover>
  );
};
