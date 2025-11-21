import React, { useEffect, useRef } from 'react';

interface CanvasContainerProps {
  id: string;
  width: number;
  height: number;
  style?: React.CSSProperties;
}

export const CanvasContainer: React.FC<CanvasContainerProps> = ({ id, width, height, style }) => {
  return (
    <div
      id={id}
      style={{
        width,
        height,
        position: 'relative',
        ...style,
      }}
    />
  );
};
