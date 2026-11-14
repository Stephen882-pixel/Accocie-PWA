import { Navigate, useLocation, useNavigate } from "react-router";
import Alert from "@/components/feedback/Alert";
import AuthShell from "@/components/layout/AuthShell";
import { toApiError } from "@/lib/api/apiError";
import CodeForm from "@/features/auth/components/CodeForm";
import { useVerifyResetCode } from "@/features/auth/mutations/auth";

const ResetCode = () => {
  const navigate = useNavigate();
  const email = (useLocation().state as { email?: string } | null)?.email;
  const verify = useVerifyResetCode();

  if (!email) return <Navigate to="/forgot-password" replace />;

  const handleSubmit = (otpCode: string) =>
    verify.mutate(
      { email, otpCode },
      {
        onSuccess: (resetToken) =>
          navigate("/reset-password", {
            replace: true,
            state: { email, resetToken },
          }),
      },
    );

  return (
    <AuthShell
      backTo="/forgot-password"
      title="Enter your code"
      subtitle={
        // The API answers the same for unknown emails, so this cannot promise.
        <>
          If an account exists for <b className="text-ink">{email}</b>, we sent
          it a 6-digit code. It expires in 10 minutes.
        </>
      }
    >
      {verify.error ? (
        <Alert tone="error">{toApiError(verify.error).message}</Alert>
      ) : null}

      <CodeForm
        email={email}
        purpose="password_reset"
        submitLabel="Continue"
        isSubmitting={verify.isPending}
        onSubmit={handleSubmit}
      />
    </AuthShell>
  );
};

export default ResetCode;
