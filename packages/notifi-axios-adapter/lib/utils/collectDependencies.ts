const collectDependencies = (...dependencies: string[]): string => {
  const set = new Set<string>();
  const array = new Array<string>();
  dependencies?.forEach((dependency: string) => {
    if (!set.has(dependency)) {
      set.add(dependency);
      array.push(dependency);
    }
  });
  return array.join('\n');
};

export default collectDependencies;
