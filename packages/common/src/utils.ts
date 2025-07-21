export const sanitize = <T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> => {
  if (!obj) {
    return obj;
  }
  const result = {} as Omit<T, K>;

  (Object.keys(obj) as (keyof T)[]).forEach((key) => {
    if (!keys.includes(key as K)) {
      (result as any)[key] = obj[key];
    }
  });

  return result;
};
