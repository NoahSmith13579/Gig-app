import React from 'react';
import ChevronLeft from '../components/icons/ChevronLeft';
import ChevronRight from '../components/icons/ChevronRight';

interface PageNavProps<T> {
  currentPage: number;
  currentData: T[];
  pageCount: number;
  goToPage(x: number): void;
  pageSize: number;
}

const Pagination = <T extends unknown>(
  props: React.PropsWithChildren<PageNavProps<T>>
): React.ReactElement => {
  const { currentPage, pageCount, goToPage } = props;

  // Navigation Display Logic

  const isLessthanPageCount = currentPage < pageCount;

  const isNotSameAsPageCount = currentPage !== pageCount;

  const isNotFirst = currentPage !== 1;

  // Will not display if currentPage is 4 or lower
  const isGreaterThan4 = isNotFirst && currentPage - 4 >= 0;

  // Will not display if currentPage is 3 or lower
  const isGreaterThan2 = currentPage - 3 >= 0;

  // Will not display if currentPage is 2 or lower
  const isGreaterThan3 = currentPage - 2 >= 0;

  // Will not display if pageCount is less than 2 or if currentPage is less than pageCount - 1
  const is1LessThanPageCount =
    isLessthanPageCount &&
    isNotSameAsPageCount &&
    pageCount >= 2 &&
    currentPage + 1 <= pageCount;

  //  Will not display if pageCount is less than 3 or if currentPage is less than pageCount - 2
  const is2LessThanPageCount =
    isLessthanPageCount &&
    isNotSameAsPageCount &&
    pageCount >= 3 &&
    currentPage + 2 <= pageCount;

  //  Will not display if pageCount is less than 4 or if currentPage is less than pageCount - 3
  const is3LessThanPageCount =
    isLessthanPageCount &&
    isNotSameAsPageCount &&
    pageCount >= 4 &&
    currentPage + 3 <= pageCount;

  return (
    <section className='pageNav'>
      {isGreaterThan4 && (
        <button className=' pageNavL' onClick={() => goToPage(1)}>
          <ChevronLeft /> First
        </button>
      )}
      {isGreaterThan2 && <button className=' pageNavDots'>...</button>}

      {isGreaterThan3 && (
        <button
          className='pageNavNotCurrent'
          onClick={() => goToPage(currentPage - 1)}
        >
          {currentPage - 1}
        </button>
      )}

      {<button className='pageNavCurrent'>{currentPage}</button>}

      {is1LessThanPageCount && (
        <button
          className='pageNavNotCurrent'
          onClick={() => goToPage(currentPage + 1)}
        >
          {currentPage + 1}
        </button>
      )}

      {is2LessThanPageCount && <button className='pageNavDots'>...</button>}

      {is3LessThanPageCount && (
        <button className='pageNavR' onClick={() => goToPage(pageCount)}>
          Last <ChevronRight />
        </button>
      )}
    </section>
  );
};

export default Pagination;
