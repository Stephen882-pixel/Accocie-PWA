import type { ButtonHTMLAttributes } from "react";
import { buttonClass, type ButtonVariant } from "@/components/ui/buttonStyles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  isLoading?: boolean;
};

const Button = ({
  variant = "primary",
  isLoading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) => (
  <button
    className={`${buttonClass(variant)} ${className}`}
    disabled={disabled || isLoading}
    aria-busy={isLoading || undefined}
    {...props}
  >
    {isLoading ? "Please wait…" : children}
  </button>
);

export default Button;
