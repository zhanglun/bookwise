import { IconList } from '@tabler/icons-react';
import { ActionIcon, Popover } from '@mantine/core';
import { Toc } from './toc';
import classes from './toc.module.css';

export const TocBubble = () => {
  return (
    <Popover
      trapFocus
      position="bottom"
      withArrow
      shadow="md"
      classNames={{
        dropdown: classes.tocDropdown,
      }}
    >
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
