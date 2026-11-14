import { useEffect, useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router";
import Alert from "@/components/feedback/Alert";
import AuthShell from "@/components/layout/AuthShell";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { toApiError } from "@/lib/api/apiError";
import { useResendCode, useVerifyEmail } from "@/features/auth/mutations/auth";

// Matches the API's wait between resends.
const RESEND_COOLDOWN_SECONDS = 60;

type VerifyState = { email?: string; unverified?: boolean } | null;

/**
 * Reached right after sign-up (a code was just sent), or from Sign in when the
 * account was never verified (the old code has likely expired, so resending
 * is available straight away).
 */
const VerifyEmail = () => {
  const navigate = useNavigate();
  const state = useLocation().state as VerifyState;
  const verify = useVerifyEmail();
  const resend = useResendCode();
  const [secondsLeft, setSecondsLeft] = useState(
    state?.unverified ? 0 : RESEND_COOLDOWN_SECONDS,
  );

  useEffect(() => {
    if (secondsLeft <= 0) return undefined;
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const email = state?.email;
  if (!email) return <Navigate to="/register" replace />;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const otpCode = String(new FormData(event.currentTarget).get("otpCode"));

    verify.mutate(
      { email, otpCode },
      {
        onSuccess: () =>
          navigate("/login", {
            replace: true,
            state: { email, verified: true },
          }),
      },
    );
  };

  const handleResend = () => {
    resend.mutate(
      { email, purpose: "signup" },
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

  const error = verify.error ?? resend.error;

  return (
    <AuthShell
      backTo="/register"
      title="Check your email"
      subtitle={
        <>
          Enter the 6-digit code we sent to <b className="text-ink">{email}</b>.
          It expires in 10 minutes.
        </>
      }
    >
      {state?.unverified && !resend.isSuccess ? (
        <Alert tone="info">
          Your email is not verified yet. Send yourself a new code below.
        </Alert>
      ) : null}
      {resend.isSuccess ? (
        <Alert tone="success">We sent you a new code.</Alert>
      ) : null}
      {error ? <Alert tone="error">{toApiError(error).message}</Alert> : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Verification code"
          name="otpCode"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{6}"
          maxLength={6}
          title="The 6-digit code from your email"
          className="text-center text-2xl font-semibold tracking-[0.5em]"
          required
        />
        <Button type="submit" isLoading={verify.isPending} className="mt-2">
          Verify email
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
    </AuthShell>
  );
};

export default VerifyEmail;
