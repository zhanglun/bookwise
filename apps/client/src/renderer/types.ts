export interface Book {
  sections: Section[];
  metadata?: any;
  rendition?: { layout?: string };
  resolveHref?: (href: string) => Promise<Resolution> | Resolution;
  destroy?: () => void;
}

export type SectionContent = string | { src: string; onZoom?: (args: any[]) => void };

export interface Section {
  id: string | number;
  load: () => Promise<SectionContent>;
  unload?: () => void;
  createDocument?: () => Promise<Document>;
}

export interface Resolution {
  index: number;
  anchor?: (doc: Document) => Element | Range | null;
}

export interface RendererState {
  currentIndex: number;
  isLoading: boolean;
  error: Error | null;
}
