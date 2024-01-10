import { Stage, Layer, Rect } from 'react-konva';
import { Html } from 'react-konva-utils';

export function Board(props: any) {
  const { id, content, width, height } = props;

  function handleClick() {
    console.log(1);
  }

  return (
    <Stage width={ width } height={ height }>
      <Layer onClick={ handleClick } listening={ true } id={ `stage-${ id }` }>
        <Html
          divProps={ {
            style: {
              position: 'absolute',
              top: 10,
              left: 10,
            },
          } }
          onClick={ handleClick }
        >
          { content }
        </Html>
      </Layer>
    </Stage>
  );
}
