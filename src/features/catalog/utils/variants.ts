import type { ProductVariant } from "@/features/catalog/types/catalog";

export interface OptionGroup {
  name: string;
  values: string[];
}

/** `[{ storage: 128GB, color: Black }, { storage: 256GB, … }]` → one group per option. */
export const getOptionGroups = (variants: ProductVariant[]): OptionGroup[] => {
  const groups = new Map<string, Set<string>>();

  for (const variant of variants) {
    for (const [name, value] of Object.entries(variant.options ?? {})) {
      if (!groups.has(name)) groups.set(name, new Set());
      groups.get(name)!.add(value);
    }
  }

  return [...groups].map(([name, values]) => ({ name, values: [...values] }));
};

/** The variant whose options match every selected value, if one exists. */
export const findVariant = (
  variants: ProductVariant[],
  selected: Record<string, string>,
) =>
  variants.find((variant) =>
    Object.entries(variant.options ?? {}).every(
      ([name, value]) => selected[name] === value,
    ),
  );

/** "storage" → "Storage", "screen_size" → "Screen size". */
export const optionLabel = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, " ");
