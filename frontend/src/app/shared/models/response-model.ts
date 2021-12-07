export interface ResponseModel<T> {
  ResponseId: string;
  ResponseDateTime?: Date;
  Result: T;
  Message: string;
  Error?: string;
}
