import type { NoteType as PrismaNoteType } from '@prisma/client';

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
  type: PrismaNoteType;
  title: string;
  content?: string;
  position_metics: NotePositionMetics;
  style_config: NoteStyleConfig;
}
