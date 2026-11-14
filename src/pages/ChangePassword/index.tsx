import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import Alert from "@/components/feedback/Alert";
import AuthShell from "@/components/layout/AuthShell";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { toApiError } from "@/lib/api/apiError";
import { useChangePassword } from "@/features/auth/mutations/auth";
import {
  PASSWORD_HINT,
  PASSWORD_PATTERN,
} from "@/features/auth/utils/password";

const ChangePassword = () => {
  const navigate = useNavigate();
  const change = useChangePassword();
  const [mismatch, setMismatch] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const currentPassword = String(form.get("currentPassword"));
    const newPassword = String(form.get("newPassword"));
    const confirmPassword = String(form.get("confirmPassword"));

    setMismatch(newPassword !== confirmPassword);
    if (newPassword !== confirmPassword) return;

    change.mutate(
      { currentPassword, newPassword, confirmPassword },
      {
        onSuccess: () =>
          navigate("/account", {
            replace: true,
            state: { notice: "Password changed." },
          }),
      },
    );
  };

  return (
    <AuthShell
      backTo="/account"
      title="Change password"
      subtitle="You will be signed out on your other devices."
    >
      {change.error ? (
        <Alert tone="error">{toApiError(change.error).message}</Alert>
      ) : null}
      {mismatch ? <Alert tone="error">Passwords do not match.</Alert> : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Current password"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
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
        <Button type="submit" isLoading={change.isPending} className="mt-2">
          Change password
        </Button>
      </form>
    </AuthShell>
  );
};

export default ChangePassword;
