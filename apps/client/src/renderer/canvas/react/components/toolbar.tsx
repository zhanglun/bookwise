import React, { useState } from 'react';
import { DrawingEngine } from '../../core/drawing-engine';
import { ToolType } from '../../core/types';

interface ToolbarProps {
  engine: DrawingEngine | null;
}

export const Toolbar: React.FC<ToolbarProps> = ({ engine }) => {
  const [currentTool, setCurrentTool] = useState<ToolType>('select');
  const [color, setColor] = useState('#000000');

  const handleToolChange = (tool: ToolType) => {
    setCurrentTool(tool);
    engine?.setTool(tool);
  };

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    engine?.setColor(newColor);
  };

  const handleClear = () => {
    engine?.clear();
  };

  const disabled = !engine;

  return (
    <div style={{ marginBottom: 10, padding: 10, background: '#f0f0f0' }}>
      <button
        onClick={() => handleToolChange('select')}
        style={{ fontWeight: currentTool === 'select' ? 'bold' : 'normal' }}
        disabled={disabled}
      >
        选择
      </button>
      <button
        onClick={() => handleToolChange('line')}
        style={{ fontWeight: currentTool === 'line' ? 'bold' : 'normal' }}
        disabled={disabled}
      >
        线条
      </button>
      <button
        onClick={() => handleToolChange('circle')}
        style={{ fontWeight: currentTool === 'circle' ? 'bold' : 'normal' }}
        disabled={disabled}
      >
        圆形
      </button>
      <button
        onClick={() => handleToolChange('rect')}
        style={{ fontWeight: currentTool === 'rect' ? 'bold' : 'normal' }}
        disabled={disabled}
      >
        矩形
      </button>
      <button onClick={handleClear} disabled={disabled}>
        清空
      </button>

      <label style={{ marginLeft: 20 }}>
        颜色:
        <input
          type="color"
          value={color}
          onChange={(e) => handleColorChange(e.target.value)}
          style={{ marginLeft: 5 }}
          disabled={disabled}
        />
      </label>
    </div>
  );
};
