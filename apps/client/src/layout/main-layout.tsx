import { PointerEvent, PointerEvent as ReactPointerEvent, useRef, useState } from 'react';
import { IconSquareRoundedArrowLeft, IconSquareRoundedArrowRight } from '@tabler/icons-react';
import clsx from 'clsx';
import { motion, MotionConfig } from 'framer-motion';
import clamp from 'lodash-es/clamp';
import { Outlet } from 'react-router-dom';
import { ActionIcon } from '@mantine/core';
import FloatSidebar from '@/components/Sidebar';
import classes from './layout.module.css';

const Open = {
  Open: 'open',
  Closed: 'closed',
} as const;

type Open = (typeof Open)[keyof typeof Open];

const Locked = {
  Locked: 'locked',
  Unlocked: 'unlocked',
} as const;

type Locked = (typeof Locked)[keyof typeof Locked];

export const MainLayout = () => {
  const [sidebarCollapse, _updateSidebarCollapse] = useState(false);

  const [width, setWidth] = useState(40);
  const originalWidth = useRef(width);
  const originalClientX = useRef(width);
  const [isDragging, setDragging] = useState(false);
  const [locked, setLocked] = useState<Locked>(Locked.Locked);
  const [open, setOpen] = useState<Open>(Open.Open);

  const toggleSidebar = () => {
    setLocked((isLocked) => {
      if (isLocked === Locked.Locked) {
        setOpen(Open.Closed);
        return Locked.Unlocked;
      }
      setOpen(Open.Open);
      return Locked.Locked;
    });
  };

  return (
    <div
      className={classes.mainLayout}
      onPointerMove={(e: PointerEvent) => {
        if (isDragging) {
          return;
        }

        if (e.clientX < 8) {
          setOpen(Open.Open);
          return;
        }

        let ele = e.target as Element | null;
        let called = false;

        while (ele != null && ele !== e.currentTarget) {
          if (ele.getAttribute('data-show-unlocked-sidebar')) {
            called = true;
            setOpen(Open.Open);
            break;
          }

          ele = ele.parentElement;
        }

        if (!called) {
          setOpen((open) => (locked === Locked.Unlocked ? Open.Closed : open));
        }
      }}
      onPointerLeave={(e: PointerEvent) => {
        setOpen((open) => (locked === Locked.Unlocked ? Open.Closed : open));
      }}
    >
      <MotionConfig>
        <motion.div
          className="flex-shrink-0"
          initial={false}
          animate={{
            width: locked === Locked.Locked && open === Open.Open ? width : 0,
          }}
          transition={{
            ease: [0.165, 0.84, 0.44, 1],
            duration: isDragging ? 0 : 0.3,
          }}
        />
        <motion.div
          layout
          data-show-unlocked-sidebar
          className={clsx(
            'overflow-hidden fixed top-0 right-0 bottom-0 left-0 z-10 rounded-lg bg-white pt-2 pl-2',
            { 'bg-white/0': open === Open.Open && locked === Locked.Locked },
            { 'shadow-lg bg-slate-400 px-2': open === Open.Open && locked !== Locked.Locked }
          )}
          initial={false}
          animate={{
            top: locked === Locked.Locked ? 0 : 54,
            width,
            left: open === Open.Open ? (locked === Locked.Locked ? 0 : 5) : -width - 10,
            bottom: locked === Locked.Locked ? 0 : 54,
            transition: {
              ease: [0.165, 0.84, 0.44, 1],
              width: {
                ease: [0.165, 0.84, 0.44, 1],
                duration: isDragging ? 0 : 0.3,
              },
              left: {
                ease: [0.165, 0.84, 0.44, 1],
                duration: isDragging ? 0 : 0.3,
              },
            },
          }}
        >
          <div className="bg-white/0 h-full flex flex-col">
            <div className="flex gap-1">
              {!sidebarCollapse && (
                <ActionIcon data-show-unlocked-sidebar variant="default" onClick={toggleSidebar}>
                  <IconSquareRoundedArrowLeft size={18} />
                </ActionIcon>
              )}
              {sidebarCollapse && (
                <ActionIcon variant="ghost" onClick={toggleSidebar}>
                  <IconSquareRoundedArrowRight size={18} />
                </ActionIcon>
              )}
            </div>

            <FloatSidebar />

            <div className="absolute z-10 right-0 w-0 flex-grow-0 top-0 bottom-0">
              <div
                onPointerDown={(e: ReactPointerEvent) => {
                  // this prevents dragging from selecting
                  e.preventDefault();

                  const { ownerDocument } = e.currentTarget;
                  originalWidth.current = width;
                  originalClientX.current = e.clientX;
                  setDragging(true);

                  function onPointerMove(e: globalThis.PointerEvent) {
                    if (e.clientX < 50) {
                      setOpen(Open.Closed);
                    } else {
                      setOpen(Open.Open);
                    }

                    setWidth(
                      Math.floor(
                        clamp(originalWidth.current + e.clientX - originalClientX.current, 200, 400)
                      )
                    );
                  }

                  function onPointerUp(e: globalThis.PointerEvent) {
                    ownerDocument.removeEventListener('pointermove', onPointerMove);
                    setDragging(false);

                    if (Math.abs(e.clientX - originalClientX.current) < 6) {
                      setLocked((isLocked) => {
                        if (isLocked === Locked.Locked) {
                          setOpen(Open.Closed);
                          return Locked.Unlocked;
                        }
                        setOpen(Open.Open);
                        return Locked.Locked;
                      });
                    }
                  }

                  ownerDocument.addEventListener('pointermove', onPointerMove);
                  ownerDocument.addEventListener('pointerup', onPointerUp, {
                    once: true,
                  });
                }}
                className={clsx('w-3 h-full cursor-col-resize shrink-0')}
              />
            </div>
          </div>
        </motion.div>
        <div className={classes.layoutView}>
          <Outlet />
        </div>
      </MotionConfig>
    </div>
  );
};
