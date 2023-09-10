import {
  useCallback,
  useEffect,
  useState,
  PointerEvent,
  PointerEvent as ReactPointerEvent,
  useRef,
} from "react";
import { Outlet, useMatch, useNavigate } from "react-router-dom";
import { useAnimate, MotionConfig, motion } from "framer-motion";
import clamp from "lodash-es/clamp";
import clsx from "clsx";
import {
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Sidebar } from "@/components/SideBar";
import { Toaster } from "@/components/ui/toaster";
import { useBearStore } from "./store";
import { Button } from "@/components/ui/button";

const Open = {
  Open: "open",
  Closed: "closed",
} as const;

type Open = (typeof Open)[keyof typeof Open];

const Locked = {
  Locked: "locked",
  Unlocked: "unlocked",
} as const;

type Locked = (typeof Locked)[keyof typeof Locked];

function App() {
  const store = useBearStore((state) => ({
    sidebarCollapse: state.sidebarCollapse,
    updateSidebarCollapse: state.updateSidebarCollapse,
    bookStack: state.bookStack,
  }));
  const [server, setServer] = useState<any>({});
  const [isReading, setIsReading] = useState(false);
  const match = useMatch("/reader");

  const [selected, select] = useState<string | null>(null);
  const [width, setWidth] = useState(250);
  const originalWidth = useRef(width);
  const originalClientX = useRef(width);
  const [isDragging, setDragging] = useState(false);
  const [locked, setLocked] = useState<Locked>(Locked.Locked);
  const [open, setOpen] = useState<Open>(Open.Open);

  useEffect(() => {
    window.electronAPI?.onUpdateServerStatus((_event: any, value: any) => {
      setServer(JSON.parse(value));
    });
  }, []);

  useEffect(() => {
    setIsReading(!!match);
  }, [store.sidebarCollapse, match]);

  useEffect(() => {
    console.log("====>");
    console.log(store.bookStack);
  }, [store.bookStack]);

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setLocked((isLocked) => {
      if (isLocked === Locked.Locked) {
        setOpen(Open.Closed);
        return Locked.Unlocked;
      } else {
        setOpen(Open.Open);
        return Locked.Locked;
      }
    });
  };

  return (
    <>
      <Toaster />
      <div
        id="app"
        className="w-full h-full backdrop-blur-[40px] flex "
        onPointerMove={(e: PointerEvent) => {
          if (isDragging) return;

          if (e.clientX < 8) {
            setOpen(Open.Open);
            return;
          }

          let ele = e.target as Element | null;
          let called = false;

          while (ele != null && ele !== e.currentTarget) {
            if (ele.getAttribute("data-show-unlocked-sidebar")) {
              called = true;
              setOpen(Open.Open);
              break;
            }

            ele = ele.parentElement;
          }

          if (called === false)
            setOpen((open) =>
              locked === Locked.Unlocked ? Open.Closed : open
            );
        }}
        onPointerLeave={(e: PointerEvent) => {
          setOpen((open) => (locked === Locked.Unlocked ? Open.Closed : open));
        }}
      >
        <MotionConfig>
          <motion.div
            className="flex-shrink-0 w-[250px]"
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
              "overflow-hidden fixed top-0 right-0 bottom-0 left-0 z-10 w-[250px] rounded-lg bg-white",
              { "bg-white/0": open === Open.Open && locked === Locked.Locked }
            )}
            initial={false}
            animate={{
              top: locked === Locked.Locked ? 0 : 53,
              width,
              left:
                open === Open.Open
                  ? locked === Locked.Locked
                    ? 0
                    : 5
                  : -width - 10,
              bottom: locked === Locked.Locked ? 0 : 5,
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
            <div className="bg-white/0 px-2 pt-2">
              <div className="flex gap-1">
                {!store.sidebarCollapse && (
                  <Button
                    data-show-unlocked-sidebar
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 text-stone-700 hover:text-stone-800 hover:bg-white/30"
                    onClick={toggleSidebar}
                  >
                    <PanelLeftClose size={18} />
                  </Button>
                )}
                {store.sidebarCollapse && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-8 h-8 text-stone-700 hover:text-stone-800 hover:bg-white/30"
                    onClick={toggleSidebar}
                  >
                    <PanelLeftOpen size={18} />
                  </Button>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 text-stone-700 hover:text-stone-800 hover:bg-white/30"
                  onClick={() => navigate(-1)}
                >
                  <ChevronLeft size={18} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 text-stone-700 hover:text-stone-800 hover:bg-white/30"
                  onClick={() => navigate(1)}
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
              <Sidebar />

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
                          clamp(
                            originalWidth.current +
                              e.clientX -
                              originalClientX.current,
                            200,
                            400
                          )
                        )
                      );
                    }

                    function onPointerUp(e: globalThis.PointerEvent) {
                      ownerDocument.removeEventListener(
                        "pointermove",
                        onPointerMove
                      );
                      setDragging(false);

                      if (Math.abs(e.clientX - originalClientX.current) < 6) {
                        setLocked((isLocked) => {
                          if (isLocked === Locked.Locked) {
                            setOpen(Open.Closed);
                            return Locked.Unlocked;
                          } else {
                            setOpen(Open.Open);
                            return Locked.Locked;
                          }
                        });
                      }
                    }

                    ownerDocument.addEventListener(
                      "pointermove",
                      onPointerMove
                    );
                    ownerDocument.addEventListener("pointerup", onPointerUp, {
                      once: true,
                    });
                  }}
                  className={clsx("w-3 h-full cursor-col-resize shrink-0")}
                />
              </div>
            </div>
          </motion.div>
          <div className="flex-1 rounded-lg overflow-hidden p-2">
            <Outlet />
          </div>
          <div></div>
        </MotionConfig>
      </div>
      <p className="hidden">
        node server status: pid: {server.pid} connected: {server.connected}{" "}
        signCode: {server.signalCode}
      </p>
    </>
  );
}

export default App;
