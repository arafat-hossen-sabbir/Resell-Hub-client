import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Recycle,
  ShieldCheck,
  Smartphone,
  Star,
  Tag,
  Wallet,
} from "lucide-react";
import usePublicStats from "../../hooks/usePublicStats";

const show = (value) =>
  value === undefined || value === null ? "—" : value.toLocaleString("en-US");

const HeroSection = () => {
  const stats = usePublicStats();

  const items = [
    { label: "Products Listed", value: stats?.products },
    { label: "Trusted Sellers", value: stats?.sellers },
    { label: "Completed Orders", value: stats?.completedOrders },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-sm font-medium text-emerald-700 shadow-sm">
            <Recycle size={16} />
            Buy Smart. Sell Easy.
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Give pre-owned products a{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              new life
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Discover quality second-hand products from trusted sellers or turn
            the things you no longer need into extra income.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
            >
              Browse Products
              <ArrowRight size={18} />
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-emerald-600 hover:text-emerald-600"
            >
              <Tag size={18} />
              Start Selling
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-8">
            {items.map(({ label, value }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.12 }}
              >
                <p className="text-2xl font-bold text-slate-900">
                  {show(value)}
                </p>
                <p className="text-sm text-slate-500">{label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative mx-auto hidden w-full max-w-md lg:block"
        >
          <div className="absolute inset-0 rotate-3 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-400 opacity-20" />

          <div className="relative rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="flex h-56 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100">
              <Smartphone
                size={96}
                className="text-emerald-600"
                strokeWidth={1.25}
              />
            </div>

            <div className="mt-5 flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">
                  iPhone 12 (128GB)
                </h3>
                <p className="mt-1 text-sm text-slate-500">Like New · Dhaka</p>
              </div>
              <p className="text-lg font-bold text-emerald-600">৳ 48,000</p>
            </div>

            <div className="mt-4 flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
              <span className="ml-2 text-sm text-slate-500">
                Trusted seller
              </span>
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute -left-6 top-10 flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-xl"
          >
            <ShieldCheck size={20} className="text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">Verified</span>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 3.4 }}
            className="absolute -right-4 bottom-12 flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-xl"
          >
            <Wallet size={20} className="text-emerald-600" />
            <span className="text-sm font-medium text-slate-700">
              Save up to 70%
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
