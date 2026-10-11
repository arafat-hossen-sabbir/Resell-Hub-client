import { motion } from "framer-motion";
import { Package, ShoppingCart, Store, Users } from "lucide-react";
import usePublicStats from "../../hooks/usePublicStats";

const StatsSection = () => {
  const stats = usePublicStats();

  const items = [
    { label: "Total Products", value: stats?.products, icon: Package },
    { label: "Total Sellers", value: stats?.sellers, icon: Store },
    { label: "Total Buyers", value: stats?.buyers, icon: Users },
    {
      label: "Completed Orders",
      value: stats?.completedOrders,
      icon: ShoppingCart,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map(({ label, value, icon: Icon }, index) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: index * 0.1 }}
            className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-200">
              <Icon size={26} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">
                {value === undefined ? "—" : value.toLocaleString("en-US")}
              </p>
              <p className="text-sm text-slate-500">{label}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
