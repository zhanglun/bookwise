import React, { useCallback, useEffect, useRef, useState } from 'react';

interface DrawingCanvasProps {
  visible: boolean;
  tool: 'pen' | 'rect' | 'circle';
  color: string;
  strokeWidth: number;
  onDrawComplete: (pathData: string, tool: string) => void;
  onCancel: () => void;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  visible,
  tool,
  color,
  strokeWidth,
  onDrawComplete,
  onCancel,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null);
  const [currentPath, setCurrentPath] = useState('');
  const [points, setPoints] = useState<Array<{ x: number; y: number }>>([]);

  // 获取鼠标/触摸位置
  const getPosition = useCallback((e: MouseEvent | TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return { x: 0, y: 0 };
    }

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  // 开始绘制
  const handleStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const pos = getPosition(e);
      setIsDrawing(true);
      setStartPoint(pos);
      setPoints([pos]);

      if (tool === 'pen') {
        setCurrentPath(`M ${pos.x} ${pos.y}`);
      }
    },
    [tool, getPosition]
  );

  // 绘制过程
  const handleMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || !canvasRef.current) {
        return;
      }
      e.preventDefault();

      const pos = getPosition(e);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }

      // 清空画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (tool === 'pen') {
        // 自由画笔
        setPoints((prev) => [...prev, pos]);
        setCurrentPath((prev) => `${prev} L ${pos.x} ${pos.y}`);

        ctx.beginPath();
        points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y);
          } else {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === 'rect' && startPoint) {
        // 矩形
        const width = pos.x - startPoint.x;
        const height = pos.y - startPoint.y;
        ctx.strokeRect(startPoint.x, startPoint.y, width, height);
      } else if (tool === 'circle' && startPoint) {
        // 圆形
        const radius = Math.sqrt((pos.x - startPoint.x) ** 2 + (pos.y - startPoint.y) ** 2);
        ctx.beginPath();
        ctx.arc(startPoint.x, startPoint.y, radius, 0, 2 * Math.PI);
        ctx.stroke();
      }
    },
    [isDrawing, tool, color, strokeWidth, startPoint, points, getPosition]
  );

  // 结束绘制
  const handleEnd = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDrawing || !startPoint) {
        return;
      }
      e.preventDefault();

      const pos = getPosition(e);
      let pathData = '';

      if (tool === 'pen') {
        // 自由画笔:使用当前路径
        pathData = currentPath;
      } else if (tool === 'rect') {
        // 矩形:生成 SVG path
        const width = pos.x - startPoint.x;
        const height = pos.y - startPoint.y;
        pathData = `M ${startPoint.x} ${startPoint.y} L ${startPoint.x + width} ${startPoint.y} L ${startPoint.x + width} ${startPoint.y + height} L ${startPoint.x} ${startPoint.y + height} Z`;
      } else if (tool === 'circle') {
        // 圆形:使用贝塞尔曲线近似
        const radius = Math.sqrt((pos.x - startPoint.x) ** 2 + (pos.y - startPoint.y) ** 2);
        const k = 0.5522848; // 魔法数字,用于贝塞尔曲线近似圆
        const ox = radius * k;
        const oy = radius * k;
        const cx = startPoint.x;
        const cy = startPoint.y;
        pathData = `M ${cx - radius} ${cy} C ${cx - radius} ${cy - oy} ${cx - ox} ${cy - radius} ${cx} ${cy - radius} C ${cx + ox} ${cy - radius} ${cx + radius} ${cy - oy} ${cx + radius} ${cy} C ${cx + radius} ${cy + oy} ${cx + ox} ${cy + radius} ${cx} ${cy + radius} C ${cx - ox} ${cy + radius} ${cx - radius} ${cy + oy} ${cx - radius} ${cy} Z`;
      }

      onDrawComplete(pathData, tool);
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentPath('');
      setPoints([]);
    },
    [isDrawing, tool, startPoint, currentPath, getPosition, onDrawComplete]
  );

  // 设置画布尺寸
  useEffect(() => {
    if (!visible || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, [visible]);

  // 添加事件监听
  useEffect(() => {
    if (!visible || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;

    // 鼠标事件
    canvas.addEventListener('mousedown', handleStart as any);
    canvas.addEventListener('mousemove', handleMove as any);
    canvas.addEventListener('mouseup', handleEnd as any);

    // 触摸事件
    canvas.addEventListener('touchstart', handleStart as any);
    canvas.addEventListener('touchmove', handleMove as any);
    canvas.addEventListener('touchend', handleEnd as any);

    return () => {
      canvas.removeEventListener('mousedown', handleStart as any);
      canvas.removeEventListener('mousemove', handleMove as any);
      canvas.removeEventListener('mouseup', handleEnd as any);
      canvas.removeEventListener('touchstart', handleStart as any);
      canvas.removeEventListener('touchmove', handleMove as any);
      canvas.removeEventListener('touchend', handleEnd as any);
    };
  }, [visible, handleStart, handleMove, handleEnd]);

  // 键盘事件:ESC 取消
  useEffect(() => {
    if (!visible) {
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, onCancel]);

  if (!visible) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        background: 'rgba(0,0,0,0.1)',
      }}
    >
      {/* 工具栏 */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'white',
          padding: '12px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: '14px', color: '#666' }}>
          {tool === 'pen' && '✏️ 画笔模式'}
          {tool === 'rect' && '▭ 矩形模式'}
          {tool === 'circle' && '○ 圆形模式'}
        </span>

        <div style={{ width: '1px', height: '20px', background: '#ddd' }} />

        <button
          onClick={onCancel}
          style={{
            padding: '6px 12px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            background: 'white',
            cursor: 'pointer',
          }}
        >
          取消 (ESC)
        </button>
      </div>

      {/* 绘图画布 */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          cursor: 'crosshair',
        }}
      />
    </div>
  );
};
