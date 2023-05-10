import { useCallback, useState } from 'react';

export const usePagination = (initialRowsPerPage = 100) => {
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [currentPage, setCurrentPage] = useState(0);

  const onPageChange = useCallback(
    (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
      setCurrentPage(page);
    },
    [],
  );
  const onRowsPerPageChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      setCurrentPage(0);
      setRowsPerPage(Number.parseInt(event.target.value, 10));
    },
    [],
  );

  return {
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    onPageChange,
    onRowsPerPageChange,
  };
};
