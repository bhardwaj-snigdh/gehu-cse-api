export default class JSONResponse {
  public error: string | null;
  public data: object | null;

  constructor(payload: string | object) {
    if (typeof payload === 'string') {
      this.error = payload;
      this.data = null;
    } else {
      this.error = null;
      this.data = payload;
    }
  }
}
