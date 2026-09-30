import { Link } from "react-router-dom";
import { Search, UserRound } from "lucide-react";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          ReSell<span className="text-emerald-600">Hub</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-700 transition hover:text-emerald-600"
          >
            Home
          </Link>

          <Link
            to="/products"
            className="text-sm font-medium text-slate-700 transition hover:text-emerald-600"
          >
            Products
          </Link>

          <Link
            to="/categories"
            className="text-sm font-medium text-slate-700 transition hover:text-emerald-600"
          >
            Categories
          </Link>

          <Link
            to="/dashboard"
            className="text-sm font-medium text-slate-700 transition hover:text-emerald-600"
          >
            Dashboard
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="hidden rounded-full p-2 text-slate-600 transition hover:bg-slate-100 sm:block"
            aria-label="Search"
          >
            <Search size={19} />
          </button>

          <Link
            to="/login"
            className="hidden rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 sm:block"
          >
            Login
          </Link>

          <button
            type="button"
            className="rounded-full border border-slate-200 p-2 text-slate-600 md:hidden"
            aria-label="Profile"
          >
            <UserRound size={19} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
