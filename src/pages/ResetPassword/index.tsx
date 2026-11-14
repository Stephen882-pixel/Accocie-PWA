import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router";
import Alert from "@/components/feedback/Alert";
import AuthShell from "@/components/layout/AuthShell";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { toApiError } from "@/lib/api/apiError";
import { useResetPassword } from "@/features/auth/mutations/auth";
import {
  PASSWORD_HINT,
  PASSWORD_PATTERN,
} from "@/features/auth/utils/password";

type ResetState = { email?: string; resetToken?: string } | null;

const ResetPassword = () => {
  const navigate = useNavigate();
  const state = useLocation().state as ResetState;
  const reset = useResetPassword();
  const [mismatch, setMismatch] = useState(false);

  const resetToken = state?.resetToken;
  if (!resetToken) return <Navigate to="/forgot-password" replace />;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const newPassword = String(form.get("newPassword"));
    const confirmPassword = String(form.get("confirmPassword"));

    setMismatch(newPassword !== confirmPassword);
    if (newPassword !== confirmPassword) return;

    reset.mutate(
      { resetToken, newPassword, confirmPassword },
      {
        onSuccess: () =>
          navigate("/login", {
            replace: true,
            state: {
              email: state?.email,
              notice: "Password reset. Sign in with your new password.",
            },
          }),
      },
    );
  };

  const error = reset.error ? toApiError(reset.error) : null;

  return (
    <AuthShell
      backTo="/login"
      title="Set a new password"
      subtitle="You will be signed out on your other devices."
    >
      {error ? <Alert tone="error">{error.message}</Alert> : null}
      {mismatch ? <Alert tone="error">Passwords do not match.</Alert> : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="New password"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          pattern={PASSWORD_PATTERN}
          title={PASSWORD_HINT}
          hint={PASSWORD_HINT}
          required
        />
        <TextField
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
        <Button type="submit" isLoading={reset.isPending} className="mt-2">
          Reset password
        </Button>
      </form>

      {error?.code === "INVALID_RESET_TOKEN" ? (
        <Link
          to="/forgot-password"
          className="text-center text-sm font-semibold text-primary"
        >
          Request a new code
        </Link>
      ) : null}
    </AuthShell>
  );
};

export default ResetPassword;
