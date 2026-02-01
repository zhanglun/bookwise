import { memo, useState, useRef, useEffect } from 'react';
import { ActionIcon, Tooltip, Slider } from '@mantine/core';
import {
  IconChevronLeft,
  IconChevronRight,
  IconMaximize,
  IconMinimize,
} from '@tabler/icons-react';
import classes from './progress-bar.module.css';

interface ProgressBarProps {
  currentSection: number;
  totalSections: number;
  progress: number;
  onSectionChange: (section: number) => void;
  onProgressChange: (progress: number) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const ProgressBar = memo(
  ({
    currentSection,
    totalSections,
    progress,
    onSectionChange,
    onProgressChange,
    onPrev,
    onNext,
  }: ProgressBarProps) => {
    const [showSlider, setShowSlider] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);
    const progressRef = useRef<HTMLDivElement>(null);

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || totalSections <= 1) return;

      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, clickX / rect.width));
      const targetSection = Math.floor(percentage * totalSections);

      onSectionChange(Math.min(targetSection, totalSections - 1));
    };

    const formatTime = (minutes: number) => {
      if (minutes < 60) {
        return `${Math.round(minutes)}分钟`;
      }
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return `${hours}小时${mins > 0 ? `${mins}分钟` : ''}`;
    };

    const remainingSections = totalSections - currentSection - 1;

    return (
      <div className={`${classes.container} ${isExpanded ? classes.expanded : classes.minimized}`}>
        {isExpanded ? (
          <>
            <div className={classes.mainBar}>
              <Tooltip label="上一章" position="top">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  className={classes.navBtn}
                  onClick={onPrev}
                  disabled={currentSection === 0}
                >
                  <IconChevronLeft size={18} />
                </ActionIcon>
              </Tooltip>

              <div
                className={classes.progressSection}
                onMouseEnter={() => setShowSlider(true)}
                onMouseLeave={() => setShowSlider(false)}
              >
                <div className={classes.progressInfo}>
                  <span className={classes.progressText}>
                    {currentSection + 1} / {totalSections}
                  </span>
                  <span className={classes.progressPercent}>{Math.round(progress * 100)}%</span>
                </div>

                <div
                  ref={progressRef}
                  className={classes.progressBar}
                  onClick={handleProgressClick}
                >
                  <div className={classes.progressTrack}>
                    <div
                      className={classes.progressFill}
                      style={{ width: `${progress * 100}%` }}
                    />
                  </div>
                  <div
                    className={classes.progressThumb}
                    style={{ left: `${progress * 100}%` }}
                  />
                </div>

                {showSlider && totalSections > 1 && (
                  <div className={classes.sliderWrapper}>
                    <Slider
                      value={progress * 100}
                      onChange={(v) => onProgressChange(v / 100)}
                      min={0}
                      max={100}
                      step={0.1}
                      size="sm"
                      className={classes.slider}
                    />
                  </div>
                )}
              </div>

              <Tooltip label="下一章" position="top">
                <ActionIcon
                  variant="subtle"
                  size="sm"
                  className={classes.navBtn}
                  onClick={onNext}
                  disabled={currentSection >= totalSections - 1}
                >
                  <IconChevronRight size={18} />
                </ActionIcon>
              </Tooltip>
            </div>

            <div className={classes.extraInfo}>
              <span className={classes.remainingInfo}>
                还剩 {remainingSections} 章
              </span>
            </div>

            <Tooltip label="最小化" position="top">
              <ActionIcon
                variant="subtle"
                size="sm"
                className={classes.minimizeBtn}
                onClick={() => setIsExpanded(false)}
              >
                <IconMinimize size={16} />
              </ActionIcon>
            </Tooltip>
          </>
        ) : (
          <div className={classes.minimizedBar}>
            <div className={classes.miniProgress}>
              <div
                className={classes.miniProgressFill}
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <span className={classes.miniText}>{Math.round(progress * 100)}%</span>
            <Tooltip label="展开" position="top">
              <ActionIcon
                variant="subtle"
                size="sm"
                className={classes.maximizeBtn}
                onClick={() => setIsExpanded(true)}
              >
                <IconMaximize size={16} />
              </ActionIcon>
            </Tooltip>
          </div>
        )}
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';
