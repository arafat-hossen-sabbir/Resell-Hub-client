import { BadgeCheck, Star } from "lucide-react";

const sellers = [
  { name: "Nusrat Jahan", rating: "4.9", sales: "128 sales", city: "Dhaka" },
  {
    name: "Sabbir Ahmed",
    rating: "4.8",
    sales: "96 sales",
    city: "Chattogram",
  },
  { name: "Maliha Rahman", rating: "4.8", sales: "84 sales", city: "Sylhet" },
  { name: "Tanvir Hasan", rating: "4.7", sales: "76 sales", city: "Rajshahi" },
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

const TrustedSellers = () => {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900">Trusted Sellers</h2>
        <p className="mt-2 text-slate-600">
          Sellers our community trusts and recommends.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {sellers.map((seller) => (
          <div
            key={seller.name}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-center transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl"
          >
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 text-2xl font-bold text-white shadow-lg shadow-emerald-200">
              {getInitials(seller.name)}
            </div>

            <div className="mt-4 flex items-center justify-center gap-1">
              <h3 className="font-semibold text-slate-900">{seller.name}</h3>
              <BadgeCheck size={18} className="text-emerald-600" />
            </div>
            <p className="mt-1 text-sm text-slate-500">{seller.city}</p>

            <div className="mt-4 flex items-center justify-center gap-4 border-t border-slate-100 pt-4 text-sm">
              <div className="flex items-center gap-1">
                <Star
                  size={16}
                  fill="currentColor"
                  className="text-amber-500"
                />
                <span className="font-semibold text-slate-800">
                  {seller.rating}
                </span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600">{seller.sales}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustedSellers;
