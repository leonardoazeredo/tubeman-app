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
  published_at?: Date;
}
