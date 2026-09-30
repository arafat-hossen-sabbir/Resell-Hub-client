import { Package, ShoppingCart, Store, Users } from "lucide-react";

const stats = [
  { label: "Total Products", value: "10,000+", icon: Package },
  { label: "Active Sellers", value: "2,500+", icon: Store },
  { label: "Happy Buyers", value: "7,000+", icon: Users },
  { label: "Completed Orders", value: "8,500+", icon: ShoppingCart },
];

const StatsSection = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-200">
              <Icon size={26} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{value}</p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
