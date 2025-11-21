import { useEffect, useRef, useState } from 'react';
import { DrawingEngine } from '../../core/drawing-engine';

interface UseDrawingEngineOptions {
  width?: number;
  height?: number;
  containerId?: string;
}

export const useDrawingEngine = (options?: UseDrawingEngineOptions) => {
  const [engine, setEngine] = useState<DrawingEngine | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 创建或获取容器
    let container: HTMLDivElement;
    let shouldCleanup = false;

    if (options?.containerId) {
      // 使用指定的容器
      const existingContainer = document.getElementById(options.containerId);
      if (!existingContainer) {
        console.error(`Container with id "${options.containerId}" not found`);
        return;
      }
      container = existingContainer as HTMLDivElement;
    } else {
      // 自动创建容器
      container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.zIndex = '1000';
      document.body.appendChild(container);
      containerRef.current = container;
      shouldCleanup = true;
    }

    // 创建新的引擎实例
    const newEngine = new DrawingEngine({
      container,
      width: options?.width || window.innerWidth,
      height: options?.height || window.innerHeight - 60,
    });

    setEngine(newEngine);

    return () => {
      // 清理引擎
      newEngine.destroy();

      // 清理自动创建的容器
      if (shouldCleanup && containerRef.current) {
        containerRef.current.remove();
        containerRef.current = null;
      }
    };
  }, [options?.width, options?.height, options?.containerId]);

  return engine;
};
