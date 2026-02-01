import { memo, useState } from 'react';
import { ActionIcon, Tooltip } from '@mantine/core';
import {
  IconHighlight,
  IconUnderline,
  IconMessageCircle,
  IconColorPicker,
  IconX,
} from '@tabler/icons-react';
import { useAtom, useSetAtom } from 'jotai';
import {
  floatingToolbarPositionAtom,
  selectedTextAtom,
  annotationsAtom,
  Annotation,
} from '../atoms/reader-atoms';
import classes from './floating-toolbar.module.css';

const COLORS = [
  { name: '黄色', value: '#fef3c7', text: '#92400e' },
  { name: '绿色', value: '#d1fae5', text: '#065f46' },
  { name: '蓝色', value: '#dbeafe', text: '#1e40af' },
  { name: '粉色', value: '#fce7f3', text: '#9d174d' },
  { name: '紫色', value: '#ede9fe', text: '#5b21b6' },
];

interface FloatingToolbarProps {
  currentSection: number;
}

export const FloatingToolbar = memo(({ currentSection }: FloatingToolbarProps) => {
  const [position, setPosition] = useAtom(floatingToolbarPositionAtom);
  const [selectedText, setSelectedText] = useAtom(selectedTextAtom);
  const setAnnotations = useSetAtom(annotationsAtom);
  const [showColors, setShowColors] = useState(false);
  const [pendingAction, setPendingAction] = useState<'highlight' | 'underline' | 'note' | null>(
    null
  );

  const handleClose = () => {
    setPosition({ ...position, visible: false });
    setSelectedText('');
    setShowColors(false);
    setPendingAction(null);
  };

  const addAnnotation = (
    type: Annotation['type'],
    color: string,
    text: string,
    note?: string
  ) => {
    const newAnnotation: Annotation = {
      id: `anno_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      text,
      type,
      color,
      note,
      sectionIndex: currentSection,
      createdAt: new Date(),
    };

    setAnnotations((prev) => [...prev, newAnnotation]);
    handleClose();
  };

  const handleHighlightClick = () => {
    setPendingAction('highlight');
    setShowColors(true);
  };

  const handleUnderlineClick = () => {
    setPendingAction('underline');
    setShowColors(true);
  };

  const handleNoteClick = () => {
    setPendingAction('note');
    setShowColors(true);
  };

  const handleColorSelect = (color: (typeof COLORS)[0]) => {
    if (pendingAction && selectedText) {
      addAnnotation(pendingAction, color.value, selectedText);
    }
  };

  if (!position.visible || !selectedText) {
    return null;
  }

  return (
    <>
      <div
        className={classes.overlay}
        onClick={handleClose}
        onMouseDown={(e) => e.preventDefault()}
      />
      <div
        className={classes.toolbar}
        style={{
          left: position.x,
          top: position.y,
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        {!showColors ? (
          <div className={classes.mainButtons}>
            <Tooltip label="高亮" position="top" withArrow>
              <ActionIcon
                className={classes.actionBtn}
                onClick={handleHighlightClick}
                variant="subtle"
              >
                <IconHighlight size={18} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="下划线" position="top" withArrow>
              <ActionIcon
                className={classes.actionBtn}
                onClick={handleUnderlineClick}
                variant="subtle"
              >
                <IconUnderline size={18} />
              </ActionIcon>
            </Tooltip>

            <Tooltip label="添加笔记" position="top" withArrow>
              <ActionIcon
                className={classes.actionBtn}
                onClick={handleNoteClick}
                variant="subtle"
              >
                <IconMessageCircle size={18} />
              </ActionIcon>
            </Tooltip>

            <div className={classes.divider} />

            <ActionIcon className={classes.closeBtn} onClick={handleClose} variant="subtle">
              <IconX size={16} />
            </ActionIcon>
          </div>
        ) : (
          <div className={classes.colorPicker}>
            <span className={classes.colorLabel}>选择颜色</span>
            <div className={classes.colorGrid}>
              {COLORS.map((color) => (
                <button
                  key={color.value}
                  className={classes.colorBtn}
                  style={{ background: color.value }}
                  onClick={() => handleColorSelect(color)}
                  title={color.name}
                />
              ))}
            </div>
            <ActionIcon className={classes.backBtn} onClick={() => setShowColors(false)} size="sm">
              <IconX size={14} />
            </ActionIcon>
          </div>
        )}
      </div>
    </>
  );
});

FloatingToolbar.displayName = 'FloatingToolbar';
