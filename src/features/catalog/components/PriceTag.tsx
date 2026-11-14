import { formatPrice } from "@/lib/utils/format";

type PriceTagProps = {
  price: string;
  comparePrice?: string | null;
  size?: "md" | "lg";
};

/** The price, with the old price struck through when it was higher. */
const PriceTag = ({ price, comparePrice, size = "md" }: PriceTagProps) => {
  const isDiscounted = comparePrice && Number(comparePrice) > Number(price);

  return (
    <span className="flex flex-wrap items-baseline gap-x-2">
      <span
        className={
          size === "lg" ? "text-2xl font-bold" : "text-[15px] font-bold"
        }
      >
        {formatPrice(price)}
      </span>
      {isDiscounted ? (
        <s className="text-xs text-grey-700">
          <span className="sr-only">Was </span>
          {formatPrice(comparePrice)}
        </s>
      ) : null}
    </span>
  );
};

export default PriceTag;
