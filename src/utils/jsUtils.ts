export function toggleListItem<T>(list: T[], item: T): T[] {
  const index = list.indexOf(item);
  if (index === -1) {
    return [...list, item];
  }
  return list.filter((i) => i !== item);
}
