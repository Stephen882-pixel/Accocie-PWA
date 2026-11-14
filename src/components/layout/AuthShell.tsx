import type { ReactNode } from "react";
import { Link } from "react-router";
import { ChevronLeft } from "lucide-react";

type AuthShellProps = {
  backTo: string;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
};

/** The frame for sign-in screens: no app bars, a back link and a narrow column. */
const AuthShell = ({ backTo, title, subtitle, children }: AuthShellProps) => (
  <div className="min-h-svh bg-background pt-[env(safe-area-inset-top)]">
    <div className="mx-auto w-full max-w-md px-(--shell-gutter)">
      <header className="flex h-(--nav-h) items-center">
        <Link
          to={backTo}
          aria-label="Back"
          className="-ml-3 flex size-11 items-center justify-center"
        >
          <ChevronLeft size={22} aria-hidden="true" />
        </Link>
      </header>
      <main className="flex flex-col gap-6 pb-10">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[28px] leading-9 font-bold">{title}</h1>
          {subtitle ? (
            <p className="text-[15px] leading-[22px] text-grey-700">
              {subtitle}
            </p>
          ) : null}
        </div>
        {children}
      </main>
    </div>
  </div>
);

export default AuthShell;
