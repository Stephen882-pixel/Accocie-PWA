import { Link, useLocation } from "react-router";
import { ChevronRight, KeyRound, MapPin } from "lucide-react";
import Alert from "@/components/feedback/Alert";
import Button from "@/components/ui/Button";
import { buttonClass } from "@/components/ui/buttonStyles";
import { useAuthUser } from "@/lib/auth/authStore";
import { useSignOut } from "@/features/auth/mutations/auth";

const SignedOut = () => (
  <section className="flex flex-col gap-6 py-8">
    <div className="flex flex-col gap-1.5">
      <h1 className="text-2xl font-bold">Your account</h1>
      <p className="text-[15px] text-grey-700">
        Sign in to check out and follow your orders.
      </p>
    </div>
    <div className="flex flex-col gap-3">
      <Link to="/login" className={buttonClass()}>
        Sign in
      </Link>
      <Link to="/register" className={buttonClass("secondary")}>
        Create account
      </Link>
    </div>
  </section>
);

const Account = () => {
  const user = useAuthUser();
  const signOut = useSignOut();
  const notice = (useLocation().state as { notice?: string } | null)?.notice;

  if (!user) return <SignedOut />;

  return (
    <section className="flex flex-col gap-6 py-8">
      {notice ? <Alert tone="success">{notice}</Alert> : null}

      <div className="flex items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-primary-light text-lg font-bold text-primary-dark">
          {user.firstName[0]}
          {user.lastName[0]}
        </div>
        <div className="flex min-w-0 flex-col">
          <h1 className="text-xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <p className="truncate text-sm text-grey-700">{user.email}</p>
        </div>
      </div>

      {user.role === "vendor_pending" ? (
        <p className="rounded-control bg-grey-100 px-3.5 py-3 text-sm text-grey-700">
          Your vendor application is being reviewed. You can keep shopping
          meanwhile.
        </p>
      ) : null}

      <Link
        to="/account/addresses"
        className="-mb-3 flex min-h-14 items-center gap-3 rounded-card border border-grey-300 px-4 text-[15px] font-medium"
      >
        <MapPin size={20} aria-hidden="true" className="text-grey-700" />
        <span className="flex-1">Addresses</span>
        <ChevronRight size={20} aria-hidden="true" className="text-grey-700" />
      </Link>

      <Link
        to="/account/password"
        className="flex min-h-14 items-center gap-3 rounded-card border border-grey-300 px-4 text-[15px] font-medium"
      >
        <KeyRound size={20} aria-hidden="true" className="text-grey-700" />
        <span className="flex-1">Change password</span>
        <ChevronRight size={20} aria-hidden="true" className="text-grey-700" />
      </Link>

      <Button
        variant="secondary"
        onClick={() => signOut.mutate()}
        isLoading={signOut.isPending}
      >
        Sign out
      </Button>
    </section>
  );
};

export default Account;
