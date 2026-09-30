import { Link } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="text-2xl font-bold text-white">
            ReSell<span className="text-emerald-400">Hub</span>
          </Link>

          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            A trusted marketplace for buying and selling quality pre-owned
            products.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="#"
              aria-label="Facebook"
              className="rounded-full border border-slate-700 px-3 py-2 text-sm font-medium transition hover:border-emerald-400 hover:text-emerald-400"
            >
              Facebook
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="rounded-full border border-slate-700 px-3 py-2 text-sm font-medium transition hover:border-emerald-400 hover:text-emerald-400"
            >
              Instagram
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="rounded-full border border-slate-700 px-3 py-2 text-sm font-medium transition hover:border-emerald-400 hover:text-emerald-400"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Quick Links</h3>

          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link to="/" className="transition hover:text-emerald-400">
              Home
            </Link>
            <Link to="/products" className="transition hover:text-emerald-400">
              Products
            </Link>
            <Link
              to="/categories"
              className="transition hover:text-emerald-400"
            >
              Categories
            </Link>
            <Link to="/about" className="transition hover:text-emerald-400">
              About Us
            </Link>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Support</h3>

          <div className="mt-4 flex flex-col gap-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>Dhaka, Bangladesh</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} className="shrink-0 text-emerald-400" />
              <span>+880 1700-000000</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} className="shrink-0 text-emerald-400" />
              <span>support@resellhub.com</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-white">Marketplace</h3>

          <p className="mt-4 text-sm leading-6 text-slate-400">
            Give useful products a second life while finding great deals at
            affordable prices.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© 2026 ReSell Hub. All rights reserved.</p>
          <p>Built for a better second-hand marketplace.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
