import { useState } from 'react';
import {
  IconBooks,
  IconClock,
  IconHeart,
  IconTrash,
  IconChartBar,
  IconSettings,
  IconTag,
  IconUser,
  IconFileTypePdf,
  IconFileTypeDoc,
  IconBookmark,
  IconInbox,
  IconStar,
} from '@tabler/icons-react';
import { clsx } from 'clsx';
import classes from './sidebar.module.css';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
  active?: boolean;
}

interface CategoryItem {
  id: string;
  label: string;
  color: string;
  count?: number;
}

interface TagItem {
  id: string;
  label: string;
  active?: boolean;
}

export const Sidebar = () => {
  const [activeNav, setActiveNav] = useState('library');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const navItems: NavItem[] = [
    { id: 'library', label: '书架', icon: <IconBooks size={20} />, count: 128 },
    { id: 'recent', label: '最近阅读', icon: <IconClock size={20} />, count: 12 },
    { id: 'favorites', label: '收藏', icon: <IconHeart size={20} />, count: 24 },
    { id: 'bookmarks', label: '书签', icon: <IconBookmark size={20} />, count: 56 },
    { id: 'inbox', label: '待阅读', icon: <IconInbox size={20} />, count: 8 },
    { id: 'trash', label: '回收站', icon: <IconTrash size={20} />, count: 3 },
  ];

  const categories: CategoryItem[] = [
    { id: 'pdf', label: 'PDF', color: '#ef4444', count: 45 },
    { id: 'epub', label: 'EPUB', color: '#3b82f6', count: 62 },
    { id: 'mobi', label: 'MOBI', color: '#f97316', count: 18 },
    { id: 'txt', label: 'TXT', color: '#10b981', count: 3 },
  ];

  const authors: CategoryItem[] = [
    { id: 'author1', label: '鲁迅', color: '#8b5cf6', count: 5 },
    { id: 'author2', label: '余华', color: '#ec4899', count: 3 },
    { id: 'author3', label: '村上春树', color: '#06b6d4', count: 8 },
  ];

  const tags: TagItem[] = [
    { id: 'tech', label: '技术' },
    { id: 'novel', label: '小说' },
    { id: 'history', label: '历史' },
    { id: 'sci', label: '科学' },
    { id: 'art', label: '艺术' },
    { id: 'biz', label: '商业' },
  ];

  return (
    <div className={classes.sidebar}>
      {/* Main Navigation */}
      <div className={classes.section}>
        <div className={classes.sectionTitle}>图书馆</div>
        <div className={classes.navList}>
          {navItems.map((item) => (
            <div
              key={item.id}
              className={clsx(
                classes.navItem,
                activeNav === item.id && classes.navItemActive
              )}
              onClick={() => setActiveNav(item.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveNav(item.id);
                }
              }}
            >
              <span className={classes.navIcon}>{item.icon}</span>
              <span className={classes.navLabel}>{item.label}</span>
              {item.count !== undefined && (
                <span className={classes.badge}>{item.count}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className={classes.section}>
        <div className={classes.sectionTitle}>标签</div>
        <div className={classes.tagCloud}>
          {tags.map((tag) => (
            <span
              key={tag.id}
              className={clsx(
                classes.tag,
                activeTag === tag.id && classes.tagActive
              )}
              onClick={() => setActiveTag(activeTag === tag.id ? null : tag.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveTag(activeTag === tag.id ? null : tag.id);
                }
              }}
            >
              {tag.label}
            </span>
          ))}
        </div>
      </div>

      <div className={classes.divider} />

      {/* Format Categories */}
      <div className={classes.section}>
        <div className={classes.sectionTitle}>格式</div>
        <div className={classes.categoryList}>
          {categories.map((item) => (
            <div
              key={item.id}
              className={classes.categoryItem}
              onClick={() => {}}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  // Handle click
                }
              }}
            >
              <span
                className={classes.categoryDot}
                style={{ backgroundColor: item.color }}
              />
              <span className={classes.categoryLabel}>{item.label}</span>
              {item.count !== undefined && (
                <span className={classes.badge}>{item.count}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Authors */}
      <div className={classes.section}>
        <div className={classes.sectionTitle}>作者</div>
        <div className={classes.categoryList}>
          {authors.map((item) => (
            <div
              key={item.id}
              className={classes.categoryItem}
              onClick={() => {}}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  // Handle click
                }
              }}
            >
              <span
                className={classes.categoryDot}
                style={{ backgroundColor: item.color }}
              />
              <span className={classes.categoryLabel}>{item.label}</span>
              {item.count !== undefined && (
                <span className={classes.badge}>{item.count}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Bottom Actions */}
      <div className={classes.section}>
        <div className={classes.navList}>
          <div
            className={classes.navItem}
            onClick={() => {}}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                // Handle click
              }
            }}
          >
            <span className={classes.navIcon}>
              <IconChartBar size={20} />
            </span>
            <span className={classes.navLabel}>统计</span>
          </div>
          <div
            className={classes.navItem}
            onClick={() => {}}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                // Handle click
              }
            }}
          >
            <span className={classes.navIcon}>
              <IconSettings size={20} />
            </span>
            <span className={classes.navLabel}>设置</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
