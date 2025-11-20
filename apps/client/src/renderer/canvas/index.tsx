import React, { useRef, useState } from 'react';
import { Circle, Layer, Rect, Stage } from 'react-konva';

export default function App() {
  const [tool, setTool] = useState('line'); // 'line', 'circle', 'rect'
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentShape = useRef(null);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const pos = e.target.getStage().getPointerPosition();

    if (tool === 'line') {
      currentShape.current = {
        tool: 'line',
        points: [pos.x, pos.y],
        stroke: 'black',
        strokeWidth: 2,
      };
    } else if (tool === 'circle') {
      currentShape.current = {
        tool: 'circle',
        x: pos.x,
        y: pos.y,
        radius: 0,
        fill: 'blue',
      };
    } else if (tool === 'rect') {
      currentShape.current = {
        tool: 'rect',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        fill: 'red',
      };
    }

    setShapes([...shapes, currentShape.current]);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) {
      return;
    }

    const pos = e.target.getStage().getPointerPosition();
    const lastShape = shapes[shapes.length - 1];

    if (tool === 'line') {
      const newPoints = lastShape.points.concat([pos.x, pos.y]);
      lastShape.points = newPoints;
    } else if (tool === 'circle') {
      const dx = pos.x - lastShape.x;
      const dy = pos.y - lastShape.y;
      lastShape.radius = Math.sqrt(dx * dx + dy * dy);
    } else if (tool === 'rect') {
      lastShape.width = pos.x - lastShape.x;
      lastShape.height = pos.y - lastShape.y;
    }

    setShapes([...shapes.slice(0, -1), lastShape]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setTool('line')}>线条</button>
        <button onClick={() => setTool('circle')}>圆形</button>
        <button onClick={() => setTool('rect')}>矩形</button>
        <button onClick={() => setShapes([])}>清空</button>
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 50}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer>
          {shapes.map((shape, i) => {
            if (shape.tool === 'line') {
              return <Line key={i} {...shape} />;
            }
            if (shape.tool === 'circle') {
              return <Circle key={i} {...shape} />;
            }
            if (shape.tool === 'rect') {
              return <Rect key={i} {...shape} />;
            }
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
}
