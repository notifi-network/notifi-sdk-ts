export const areIdsEqual = <T extends Readonly<{ id: string }>>(
  ids: ReadonlyArray<string>,
  items: ReadonlyArray<T | undefined>,
): boolean => {
  const idSet = new Set(ids);
  return (
    items.length === idSet.size &&
    items.every((it) => it !== undefined && idSet.has(it.id))
  );
};
