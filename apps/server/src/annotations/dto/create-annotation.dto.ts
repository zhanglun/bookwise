export class CreateAnnotationDto {
  bookId: string;
  title: string;
  content: string;
  note: string;
  color: string;
  startOffset: number;
  endOffset: number;
}
