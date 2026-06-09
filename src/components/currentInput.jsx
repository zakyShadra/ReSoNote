import { formatNumberInput, parseFormattedNumber } from "../utils/formatNumber.js";

/**
 * CurrencyInput - auto-formats to 100.000 as user types
 */
function CurrencyInput({
  value,
  onChange,
  placeholder,
  className,
  ...props
}) {
  const handleChange = (e) => {
    const raw = e.target.value;
    const formatted = formatNumberInput(raw);
    onChange?.(parseFormattedNumber(formatted));
  };

  const displayValue = value ? formatNumberInput(String(value)) : "";

  return (
    <input
      type="text"
      inputMode="numeric"
      pattern="[0-9.]"
      placeholder={placeholder}
      value={displayValue}
      onChange={handleChange}
      className={className}
      {...props}
    />
  );
}

export default CurrencyInput;