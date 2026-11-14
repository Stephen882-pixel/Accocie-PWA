import {
  optionLabel,
  type OptionGroup,
} from "@/features/catalog/utils/variants";

type VariantPickerProps = {
  groups: OptionGroup[];
  selected: Record<string, string>;
  onChange: (name: string, value: string) => void;
};

/** One row of choices per option (Storage, Color…). */
const VariantPicker = ({ groups, selected, onChange }: VariantPickerProps) => (
  <div className="flex flex-col gap-4">
    {groups.map((group) => (
      <fieldset key={group.name} className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-semibold">
          {optionLabel(group.name)}
          <span className="font-normal text-grey-700">
            {" "}
            · {selected[group.name]}
          </span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {group.values.map((value) => {
            const isSelected = selected[group.name] === value;
            return (
              <button
                key={value}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange(group.name, value)}
                className={`h-11 rounded-control px-4 text-sm ${
                  isSelected
                    ? "border-2 border-primary bg-primary-light font-semibold text-primary-dark"
                    : "border border-grey-400 font-medium"
                }`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </fieldset>
    ))}
  </div>
);

export default VariantPicker;
