export function addressEllipsis(
  str: string | undefined,
  index?: number,
): string | undefined {
  index = index || 6;

  if (!str || str.length < 11) {
    return str;
  }

  return str.slice(0, index) + '...' + str.slice(str.length - index);
}
