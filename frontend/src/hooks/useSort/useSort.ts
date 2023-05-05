import { useState } from 'react';

export const useSort = <T extends string>(
  defaultSortedBy: T,
  defaultSortOrder: 'asc' | 'desc',
) => {
  const [sortedBy, setSortedBy] = useState(defaultSortedBy);
  const [sortOrder, setSortOrder] = useState(defaultSortOrder);

  const getCellSortDirection = (id: T) => (id === sortedBy ? sortOrder : false);
  const getLabelIsActive = (id: T) => sortedBy === id;
  const getLabelSortDirection = (id: T) =>
    id === sortedBy ? sortOrder : 'asc';

  const onSortClick = (id: T) => () => {
    const isAsc = sortedBy === id && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortedBy(id);
  };

  return {
    getLabelIsActive,
    getCellSortDirection,
    getLabelSortDirection,
    onSortClick,
    sortedBy,
    sortOrder,
  };
};
