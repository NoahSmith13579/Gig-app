import React, { useState } from 'react';
import Cost from '../entities/Cost';
import daysWorked from '../entities/DaysWorked';
import DayWorked from '../entities/DayWorked';
import Revenue from '../entities/Revenue';
import { dateFormatter } from '../helpers/dateHelper';
import AddCostBox from '../routes/Projects/components/AddCostBox';
import Trash from './icons/Trash';
import { v4 as uuid } from 'uuid';
import PaginationNav from '../components/PaginationNav';

// Make like useData like "const [currentPage, currentData, pageCount, goToPage] = usePagination(inputArray, pageSize); "
const usePagination = <T,>(
    inputArray: T[],
    pageSize: number
): [number, T[], number, Function] => {
    const [currentPage, setCurrentPage] = React.useState<number>(1);
    const [currentData, setCurrentData] = React.useState(
        inputArray.slice(0, pageSize)
    );
    const [pageCount, setPageCount] = React.useState<number>(1);
    const goToPage = setCurrentPage;

    React.useEffect(() => {
        const lastPageAmount = inputArray.length % pageSize;
        const itemsMinusLast = inputArray.length - lastPageAmount;
        const lastItemOnPage = currentPage * pageSize;
        const firstItemOnPage = lastItemOnPage - pageSize;
        const currentPages = inputArray.length / pageSize;

        if (pageCount !== currentPages) setPageCount(Math.ceil(currentPages));

        if (itemsMinusLast > lastPageAmount) {
            setCurrentData(inputArray.slice(firstItemOnPage, lastItemOnPage));
        }
        if (itemsMinusLast < lastPageAmount) {
            setCurrentData(inputArray.slice(firstItemOnPage));
        }
    }, [inputArray, currentPage, currentData, pageCount]);

    return [currentPage, currentData, pageCount, goToPage];
};

export default usePagination;
