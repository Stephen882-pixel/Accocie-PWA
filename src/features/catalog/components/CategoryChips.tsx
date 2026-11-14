import { useCategories } from "@/features/catalog/queries/catalog";
import type { Category } from "@/features/catalog/types/catalog";

type CategoryChipsProps = {
  selected?: string;
  onSelect: (categoryId?: string) => void;
};

// Products belong to the innermost categories ("Men's Fashion", not
// "Fashion"), and the API filters on the exact category, so only those
// are offered.
const leafCategories = (categories: Category[]) =>
  categories.filter(
    (category) => !categories.some((other) => other.parentId === category.id),
  );

const chipClass = (isSelected: boolean) =>
  `h-10 shrink-0 rounded-full border px-4 text-sm whitespace-nowrap ${
    isSelected
      ? "border-primary bg-primary-light font-semibold text-primary-dark"
      : "border-grey-300 font-medium text-grey-700"
  }`;

/** A single-select row that scrolls sideways rather than wrapping. */
const CategoryChips = ({ selected, onSelect }: CategoryChipsProps) => {
  const { data: categories = [] } = useCategories();

  return (
    <div
      role="group"
      aria-label="Categories"
      className="-mx-(--shell-gutter) flex gap-2 overflow-x-auto px-(--shell-gutter) [scrollbar-width:none]"
    >
      <button
        type="button"
        aria-pressed={!selected}
        onClick={() => onSelect(undefined)}
        className={chipClass(!selected)}
      >
        All
      </button>
      {leafCategories(categories).map((category) => (
        <button
          key={category.id}
          type="button"
          aria-pressed={selected === category.id}
          onClick={() => onSelect(category.id)}
          className={chipClass(selected === category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryChips;
