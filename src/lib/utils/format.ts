/** "89999.00" → "KSh 89,999"; keeps cents only when there are some. */
export const formatPrice = (value: string | number) =>
  `KSh ${Number(value).toLocaleString("en-KE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;

/** "2026-11-14T10:12:00Z" → "14 Nov 2026". */
export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

/** "2026-11-14T10:12:00Z" → "Fri 14 Nov, 13:12" (local time). */
export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
