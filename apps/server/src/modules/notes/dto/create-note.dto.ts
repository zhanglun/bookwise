export interface NotePositionNode {
  path: number[];
  offset: number;
  text: string;
}
export interface NotePositionMetics {
  start: NotePositionNode;
  end: NotePositionNode;
}

export interface NoteStyleConfig {
  rectFill: string;
  lineStroke: string;
  strokeWidth: number;
}

export class CreateNoteDto {
  book_id: number;
  type: string;
  title: string;
  content?: string;
  position_metrics: NotePositionMetics;
  style_config: NoteStyleConfig;
}
