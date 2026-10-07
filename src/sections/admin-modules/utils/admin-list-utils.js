// ----------------------------------------------------------------------

export function normalizeOrders(list) {
  return [...list]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item, index) => ({ ...item, order: index + 1 }));
}

export function swapRowOrder(list, id, direction) {
  const sorted = [...list].sort((a, b) => a.order - b.order);
  const index = sorted.findIndex((r) => r.id === id);
  const target = direction === 'up' ? index - 1 : index + 1;
  if (target < 0 || target >= sorted.length) {
    return list;
  }
  const next = [...sorted];
  [next[index], next[target]] = [next[target], next[index]];
  return normalizeOrders(next);
}
