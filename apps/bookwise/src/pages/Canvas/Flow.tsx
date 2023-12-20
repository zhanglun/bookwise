import { useMemo, useState } from "react";
import ReactFlow, { MiniMap, Controls, ControlButton, Background, Panel } from 'reactflow';
import 'reactflow/dist/style.css';

import defaultNodes from './nodes.js';
import defaultEdges from './edges.js';
import { MagicWandIcon } from "@radix-ui/react-icons";
import { NoteNode } from "@/pages/Canvas/Nodes/Note";


const nodeColor = (node) => {
  switch (node.type) {
    case 'input':
      return '#6ede87';
    case 'output':
      return '#6865A5';
    default:
      return '#ff0072';
  }
};


function Flow() {
  const [ variant, setVariant ] = useState('cross');
  const nodeTypes = useMemo(() => ({ NoteNode: NoteNode }), []);

  return (
    <ReactFlow
      defaultNodes={ defaultNodes } defaultEdges={ defaultEdges } fitView
      proOptions={ { hideAttribution: true } }
      nodeTypes={ nodeTypes }
    >
      <MiniMap nodeColor={ nodeColor } nodeStrokeWidth={ 3 } zoomable pannable/>
      <Background color="#ccc" variant={ variant }/>
      <Controls position={ "top-center" }>
        <ControlButton onClick={ () => alert('Something magical just happened. ✨') }>
          <MagicWandIcon/>
        </ControlButton>
      </Controls>
      <Panel>
        <div>variant:</div>
        <button onClick={ () => setVariant('dots') }>dots</button>
        <button onClick={ () => setVariant('lines') }>lines</button>
        <button onClick={ () => setVariant('cross') }>cross</button>
      </Panel>
    </ReactFlow>
  );
}

export default Flow;
