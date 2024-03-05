import type { NoteType as PrismaNoteType } from '@prisma/client';

// export const NoteType {
//   Text,
//   Rect,
// }

export class CreateNoteDto {
  book_id: number;
  title: string;
  content: string;
  type: PrismaNoteType;
}
