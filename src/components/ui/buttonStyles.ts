const VARIANTS = {
  primary: "bg-primary text-white hover:bg-primary-dark",
  secondary: "border border-primary text-primary hover:bg-primary-light",
  ghost: "text-grey-700 hover:bg-grey-100",
};

export type ButtonVariant = keyof typeof VARIANTS;

/** Shared by `Button` and by links that look like buttons. */
export const buttonClass = (variant: ButtonVariant = "primary") =>
  `flex h-12 w-full items-center justify-center rounded-full px-4 text-base font-semibold transition-colors disabled:opacity-60 ${VARIANTS[variant]}`;
