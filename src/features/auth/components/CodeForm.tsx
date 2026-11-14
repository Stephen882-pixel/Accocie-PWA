import { useEffect, useState, type FormEvent } from "react";
import Alert from "@/components/feedback/Alert";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { toApiError } from "@/lib/api/apiError";
import { useResendCode } from "@/features/auth/mutations/auth";
import type { ResendCodePayload } from "@/features/auth/types/auth";

// Matches the API's wait between resends.
const RESEND_COOLDOWN_SECONDS = 60;

type CodeFormProps = {
  email: string;
  purpose: ResendCodePayload["purpose"];
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (otpCode: string) => void;
  /** Start with resend available, when the last code has likely expired. */
  resendReady?: boolean;
};

/** The 6-digit code field plus "Resend code" with its countdown. */
const CodeForm = ({
  email,
  purpose,
  submitLabel,
  isSubmitting,
  onSubmit,
  resendReady = false,
}: CodeFormProps) => {
  const resend = useResendCode();
  const [secondsLeft, setSecondsLeft] = useState(
    resendReady ? 0 : RESEND_COOLDOWN_SECONDS,
  );

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(String(new FormData(event.currentTarget).get("otpCode")));
  };

  const handleResend = () => {
    resend.mutate(
      { email, purpose },
      {
        onSuccess: () => setSecondsLeft(RESEND_COOLDOWN_SECONDS),
        onError: (error) => {
          const { retryAfter } = (toApiError(error).details ?? {}) as {
            retryAfter?: number;
          };
          if (retryAfter) setSecondsLeft(retryAfter);
        },
      },
    );
  };

  return (
    <>
      {resend.isSuccess ? (
        <Alert tone="success">We sent you a new code.</Alert>
      ) : null}
      {resend.error ? (
        <Alert tone="error">{toApiError(resend.error).message}</Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="6-digit code"
          name="otpCode"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          title="The 6-digit code from your email"
          className="text-center text-2xl font-semibold tracking-[0.5em]"
          required
        />
        <Button type="submit" isLoading={isSubmitting} className="mt-2">
          {submitLabel}
        </Button>
      </form>

      <Button
        type="button"
        variant="ghost"
        onClick={handleResend}
        disabled={secondsLeft > 0}
        isLoading={resend.isPending}
      >
        {secondsLeft > 0 ? `Resend code in ${secondsLeft}s` : "Resend code"}
      </Button>
    </>
  );
};

export default CodeForm;
