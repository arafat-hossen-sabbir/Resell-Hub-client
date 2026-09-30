import { Link } from "react-router-dom";
import { ArrowRight, Bike, Laptop, Smartphone, Sofa } from "lucide-react";

const featuredProducts = [
  {
    id: 1,
    title: "iPhone 12 (128GB)",
    price: "৳ 48,000",
    condition: "Like New",
    location: "Dhaka",
    icon: Smartphone,
    color: "from-emerald-100 to-teal-100",
  },
  {
    id: 2,
    title: "Dell Latitude 7420",
    price: "৳ 52,500",
    condition: "Good",
    location: "Chattogram",
    icon: Laptop,
    color: "from-sky-100 to-indigo-100",
  },
  {
    id: 3,
    title: "Wooden Study Table",
    price: "৳ 6,500",
    condition: "Good",
    location: "Sylhet",
    icon: Sofa,
    color: "from-amber-100 to-orange-100",
  },
  {
    id: 4,
    title: 'Mountain Bike 26"',
    price: "৳ 14,000",
    condition: "Fair",
    location: "Rajshahi",
    icon: Bike,
    color: "from-rose-100 to-pink-100",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Featured Products
            </h2>
            <p className="mt-2 text-slate-600">
              Hand-picked deals you might like.
            </p>
          </div>
          <Link
            to="/products"
            className="hidden items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 sm:inline-flex"
          >
            See all <ArrowRight size={18} />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map(
            ({ id, title, price, condition, location, icon: Icon, color }) => (
              <Link
                key={id}
                to={`/products/${id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${color}`}
                >
                  <Icon
                    size={64}
                    className="text-slate-700/70"
                    strokeWidth={1.25}
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
                    {condition}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-slate-900 group-hover:text-emerald-600">
                    {title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{location}</p>
                  <p className="mt-3 text-lg font-bold text-emerald-600">
                    {price}
                  </p>
                </div>
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
