import React from 'react';
import { CanvasContainer } from './react/components/drawing-canvas';
import { Toolbar } from './react/components/toolbar';
import { useDrawingEngine } from './react/hooks/use-drawing-engine';

// 单个画板组件
const DrawingBoard: React.FC<{ id: string; title: string }> = ({ id, title }) => {
  const engine = useDrawingEngine({
    containerId: id,
    width: 600,
    height: 400,
  });

  return (
    <div style={{ border: '1px solid #ccc', padding: 10, margin: 10 }}>
      <h3>{title}</h3>
      <Toolbar engine={engine} />
      <CanvasContainer id={id} width={600} height={400} />
    </div>
  );
};

// 主应用 - 多个画板实例
export const App: React.FC = () => {
  return (
    <div>
      <h1>多画板示例</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <DrawingBoard id="canvas-1" title="画板 1" />
        <DrawingBoard id="canvas-2" title="画板 2" />
        <DrawingBoard id="canvas-3" title="画板 3" />
      </div>
    </div>
  );
};

export default App;
