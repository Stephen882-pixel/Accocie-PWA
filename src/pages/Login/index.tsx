import type { FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import Alert from "@/components/feedback/Alert";
import AuthShell from "@/components/layout/AuthShell";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";
import { toApiError } from "@/lib/api/apiError";
import { useLogin } from "@/features/auth/mutations/auth";

/** `notice` is a success message from the screen that sent the user here. */
type LoginState = { email?: string; notice?: string; from?: string } | null;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LoginState;
  const login = useLogin();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));

    // A buyer's success needs no navigation here: GuestLayout moves them on.
    login.mutate(
      { email, password },
      {
        onSuccess: ({ user, isBuyer }) => {
          if (!isBuyer) {
            navigate("/seller-account", {
              replace: true,
              state: { firstName: user.firstName, role: user.role },
            });
          }
        },
        onError: (error) => {
          if (toApiError(error).code === "EMAIL_NOT_VERIFIED") {
            navigate("/verify-email", { state: { email, unverified: true } });
          }
        },
      },
    );
  };

  const error = login.error ? toApiError(login.error) : null;

  return (
    <AuthShell
      backTo="/account"
      title="Sign in"
      subtitle="Welcome back to Acocie Stores."
    >
      {state?.notice && !error ? (
        <Alert tone="success">{state.notice}</Alert>
      ) : null}
      {error && error.code !== "EMAIL_NOT_VERIFIED" ? (
        <Alert tone="error">{error.message}</Alert>
      ) : null}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <TextField
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={state?.email}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <Link
          to="/forgot-password"
          className="-mt-1 self-end py-2 text-sm font-medium text-primary"
        >
          Forgot password?
        </Link>
        <Button type="submit" isLoading={login.isPending}>
          Sign in
        </Button>
      </form>

      <p className="text-center text-sm text-grey-700">
        New to Acocie?{" "}
        <Link to="/register" className="font-semibold text-primary">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
};

export default Login;
