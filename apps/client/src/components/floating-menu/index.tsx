import React from 'react';

interface FloatingToolbarProps {
  visible: boolean;
  position: { x: number; y: number };
  selectedText: string;
  onHighlight: (color: string) => void;
  onNote: () => void;
  onDraw: (tool: 'pen' | 'rect' | 'circle') => void;
  onClose: () => void;
}

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  visible,
  position,
  selectedText,
  onHighlight,
  onNote,
  onDraw,
  onClose,
}) => {
  if (!visible) return null;

  const colors = ['#ffeb3b', '#4caf50', '#2196f3', '#f44336', '#9c27b0'];

  return (
    <div
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        background: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        borderRadius: '8px',
        padding: '8px',
        display: 'flex',
        gap: '8px',
        zIndex: 10000,
        alignItems: 'center',
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* 高亮颜色选择器 */}
      <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onHighlight(color)}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: '2px solid #ccc',
              background: color,
              cursor: 'pointer',
              padding: 0,
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title={`高亮 - ${color}`}
          />
        ))}
      </div>

      {/* 分隔线 */}
      <div
        style={{
          width: '1px',
          height: '24px',
          background: '#ddd',
        }}
      />

      {/* 批注按钮 */}
      <button
        onClick={onNote}
        style={{
          padding: '6px 12px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: 'white',
          cursor: 'pointer',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f5f5f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
        }}
        title="添加批注"
      >
        <span>📝</span>
        <span>批注</span>
      </button>

      {/* 分隔线 */}
      <div
        style={{
          width: '1px',
          height: '24px',
          background: '#ddd',
        }}
      />

      {/* 绘图工具 */}
      <div style={{ display: 'flex', gap: '4px' }}>
        <button
          onClick={() => onDraw('pen')}
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            background: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
          title="画笔"
        >
          ✏️
        </button>
        <button
          onClick={() => onDraw('rect')}
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            background: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
          title="矩形"
        >
          ▭
        </button>
        <button
          onClick={() => onDraw('circle')}
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            background: 'white',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f5f5';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
          }}
          title="圆形"
        >
          ○
        </button>
      </div>

      {/* 分隔线 */}
      <div
        style={{
          width: '1px',
          height: '24px',
          background: '#ddd',
        }}
      />

      {/* 关闭按钮 */}
      <button
        onClick={onClose}
        style={{
          padding: '6px 10px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          background: 'white',
          cursor: 'pointer',
          fontSize: '16px',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#f5f5f5';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'white';
        }}
        title="关闭"
      >
        ✕
      </button>
    </div>
  );
};
