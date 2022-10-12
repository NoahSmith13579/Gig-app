/**
 *
 * Formats date into year-month-day for styling purposes
 *
 */
const dateFormatter = (date: Date) => {
    const month = date.getMonth();
    const day = date.getDate();
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
};

/**
 *  Adds an amount of time to a date to calculate a new date
 * @param date base date
 * @param number time in seconds
 * @returns {Date} new date
 */
const addSeconds = (startDate: Date, timeWorked: number) => {
    const UnixDate = startDate.getTime();

    const timeWorkedMs = timeWorked * 1000;
    const newDate = new Date(UnixDate + timeWorkedMs);

    return newDate;
};

/**
 *  Converts amount of time into hours to nearest decimal
 */
const secondsToHours = (sec: number) => {
    return parseFloat(Math.round(sec / 3600).toFixed(1));
};

export { dateFormatter, addSeconds, secondsToHours };
