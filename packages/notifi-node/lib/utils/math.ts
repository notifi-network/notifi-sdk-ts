function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  )
    return false;

  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;
  }

  return true;
}

function customSort(a: any, b: any): number {
  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a).localeCompare(JSON.stringify(b));
  }
  return a < b ? -1 : a > b ? 1 : 0;
}

export function isEqual(value: any, other: any): boolean {
  if (value === other) return true;
  if (typeof value !== typeof other) return false;

  if (Array.isArray(value) && Array.isArray(other)) {
    if (value.length !== other.length) return false;

    const sortedValue = [...value].sort(customSort);
    const sortedOther = [...other].sort(customSort);

    for (let i = 0; i < sortedValue.length; i++) {
      if (!isEqual(sortedValue[i], sortedOther[i])) return false;
    }

    return true;
  }

  if (Array.isArray(value) || Array.isArray(other)) return false;

  return deepEqual(value, other);
}
