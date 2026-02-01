import { memo, useState } from 'react';
import { ActionIcon, Menu, Tooltip, SegmentedControl } from '@mantine/core';
import {
  IconLayoutSidebarLeftExpand,
  IconLayoutSidebarRightExpand,
  IconSettings,
  IconMoon,
  IconSun,
  IconTextSize,
  IconTypography,
  IconChevronLeft,
  IconBook,
  IconMenu2,
} from '@tabler/icons-react';
import { useAtom, useSetAtom } from 'jotai';
import { BookResItem } from '@/interface/book';
import {
  leftPanelOpenAtom,
  rightPanelOpenAtom,
  toolbarVisibleAtom,
  currentThemeAtom,
  fontSizeAtom,
  lineHeightAtom,
} from '../atoms/reader-atoms';
import classes from './toolbar.module.css';

interface ToolbarProps {
  book: BookResItem;
  currentSection?: number;
  totalSections?: number;
}

export const Toolbar = memo(({ book, currentSection = 0, totalSections = 1 }: ToolbarProps) => {
  const [leftOpen, setLeftOpen] = useAtom(leftPanelOpenAtom);
  const [rightOpen, setRightOpen] = useAtom(rightPanelOpenAtom);
  const [visible, setVisible] = useAtom(toolbarVisibleAtom);
  const [theme, setTheme] = useAtom(currentThemeAtom);
  const [fontSize, setFontSize] = useAtom(fontSizeAtom);
  const [lineHeight, setLineHeight] = useAtom(lineHeightAtom);
  const [autoHide, setAutoHide] = useState(false);

  const toggleLeftPanel = () => setLeftOpen(!leftOpen);
  const toggleRightPanel = () => setRightOpen(!rightOpen);
  const toggleToolbar = () => setVisible(!visible);
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  const progress = Math.round(((currentSection + 1) / totalSections) * 100);

  return (
    <>
      <div className={`${classes.toolbar} ${visible ? classes.visible : classes.hidden}`}>
        <div className={classes.leftSection}>
          <Tooltip label={leftOpen ? '收起目录' : '展开目录'} position="bottom">
            <ActionIcon
              variant="subtle"
              size="md"
              className={classes.iconButton}
              onClick={toggleLeftPanel}
            >
              {leftOpen ? <IconMenu2 size={20} /> : <IconLayoutSidebarLeftExpand size={20} />}
            </ActionIcon>
          </Tooltip>

          <Tooltip label="返回书架" position="bottom">
            <ActionIcon
              variant="subtle"
              size="md"
              className={classes.iconButton}
              onClick={() => window.history.back()}
            >
              <IconChevronLeft size={20} />
            </ActionIcon>
          </Tooltip>

          <div className={classes.bookInfo}>
            <IconBook size={16} className={classes.bookIcon} />
            <span className={classes.bookTitle} title={book.title}>
              {book.title}
            </span>
            <span className={classes.progress}>{progress}%</span>
          </div>
        </div>

        <div className={classes.centerSection}>
          <span className={classes.sectionInfo}>
            {currentSection + 1} / {totalSections}
          </span>
        </div>

        <div className={classes.rightSection}>
          <Menu position="bottom-end" shadow="md">
            <Menu.Target>
              <Tooltip label="字体设置" position="bottom">
                <ActionIcon variant="subtle" size="md" className={classes.iconButton}>
                  <IconTypography size={20} />
                </ActionIcon>
              </Tooltip>
            </Menu.Target>
            <Menu.Dropdown className={classes.menuDropdown}>
              <div className={classes.menuSection}>
                <span className={classes.menuLabel}>字号</span>
                <SegmentedControl
                  value={String(fontSize)}
                  onChange={(v) => setFontSize(Number(v))}
                  data={[
                    { label: '小', value: '16' },
                    { label: '中', value: '18' },
                    { label: '大', value: '20' },
                    { label: '特大', value: '22' },
                  ]}
                  size="xs"
                  className={classes.segmentControl}
                />
              </div>
              <Menu.Divider />
              <div className={classes.menuSection}>
                <span className={classes.menuLabel}>行高</span>
                <SegmentedControl
                  value={String(lineHeight)}
                  onChange={(v) => setLineHeight(Number(v))}
                  data={[
                    { label: '紧凑', value: '1.6' },
                    { label: '适中', value: '1.8' },
                    { label: '宽松', value: '2' },
                  ]}
                  size="xs"
                  className={classes.segmentControl}
                />
              </div>
            </Menu.Dropdown>
          </Menu>

          <Tooltip label={theme === 'light' ? '切换深色模式' : '切换明亮模式'} position="bottom">
            <ActionIcon
              variant="subtle"
              size="md"
              className={classes.iconButton}
              onClick={toggleTheme}
            >
              {theme === 'light' ? <IconMoon size={20} /> : <IconSun size={20} />}
            </ActionIcon>
          </Tooltip>

          <Tooltip label={rightOpen ? '收起批注' : '展开批注'} position="bottom">
            <ActionIcon
              variant="subtle"
              size="md"
              className={classes.iconButton}
              onClick={toggleRightPanel}
            >
              {rightOpen ? (
                <IconLayoutSidebarRightExpand size={20} />
              ) : (
                <IconLayoutSidebarRightExpand size={20} />
              )}
            </ActionIcon>
          </Tooltip>
        </div>
      </div>

      {/* 浮动工具栏切换按钮 - 当工具栏隐藏时显示 */}
      {!visible && (
        <div className={classes.floatingToggle} onClick={toggleToolbar}>
          <IconMenu2 size={18} />
        </div>
      )}
    </>
  );
});

Toolbar.displayName = 'Toolbar';
