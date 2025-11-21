import React, { useEffect, useRef, useState } from 'react';
import { Circle, Layer, Line, Rect, Stage, Transformer } from 'react-konva';

const DrawingBoard = () => {
  const [tool, setTool] = useState('line');
  const [shapes, setShapes] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [color, setColor] = useState('#000000');
  const currentShape = useRef(null);
  const transformerRef = useRef(null);
  const layerRef = useRef(null);

  // 更新 Transformer 选中的节点
  useEffect(() => {
    if (selectedId && transformerRef.current && layerRef.current) {
      const selectedNode = layerRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId]);

  const handleMouseDown = (e) => {
    // 如果点击的是已有形状(不是 Stage 也不是 Layer),选中它
    const clickedOnEmpty = e.target === e.target.getStage() || e.target === layerRef.current;

    if (!clickedOnEmpty && e.target.id()) {
      setSelectedId(e.target.id());
      return;
    }

    // 点击空白处或开始绘制
    setSelectedId(null);
    setIsDrawing(true);

    const pos = e.target.getStage().getPointerPosition();
    const id = `shape-${Date.now()}`;

    if (tool === 'line') {
      currentShape.current = {
        id,
        tool: 'line',
        points: [pos.x, pos.y],
        stroke: color,
        strokeWidth: 2,
        tension: 0.5,
        lineCap: 'round',
        lineJoin: 'round',
      };
    } else if (tool === 'circle') {
      currentShape.current = {
        id,
        tool: 'circle',
        x: pos.x,
        y: pos.y,
        radius: 0,
        fill: color,
        startX: pos.x,
        startY: pos.y,
      };
    } else if (tool === 'rect') {
      currentShape.current = {
        id,
        tool: 'rect',
        x: pos.x,
        y: pos.y,
        width: 0,
        height: 0,
        fill: color,
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
      // 线条:添加新点
      const newPoints = lastShape.points.concat([pos.x, pos.y]);
      lastShape.points = newPoints;
    } else if (tool === 'circle') {
      // 圆形:从起点到当前点的距离作为半径
      const dx = pos.x - lastShape.startX;
      const dy = pos.y - lastShape.startY;
      const radius = Math.sqrt(dx * dx + dy * dy);
      // 圆心在起点和终点的中间
      lastShape.x = lastShape.startX + dx / 2;
      lastShape.y = lastShape.startY + dy / 2;
      lastShape.radius = radius / 2;
    } else if (tool === 'rect') {
      // 矩形:支持任意方向拖拽
      lastShape.width = pos.x - lastShape.x;
      lastShape.height = pos.y - lastShape.y;
    }

    setShapes([...shapes.slice(0, -1), lastShape]);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleShapeChange = (id, newAttrs) => {
    const newShapes = shapes.map((shape) => {
      if (shape.id === id) {
        return { ...shape, ...newAttrs };
      }
      return shape;
    });
    setShapes(newShapes);
  };

  return (
    <div>
      <div style={{ marginBottom: 10, padding: 10, background: '#f0f0f0' }}>
        <button
          onClick={() => setTool('line')}
          style={{ fontWeight: tool === 'line' ? 'bold' : 'normal' }}
        >
          线条
        </button>
        <button
          onClick={() => setTool('circle')}
          style={{ fontWeight: tool === 'circle' ? 'bold' : 'normal' }}
        >
          圆形
        </button>
        <button
          onClick={() => setTool('rect')}
          style={{ fontWeight: tool === 'rect' ? 'bold' : 'normal' }}
        >
          矩形
        </button>
        <button onClick={() => setShapes([])}>清空</button>

        <label style={{ marginLeft: 20 }}>
          颜色:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ marginLeft: 5 }}
          />
        </label>
      </div>

      <Stage
        width={window.innerWidth}
        height={window.innerHeight - 60}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <Layer ref={layerRef}>
          {shapes.map((shape) => {
            if (shape.tool === 'line') {
              return (
                <Line
                  key={shape.id}
                  id={shape.id}
                  {...shape}
                  onClick={() => setSelectedId(shape.id)}
                />
              );
            }
            if (shape.tool === 'circle') {
              return (
                <Circle
                  key={shape.id}
                  id={shape.id}
                  {...shape}
                  onClick={() => setSelectedId(shape.id)}
                  onDragEnd={(e) => {
                    handleShapeChange(shape.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    handleShapeChange(shape.id, {
                      x: node.x(),
                      y: node.y(),
                      radius: Math.max(node.radius() * scaleX, 5),
                    });

                    node.scaleX(1);
                    node.scaleY(1);
                  }}
                  draggable={selectedId === shape.id}
                />
              );
            }
            if (shape.tool === 'rect') {
              return (
                <Rect
                  key={shape.id}
                  id={shape.id}
                  {...shape}
                  onClick={() => setSelectedId(shape.id)}
                  onDragEnd={(e) => {
                    handleShapeChange(shape.id, {
                      x: e.target.x(),
                      y: e.target.y(),
                    });
                  }}
                  onTransformEnd={(e) => {
                    const node = e.target;
                    const scaleX = node.scaleX();
                    const scaleY = node.scaleY();

                    handleShapeChange(shape.id, {
                      x: node.x(),
                      y: node.y(),
                      width: Math.max(5, node.width() * scaleX),
                      height: Math.max(5, node.height() * scaleY),
                    });

                    node.scaleX(1);
                    node.scaleY(1);
                  }}
                  draggable={selectedId === shape.id}
                />
              );
            }
            return null;
          })}

          {selectedId && (
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // 限制最小尺寸
                if (newBox.width < 5 || newBox.height < 5) {
                  return oldBox;
                }
                return newBox;
              }}
            />
          )}
        </Layer>
      </Stage>
    </div>
  );
};

export default DrawingBoard;
