export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors?: ValidationError[];
    };

export interface ValidationError {
  field: string;
  message: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  description: string;
  publishedAt: Date;
}

export interface PrivatePageChildProps {
  userId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export type PrivatePageChildren =
  | React.ReactElement<PrivatePageChildProps>
  | React.ReactElement<PrivatePageChildProps>[];
