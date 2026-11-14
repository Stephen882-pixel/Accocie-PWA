import { Link, useLocation } from "react-router";
import { Store } from "lucide-react";
import config from "@/config/index";
import { buttonClass } from "@/components/ui/buttonStyles";

type SellerState = { firstName?: string; role?: string } | null;

/** Shown when a vendor or admin signs in here. Their session was not kept. */
const SellerAccount = () => {
  const state = useLocation().state as SellerState;
  const role = state?.role?.replace("_", " ") ?? "seller";

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-background px-(--shell-gutter) pt-12 pb-8">
      <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary-light text-primary">
          <Store size={36} aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold">This is a seller account</h1>
        <p className="text-[15px] leading-[22px] text-grey-700">
          {state?.firstName ? `${state.firstName}, you` : "You"} signed in as{" "}
          {role === "admin" || role === "super admin" ? "an" : "a"}{" "}
          <b className="text-ink">{role}</b>. Your work happens on the Seller
          Dashboard, and this app is for shopping.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <a href={config.app.sellerDashboardUrl} className={buttonClass()}>
          Open Seller Dashboard
        </a>
        <Link to="/login" className={buttonClass("ghost")}>
          Sign in with a different account
        </Link>
      </div>
    </div>
  );
};

export default SellerAccount;
