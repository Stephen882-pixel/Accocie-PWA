import { Navigate, useLocation, useNavigate } from "react-router";
import Alert from "@/components/feedback/Alert";
import AuthShell from "@/components/layout/AuthShell";
import { toApiError } from "@/lib/api/apiError";
import CodeForm from "@/features/auth/components/CodeForm";
import { useVerifyEmail } from "@/features/auth/mutations/auth";

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

  const email = state?.email;
  if (!email) return <Navigate to="/register" replace />;

  const handleSubmit = (otpCode: string) =>
    verify.mutate(
      { email, otpCode },
      {
        onSuccess: () =>
          navigate("/login", {
            replace: true,
            state: {
              email,
              notice: "Email verified. Sign in to start shopping.",
            },
          }),
      },
    );

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
      {state?.unverified ? (
        <Alert tone="info">
          Your email is not verified yet. Send yourself a new code below.
        </Alert>
      ) : null}
      {verify.error ? (
        <Alert tone="error">{toApiError(verify.error).message}</Alert>
      ) : null}

      <CodeForm
        email={email}
        purpose="signup"
        submitLabel="Verify email"
        isSubmitting={verify.isPending}
        onSubmit={handleSubmit}
        resendReady={state?.unverified}
      />
    </AuthShell>
  );
};

export default VerifyEmail;
