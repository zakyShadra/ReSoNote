/**
 * Format number to Rupiah format with commas
 * 100000 → 100.000
 * 1500000 → 1.500.000
 */
export const formatNumberInput = (value) => {
  if (!value) return '';
  const num = value.replace(/\D/g, '');
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Parse formatted number back to integer
 * 100.000 → 100000
 */
export const parseFormattedNumber = (formatted) => {
  return parseInt(formatted.replace(/\./g, ''), 10) || 0;
};