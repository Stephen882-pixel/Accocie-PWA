import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import Alert from "@/components/feedback/Alert";
import AuthShell from "@/components/layout/AuthShell";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { toApiError } from "@/lib/api/apiError";
import { useForgotPassword } from "@/features/auth/mutations/auth";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const forgot = useForgotPassword();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = String(new FormData(event.currentTarget).get("email"));

    forgot.mutate(email, {
      onSuccess: () => navigate("/reset-code", { state: { email } }),
    });
  };

  return (
    <AuthShell
      backTo="/login"
      title="Forgot password"
      subtitle="Enter your email and we will send you a code to reset it."
    >
      {forgot.error ? (
        <Alert tone="error">{toApiError(forgot.error).message}</Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <Button type="submit" isLoading={forgot.isPending} className="mt-2">
          Send code
        </Button>
      </form>
    </AuthShell>
  );
};

export default ForgotPassword;
