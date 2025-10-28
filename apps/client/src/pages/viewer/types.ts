export const ViewerMode = {
  VIEW: 'view',
  ANNOTATION: 'annotation',
};

export type ViewerModeType = (typeof ViewerMode)[keyof typeof ViewerMode];
