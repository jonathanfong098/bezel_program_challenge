/**
 * Format a number as a dollar amount.
 * @param {number} amount - The amount to format.
 * @returns {string} A string representing the formatted dollar amount.
 */
export const formatDollarAmount = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  return formatter.format(amount);
};

/**
 * Converts cents to dollars.
 * @param {number} cents - The number of cents to convert.
 * @returns {number} The dollar equivalent of the given number of cents.
 */
export const centsToDollars = (cents: number): number => {
  return Number((cents / 100).toFixed(2));
};

/**
 * Converts commission rate from bips to a decimal percentage.
 * @param {number} bips - The commission rate in bips.
 * @returns {number} The commission rate as a decimal percentage.
 */
export const commissionRate = (bips: number): number => {
  return bips / 10000;
};

/**
 * Returns the given number formatted as a percentage string with two decimal places.
 * @param {number} num - The number to format as a percentage.
 * @returns {number} The formatted percentage string.
 */
export const formatAsPercentage = (num: number): string => {
  return `${(num * 100).toFixed(2)}%`;
};
