import { useId, type InputHTMLAttributes } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
};

const TextField = ({
  label,
  hint,
  className = "",
  ...props
}: TextFieldProps) => {
  const id = useId();
  const hintId = `${id}-hint`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hint ? hintId : undefined}
        className={`h-12 rounded-control border border-grey-400 px-3.5 text-[15px] outline-none focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
        {...props}
      />
      {hint ? (
        <p id={hintId} className="text-xs text-grey-700">
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export default TextField;
