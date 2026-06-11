/**
 * Format number to Rupiah format with commas
 * 100000 → 100.000
 * 1500000 → 1.500.000
 */
export const formatNumberInput = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = String(value).replace(/\D/g, "");
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

/**
 * Parse formatted number back to integer
 * 100.000 → 100000
 */
export const parseFormattedNumber = (formatted) => {
  if (formatted === null || formatted === undefined || formatted === "") return 0;
  return parseInt(String(formatted).replace(/\D/g, ""), 10) || 0;
};
