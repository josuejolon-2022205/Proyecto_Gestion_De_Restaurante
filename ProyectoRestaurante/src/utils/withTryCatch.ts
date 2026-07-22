export function withTryCatch<TArgs extends any[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  defaultValue: TReturn,
  errorMsg: string
): (...args: TArgs) => Promise<TReturn> {
  return async (...args: TArgs): Promise<TReturn> => {
    try {
      return await fn(...args);
    } catch (error) {
      console.log(errorMsg);
      return defaultValue;
    }
  };
}