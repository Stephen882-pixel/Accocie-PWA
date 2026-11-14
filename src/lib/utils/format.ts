/** "89999.00" → "KSh 89,999"; keeps cents only when there are some. */
export const formatPrice = (value: string | number) =>
  `KSh ${Number(value).toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
