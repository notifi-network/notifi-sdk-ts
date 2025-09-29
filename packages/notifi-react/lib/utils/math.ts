function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (
    typeof a !== 'object' ||
    typeof b !== 'object' ||
    a === null ||
    b === null
  )
    return false;

  const objA = a as Record<string, unknown>;
  const objB = b as Record<string, unknown>;

  const keysA = Object.keys(objA).sort();
  const keysB = Object.keys(objB).sort();
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(objA[key], objB[key])) return false;
  }

  return true;
}

const comparables = ['string', 'number', 'boolean'] as const;
type Comparable = (typeof comparables)[number];

function customSort(a: unknown, b: unknown): number {
  if (typeof a === 'object' && typeof b === 'object') {
    return JSON.stringify(a).localeCompare(JSON.stringify(b));
  }

  const validItems = [a, b].filter((it): it is Comparable => {
    return comparables.includes(typeof it as Comparable);
  });

  if (validItems.length < 2 || typeof validItems[0] !== typeof validItems[1])
    return 0;

  return validItems[0] < validItems[1]
    ? -1
    : validItems[0] > validItems[1]
      ? 1
      : 0;
}

export function isEqual(value: unknown, other: unknown): boolean {
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
