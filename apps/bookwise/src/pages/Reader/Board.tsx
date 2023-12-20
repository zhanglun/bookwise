import { Stage, Layer, Rect } from 'react-konva';
import { Html } from 'react-konva-utils';

export function Board(props: any) {
  const { content, width, height } = props;
  return (
    <Stage width={ width } height={ height }>
      <Layer>
        <Html
          divProps={ {
            style: {
              position: 'absolute',
              top: 10,
              left: 10,
            },
          } }
        >
          { content }
        </Html>
      </Layer>
    </Stage>
  );
}
