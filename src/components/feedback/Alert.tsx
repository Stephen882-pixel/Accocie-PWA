import type { ReactNode } from "react";

const TONES = {
  error: "bg-error-50 text-error-700",
  success: "bg-success-50 text-success-700",
  info: "bg-grey-100 text-grey-700",
};

type AlertProps = {
  tone: keyof typeof TONES;
  children: ReactNode;
};

/** An inline message. Errors are announced immediately to screen readers. */
const Alert = ({ tone, children }: AlertProps) => (
  <div
    role={tone === "error" ? "alert" : "status"}
    className={`rounded-control px-3.5 py-3 text-sm leading-5 ${TONES[tone]}`}
  >
    {children}
  </div>
);

export default Alert;
