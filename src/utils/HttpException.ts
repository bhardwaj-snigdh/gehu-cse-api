class HttpException extends Error {
  public status: number;
  public message: string;

  constructor(err: Error);
  constructor(httpErr: HttpException);
  constructor(status: number, message: string);
  constructor(arg1: any, arg2?: any) {
    if (arg1 instanceof HttpException) {
      super(arg1.message);
      this.status = arg1.status;
      this.message = arg1.message;
    } else if (arg1 instanceof Error) {
      super(arg1.message);
      this.status = 500;
      this.message = arg1.message;
    } else {
      super(arg2);
      this.status = arg1;
      this.message = arg2;
    }
  }
}

export default HttpException;
