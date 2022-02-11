export const assertNever = (value: never): never => {
  throw new Error();
};

// Tが関数のときの実装を思いつかなかったので、関数を受け取ったらneverエラーになるようにする
type NotFunction<T> = T extends Function ? never : T;
export const replaceElement = <T>(
  array: NotFunction<T>[],
  index: number,
  newElement: NotFunction<T> | ((old: NotFunction<T>) => NotFunction<T>)
): NotFunction<T>[] => {
  return array.map((e, i) => {
    if (i === index) {
      return typeof newElement === "function"
        ? (newElement as any)(e)
        : newElement;
    }
    return e;
  });
};
