import { Link } from "react-router-dom";
import { Leaf, ShieldCheck, Users, Wallet } from "lucide-react";
import usePublicStats from "../../hooks/usePublicStats";

const values = [
  {
    icon: Leaf,
    title: "Sustainable",
    text: "Every reused product means less waste and a smaller footprint.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted",
    text: "Listings are reviewed by admins before they reach the marketplace.",
  },
  {
    icon: Wallet,
    title: "Affordable",
    text: "Quality products at prices far below brand-new market rates.",
  },
  {
    icon: Users,
    title: "Community",
    text: "Buyers and sellers helping each other get more from what they own.",
  },
];

const About = () => {
  const stats = usePublicStats();

  const numbers = [
    { label: "Products", value: stats?.products },
    { label: "Sellers", value: stats?.sellers },
    { label: "Buyers", value: stats?.buyers },
    { label: "Completed orders", value: stats?.completedOrders },
  ];

  return (
    <div>
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:py-24">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            About us
          </p>
          <h1 className="mt-3 text-4xl font-extrabold text-slate-900 sm:text-5xl">
            A better way to buy and sell second-hand
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            ReSell Hub is an online marketplace where people list products they
            no longer need and buyers find useful items at honest prices. We
            reduce waste, create income for sellers, and make quality products
            accessible to everyone.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon size={24} />
              </div>
              <h2 className="mt-4 font-semibold text-slate-900">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 text-center sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {numbers.map(({ label, value }) => (
            <div key={label}>
              <p className="text-4xl font-extrabold text-emerald-400">
                {value === undefined ? "—" : value.toLocaleString("en-US")}
              </p>
              <p className="mt-1 text-slate-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="text-3xl font-bold text-slate-900">
          Ready to get started?
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Link
            to="/products"
            className="rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700"
          >
            Browse Products
          </Link>
          <Link
            to="/register"
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-600"
          >
            Join Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
