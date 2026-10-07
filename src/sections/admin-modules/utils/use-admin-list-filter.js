import { useCallback, useMemo, useState } from 'react';

// ----------------------------------------------------------------------

export function useAdminListFilter(rows, { applyFilter, getSearchableText }) {
  const [search, setSearch] = useState('');
  const [listFilter, setListFilter] = useState('all');

  const filtered = useMemo(() => {
    let list = applyFilter ? rows.filter((row) => applyFilter(row, listFilter)) : rows;

    const q = search.trim().toLowerCase();
    if (q && getSearchableText) {
      list = list.filter((row) => getSearchableText(row).toLowerCase().includes(q));
    }

    return list;
  }, [rows, search, listFilter, applyFilter, getSearchableText]);

  const handleTabChange = useCallback((_event, newValue) => {
    setListFilter(newValue);
  }, []);

  const getTabCount = useCallback(
    (tab) => {
      if (!applyFilter) return rows.length;
      return rows.filter((row) => applyFilter(row, tab)).length;
    },
    [rows, applyFilter]
  );

  return {
    search,
    setSearch,
    listFilter,
    setListFilter,
    filtered,
    handleTabChange,
    getTabCount,
  };
}
