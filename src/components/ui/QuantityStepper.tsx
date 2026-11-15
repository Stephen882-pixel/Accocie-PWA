type QuantityStepperProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  size?: "md" | "sm";
};

/** − 1 + with bounds. Each button keeps a 44px touch target at both sizes. */
const QuantityStepper = ({
  value,
  max,
  onChange,
  disabled = false,
  size = "md",
}: QuantityStepperProps) => (
  <div
    role="group"
    aria-label="Quantity"
    className={`flex shrink-0 items-center rounded-full border border-grey-400 ${
      size === "md" ? "h-12" : "h-10"
    }`}
  >
    <button
      type="button"
      aria-label="Decrease quantity"
      disabled={disabled || value <= 1}
      onClick={() => onChange(value - 1)}
      className="flex size-11 items-center justify-center text-xl disabled:text-grey-400"
    >
      −
    </button>
    <span aria-live="polite" className="w-6 text-center font-semibold">
      {value}
    </span>
    <button
      type="button"
      aria-label="Increase quantity"
      disabled={disabled || value >= max}
      onClick={() => onChange(value + 1)}
      className="flex size-11 items-center justify-center text-xl disabled:text-grey-400"
    >
      +
    </button>
  </div>
);

export default QuantityStepper;
