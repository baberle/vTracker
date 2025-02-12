/**
 * Gets current date for use in date input field
 */
export function getLocalDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

/**
 * Gets month number with days as the decimal
 */
export function getMonthNumber(date: Date): number {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const daysInMonth = new Date(date.getFullYear(), month, 0).getDate();
    return month + day / daysInMonth;
}
