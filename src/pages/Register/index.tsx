import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import Alert from "@/components/feedback/Alert";
import AuthShell from "@/components/layout/AuthShell";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { toApiError } from "@/lib/api/apiError";
import { useRegister } from "@/features/auth/mutations/auth";
import {
  PASSWORD_HINT,
  PASSWORD_PATTERN,
} from "@/features/auth/utils/password";

const Register = () => {
  const navigate = useNavigate();
  const register = useRegister();
  const [mismatch, setMismatch] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();

    const password = String(form.get("password"));
    if (password !== String(form.get("confirmPassword"))) {
      setMismatch(true);
      return;
    }
    setMismatch(false);

    const email = value("email");
    const phone = value("phone");

    register.mutate(
      {
        firstName: value("firstName"),
        lastName: value("lastName"),
        email,
        password,
        ...(phone ? { phone } : {}),
      },
      { onSuccess: () => navigate("/verify-email", { state: { email } }) },
    );
  };

  const error = register.error ? toApiError(register.error).message : null;

  return (
    <AuthShell
      backTo="/account"
      title="Create account"
      subtitle="We will email you a code to confirm it is you."
    >
      {error ? <Alert tone="error">{error}</Alert> : null}
      {mismatch ? <Alert tone="error">Passwords do not match.</Alert> : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <TextField
            label="First name"
            name="firstName"
            autoComplete="given-name"
            minLength={2}
            required
          />
          <TextField
            label="Last name"
            name="lastName"
            autoComplete="family-name"
            minLength={2}
            required
          />
        </div>
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <TextField
          label="Phone number (optional)"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+254 712 345 678"
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
          pattern={PASSWORD_PATTERN}
          title={PASSWORD_HINT}
          hint={PASSWORD_HINT}
          required
        />
        <TextField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
        <Button type="submit" isLoading={register.isPending} className="mt-2">
          Create account
        </Button>
      </form>

      <p className="text-center text-sm text-grey-700">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
};

export default Register;
