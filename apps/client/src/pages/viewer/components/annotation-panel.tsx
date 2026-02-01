import { memo, useState } from 'react';
import { ScrollArea, Text, ActionIcon, Tooltip, Textarea, Button } from '@mantine/core';
import {
  IconHighlight,
  IconUnderline,
  IconMessageCircle,
  IconTrash,
  IconChevronRight,
  IconBookmark,
  IconNotes,
  IconColorPicker,
} from '@tabler/icons-react';
import { useAtom, useAtomValue } from 'jotai';
import {
  annotationsAtom,
  Annotation,
  activeAnnotationIdAtom,
} from '../atoms/reader-atoms';
import classes from './annotation-panel.module.css';

type TabType = 'annotations' | 'bookmarks' | 'notes';

const COLORS = [
  { name: '黄色', value: '#fef3c7', text: '#92400e' },
  { name: '绿色', value: '#d1fae5', text: '#065f46' },
  { name: '蓝色', value: '#dbeafe', text: '#1e40af' },
  { name: '粉色', value: '#fce7f3', text: '#9d174d' },
  { name: '紫色', value: '#ede9fe', text: '#5b21b6' },
];

interface AnnotationPanelProps {
  isOpen: boolean;
  currentSection?: number;
}

export const AnnotationPanel = memo(({ isOpen, currentSection = 0 }: AnnotationPanelProps) => {
  const [annotations, setAnnotations] = useAtom(annotationsAtom);
  const [activeId, setActiveId] = useAtom(activeAnnotationIdAtom);
  const [activeTab, setActiveTab] = useState<TabType>('annotations');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');

  const sectionAnnotations = annotations.filter((a) => a.sectionIndex === currentSection);
  const allAnnotations = annotations;

  const handleDelete = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    if (activeId === id) {
      setActiveId(null);
    }
  };

  const handleAddNote = (id: string) => {
    if (noteInput.trim()) {
      setAnnotations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, note: noteInput.trim() } : a))
      );
      setEditingId(null);
      setNoteInput('');
    }
  };

  const handleAnnotationClick = (annotation: Annotation) => {
    setActiveId(annotation.id === activeId ? null : annotation.id);
  };

  const getAnnotationIcon = (type: Annotation['type']) => {
    switch (type) {
      case 'highlight':
        return <IconHighlight size={16} />;
      case 'underline':
        return <IconUnderline size={16} />;
      case 'note':
        return <IconMessageCircle size={16} />;
      default:
        return <IconBookmark size={16} />;
    }
  };

  const renderAnnotationItem = (annotation: Annotation) => {
    const isActive = annotation.id === activeId;
    const isEditing = editingId === annotation.id;

    return (
      <div
        key={annotation.id}
        className={`${classes.annotationItem} ${isActive ? classes.active : ''}`}
        onClick={() => handleAnnotationClick(annotation)}
        style={{ background: isActive ? annotation.color : 'transparent' }}
      >
        <div className={classes.annotationHeader}>
          <span
            className={classes.annotationIcon}
            style={{ color: COLORS.find((c) => c.value === annotation.color)?.text || '#6b7280' }}
          >
            {getAnnotationIcon(annotation.type)}
          </span>
          <span className={classes.annotationType}>
            {annotation.type === 'highlight' && '高亮'}
            {annotation.type === 'underline' && '下划线'}
            {annotation.type === 'note' && '笔记'}
          </span>
          <span className={classes.annotationTime}>
            {annotation.createdAt.toLocaleDateString()}
          </span>
          <ActionIcon
            size="xs"
            variant="subtle"
            className={classes.deleteBtn}
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(annotation.id);
            }}
          >
            <IconTrash size={14} />
          </ActionIcon>
        </div>

        <div
          className={classes.annotationText}
          style={{ color: COLORS.find((c) => c.value === annotation.color)?.text || '#374151' }}
        >
          "{annotation.text}"
        </div>

        {annotation.note && (
          <div className={classes.annotationNote}>
            <IconMessageCircle size={14} className={classes.noteIcon} />
            <span>{annotation.note}</span>
          </div>
        )}

        {isActive && !annotation.note && !isEditing && (
          <Button
            variant="subtle"
            size="xs"
            className={classes.addNoteBtn}
            onClick={(e) => {
              e.stopPropagation();
              setEditingId(annotation.id);
            }}
          >
            添加笔记
          </Button>
        )}

        {isEditing && (
          <div className={classes.noteEditor}>
            <Textarea
              placeholder="写下你的想法..."
              size="xs"
              minRows={2}
              value={noteInput}
              onChange={(e) => setNoteInput(e.currentTarget.value)}
              onClick={(e) => e.stopPropagation()}
              className={classes.noteInput}
            />
            <div className={classes.noteActions}>
              <Button
                variant="subtle"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  setEditingId(null);
                  setNoteInput('');
                }}
              >
                取消
              </Button>
              <Button
                variant="filled"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddNote(annotation.id);
                }}
              >
                保存
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const tabs = [
    { id: 'annotations', label: '批注', icon: IconHighlight },
    { id: 'bookmarks', label: '书签', icon: IconBookmark },
    { id: 'notes', label: '笔记', icon: IconNotes },
  ];

  if (!isOpen) {
    return (
      <div className={classes.collapsed}>
        <Tooltip label="批注" position="left">
          <ActionIcon
            variant="subtle"
            size="lg"
            className={classes.collapsedIcon}
            onClick={() => {}}
          >
            <IconHighlight size={20} />
          </ActionIcon>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={classes.panel}>
      <div className={classes.header}>
        <h3 className={classes.title}>阅读批注</h3>
      </div>

      <div className={classes.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${classes.tab} ${activeTab === tab.id ? classes.active : ''}`}
            onClick={() => setActiveTab(tab.id as TabType)}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <ScrollArea className={classes.scrollArea} scrollbarSize={6}>
        <div className={classes.content}>
          {activeTab === 'annotations' && (
            <>
              {sectionAnnotations.length > 0 ? (
                <div className={classes.annotationList}>
                  <div className={classes.sectionTitle}>当前章节</div>
                  {sectionAnnotations.map(renderAnnotationItem)}
                </div>
              ) : (
                <div className={classes.emptySection}>
                  <IconHighlight size={32} className={classes.emptyIcon} />
                  <p>当前章节暂无批注</p>
                  <span className={classes.emptyHint}>选中文字添加批注</span>
                </div>
              )}

              {allAnnotations.length > sectionAnnotations.length && (
                <div className={classes.annotationList}>
                  <div className={classes.sectionTitle}>其他章节</div>
                  {allAnnotations
                    .filter((a) => a.sectionIndex !== currentSection)
                    .map(renderAnnotationItem)}
                </div>
              )}

              {allAnnotations.length === 0 && (
                <div className={classes.empty}>
                  <IconHighlight size={48} className={classes.emptyIcon} />
                  <p>暂无批注</p>
                  <span className={classes.emptyHint}>选中文字即可添加高亮、下划线或笔记</span>
                </div>
              )}
            </>
          )}

          {activeTab === 'bookmarks' && (
            <div className={classes.empty}>
              <IconBookmark size={48} className={classes.emptyIcon} />
              <p>暂无书签</p>
              <span className={classes.emptyHint}>点击目录项旁的星标添加书签</span>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className={classes.empty}>
              <IconNotes size={48} className={classes.emptyIcon} />
              <p>暂无笔记</p>
              <span className={classes.emptyHint}>在批注中点击"添加笔记"记录想法</span>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
});

AnnotationPanel.displayName = 'AnnotationPanel';
