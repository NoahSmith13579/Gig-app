import React from 'react';

const usePagination = <T,>(
  inputArray: T[],
  pageSize: number
): [number, T[], number, Function] => {
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const pageCount = Math.max(1, Math.ceil(inputArray.length / pageSize));
  const firstItemOnPage = (currentPage - 1) * pageSize;
  const currentData = inputArray.slice(firstItemOnPage, firstItemOnPage + pageSize);
  const goToPage = setCurrentPage;

  return [currentPage, currentData, pageCount, goToPage];
};

export default usePagination;
