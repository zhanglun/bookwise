import { IconList, IconMessage, IconPencil } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { ActionIcon } from '@mantine/core';
import { EditTool } from '@/components/edit-tool';
import { TocBubble } from '@/components/toc-bubble';
import { BookResItem } from '@/interface/book';
import { ViewerMode } from './types';
import { viewerModeAtom } from './viewer-atom';
import classes from './viewer.module.css';

export interface ViewerHeaderProps {
  book: BookResItem;
}

export const ViewerHeader = ({ book }: ViewerHeaderProps) => {
  const [viewerMode, setViewerMode] = useAtom(viewerModeAtom);

  const toggleViewerMode = () => {
    if (viewerMode === ViewerMode.VIEW) {
      setViewerMode(ViewerMode.ANNOTATION);
    }

    if (viewerMode === ViewerMode.ANNOTATION) {
      setViewerMode(ViewerMode.VIEW);
    }
  };

  return (
    <div className={classes.header}>
      <div>
        <ActionIcon>
          <IconPencil onClick={toggleViewerMode} />
        </ActionIcon>
      </div>
      <div>
        {viewerMode === ViewerMode.VIEW && <div className={classes.title}>{book.title}</div>}
        {viewerMode === ViewerMode.ANNOTATION && <EditTool />}
      </div>
      <div>
        <TocBubble />
        <ActionIcon>
          <IconMessage />
        </ActionIcon>
      </div>
    </div>
  );
};
