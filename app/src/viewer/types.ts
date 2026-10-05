// Annotation geometry is stored in "page units": viewport coordinates at scale 1
// (PDF points, origin top-left, page rotation already applied). That keeps it
// independent of zoom; converting to PDF space happens only on import/export.

export type Point = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };

export type Tool =
  | 'select'
  | 'highlight'
  | 'underline'
  | 'strikeout'
  | 'ink'
  | 'rect'
  | 'ellipse'
  | 'arrow'
  | 'text'
  | 'note'
  | 'signature';

export type Reply = { id: string; author: string; text: string; createdAt: number };

type Base = {
  id: string;
  page: number;
  color: string;
  opacity: number;
  author: string;
  createdAt: number;
  updatedAt: number;
  comment: string;
  replies: Reply[];
  resolved?: boolean;
  /**
   * Private annotations never leave this browser (not in live sessions, not in
   * share links unless explicitly chosen). Missing means private.
   */
  visibility?: 'private' | 'shared';
};

export const isShared = (a: { visibility?: 'private' | 'shared' }) => a.visibility === 'shared';

export type MarkupAnnotation = Base & {
  type: 'highlight' | 'underline' | 'strikeout';
  rects: Rect[];
  text: string;
};
export type InkAnnotation = Base & { type: 'ink'; paths: Point[][]; strokeWidth: number; signature?: boolean };
export type ShapeAnnotation = Base & { type: 'rect' | 'ellipse'; rect: Rect; strokeWidth: number; fill?: boolean };
export type ArrowAnnotation = Base & { type: 'arrow'; start: Point; end: Point; strokeWidth: number };
export type TextAnnotation = Base & { type: 'text'; rect: Rect; text: string; fontSize: number };
export type NoteAnnotation = Base & { type: 'note'; at: Point };

export type Annotation =
  | MarkupAnnotation
  | InkAnnotation
  | ShapeAnnotation
  | ArrowAnnotation
  | TextAnnotation
  | NoteAnnotation;

export type AnnotationType = Annotation['type'];

export type PageSize = { width: number; height: number };

export const TOOL_LABELS: Record<AnnotationType, string> = {
  highlight: 'Highlight',
  underline: 'Underline',
  strikeout: 'Strikethrough',
  ink: 'Drawing',
  rect: 'Rectangle',
  ellipse: 'Ellipse',
  arrow: 'Arrow',
  text: 'Text box',
  note: 'Note',
};

export const PALETTE = ['#FFD43B', '#69DB7C', '#4DABF7', '#F783AC', '#FF8787', '#9775FA', '#212529'];
