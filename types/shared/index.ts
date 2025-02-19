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
