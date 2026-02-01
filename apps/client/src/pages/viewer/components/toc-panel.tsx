import { memo, useState } from 'react';
import { ScrollArea, Text, ActionIcon, Tooltip } from '@mantine/core';
import { IconSearch, IconChevronDown, IconChevronRight, IconBookmark } from '@tabler/icons-react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { currentTocHrefAtom, navigateAtom } from '../atoms/navigation-atoms';
import { tocItemsAtom } from '../atoms/detail-atoms';
import { TocItem } from '../../../components/toc-bubble/toc';
import classes from './toc-panel.module.css';

interface TocPanelProps {
  isOpen: boolean;
}

export const TocPanel = memo(({ isOpen }: TocPanelProps) => {
  const [tocItems] = useAtom(tocItemsAtom);
  const navigate = useSetAtom(navigateAtom);
  const currentHref = useAtomValue(currentTocHrefAtom);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const handleItemClick = async (href: string) => {
    await navigate(href);
  };

  const toggleExpand = (href: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(href)) {
      newExpanded.delete(href);
    } else {
      newExpanded.add(href);
    }
    setExpandedItems(newExpanded);
  };

  const renderTocItems = (items: TocItem[], level = 0) => {
    if (!items || items.length === 0) return null;

    return items.map((item) => {
      const isActive = item.href === currentHref;
      const hasSubitems = item.subitems && item.subitems.length > 0;
      const isExpanded = expandedItems.has(item.href);
      const isMatch = searchQuery && item.label.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        <div key={item.href} className={classes.tocItemWrapper}>
          <div
            className={`${classes.tocItem} ${isActive ? classes.active : ''} ${
              isMatch ? classes.highlight : ''
            }`}
            style={{ paddingLeft: `${level * 16 + 12}px` }}
            onClick={() => handleItemClick(item.href)}
          >
            {hasSubitems && (
              <ActionIcon
                size="xs"
                variant="subtle"
                className={classes.expandIcon}
                onClick={(e) => toggleExpand(item.href, e)}
              >
                {isExpanded ? (
                  <IconChevronDown size={14} />
                ) : (
                  <IconChevronRight size={14} />
                )}
              </ActionIcon>
            )}
            {!hasSubitems && <span className={classes.expandPlaceholder} />}

            <Text size="sm" truncate className={classes.tocLabel}>
              {item.label}
            </Text>

            {isActive && <IconBookmark size={14} className={classes.activeIcon} />}
          </div>

          {hasSubitems && isExpanded && (
            <div className={classes.subitems}>{renderTocItems(item.subitems || [], level + 1)}</div>
          )}
        </div>
      );
    });
  };

  if (!isOpen) {
    return (
      <div className={classes.collapsed}>
        <Tooltip label="目录" position="right">
          <ActionIcon
            variant="subtle"
            size="lg"
            className={classes.collapsedIcon}
            onClick={() => {}}
          >
            <IconSearch size={20} />
          </ActionIcon>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={classes.panel}>
      <div className={classes.header}>
        <h3 className={classes.title}>目录</h3>
      </div>

      <div className={classes.searchBox}>
        <IconSearch size={16} className={classes.searchIcon} />
        <input
          type="text"
          placeholder="搜索章节..."
          className={classes.searchInput}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <ScrollArea className={classes.scrollArea} scrollbarSize={6}>
        <div className={classes.tocList}>
          {tocItems.length > 0 ? (
            renderTocItems(tocItems)
          ) : (
            <div className={classes.empty}>暂无目录</div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
});

TocPanel.displayName = 'TocPanel';
