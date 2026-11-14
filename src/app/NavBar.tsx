import { Link } from "react-router";

const NavBar = () => (
  <header className="fixed inset-x-0 top-0 z-50 border-b border-grey-300 bg-background pt-[env(safe-area-inset-top)]">
    <div className="shell-column flex h-(--nav-h) items-center">
      <Link to="/" className="text-xl font-bold text-primary">
        Acocie
      </Link>
    </div>
  </header>
);

export default NavBar;
