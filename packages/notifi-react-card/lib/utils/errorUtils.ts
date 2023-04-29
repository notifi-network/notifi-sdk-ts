export function getErrorMessageKey(err: unknown): string {
  let errMsg: string;
  if (err instanceof Error) {
    errMsg = err.message;
  } else if (typeof err === 'string') {
    errMsg = err;
  } else {
    errMsg = 'unknown error';
  }
  return errMsg;
}
