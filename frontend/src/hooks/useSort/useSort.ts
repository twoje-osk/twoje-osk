import { useCallback, useState } from 'react';

export const useSort = <T extends string>(
  defaultSortedBy: T,
  defaultSortOrder: 'asc' | 'desc',
) => {
  const [sortedBy, setSortedBy] = useState(defaultSortedBy);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);

  const getCellSortDirection = useCallback(
    (id: T) => (id === sortedBy ? sortOrder : false),
    [sortOrder, sortedBy],
  );
  const getLabelIsActive = useCallback((id: T) => sortedBy === id, [sortedBy]);
  const getLabelSortDirection = useCallback(
    (id: T) => (id === sortedBy ? sortOrder : 'asc'),
    [sortOrder, sortedBy],
  );

  const onSortClick = useCallback(
    (id: T) => () => {
      const isAsc = sortedBy === id && sortOrder === 'asc';
      setSortOrder(isAsc ? 'desc' : 'asc');
      setSortedBy(id);
    },
    [sortOrder, sortedBy],
  );

  return {
    getLabelIsActive,
    getCellSortDirection,
    getLabelSortDirection,
    onSortClick,
    sortedBy,
    sortOrder,
  };
};
