/**
 * Converts a Date object to a string in the format dd/mm/yy.
 * @param date - The Date object to be converted.
 * @returns A string representing the date in dd/mm/yy format.
 */
export const DateTimeToDateString = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0-11
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
  
    return `${day}/${month}/${year}`;
  };
  
export const UnixToDateString = (unix: number): string => {
    const date = new Date(unix); // Convert Unix timestamp to milliseconds
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() returns month from 0-11
    const year = String(date.getFullYear()).slice(-2); // Get last two digits of the year
  
    return `${day}/${month}/${year}`;
  };
//   // Example usage:
//   const date = new Date();
//   const dateString = convertDateTimeToDateString(date);
//   console.log(dateString); // Output: e.g., "15/07/24"
  