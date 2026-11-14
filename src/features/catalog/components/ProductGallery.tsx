import type { ProductImage } from "@/features/catalog/types/catalog";

/**
 * Swipeable photos. With more than one, each photo is slightly narrower than
 * the screen so the next one peeks in and shows there is more to swipe.
 */
const ProductGallery = ({
  images,
  name,
}: {
  images: ProductImage[];
  name: string;
}) => {
  const sorted = [...images].sort((a, b) => a.displayOrder - b.displayOrder);

  if (sorted.length === 0) {
    return <div className="aspect-square rounded-card bg-grey-100" />;
  }

  const width = sorted.length > 1 ? "w-[88%]" : "w-full";

  return (
    <div
      aria-label={`${name} photos`}
      className="-mx-(--shell-gutter) flex snap-x snap-mandatory gap-3 overflow-x-auto px-(--shell-gutter) [scrollbar-width:none]"
    >
      {sorted.map((image, index) => (
        <img
          key={image.id}
          src={image.imageUrl}
          alt={image.altText ?? `${name}, photo ${index + 1}`}
          loading={index === 0 ? "eager" : "lazy"}
          className={`${width} aspect-square shrink-0 snap-center rounded-card bg-grey-100 object-cover`}
        />
      ))}
    </div>
  );
};

export default ProductGallery;
