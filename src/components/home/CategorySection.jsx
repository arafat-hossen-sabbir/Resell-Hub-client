import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bike,
  Car,
  Laptop,
  Shirt,
  Smartphone,
  Sofa,
} from "lucide-react";
import api from "../../api/axios";

export const categoryIcons = {
  Electronics: Laptop,
  "Mobile Phones": Smartphone,
  Furniture: Sofa,
  Fashion: Shirt,
  Vehicles: Car,
  Sports: Bike,
};

const CategorySection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;

    api
      .get("/public/categories")
      .then(({ data }) => {
        if (active) setCategories(data.categories);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Popular Categories
          </h2>
          <p className="mt-2 text-slate-600">
            Find exactly what you are looking for.
          </p>
        </div>
        <Link
          to="/categories"
          className="hidden items-center gap-1 font-semibold text-emerald-600 hover:text-emerald-700 sm:inline-flex"
        >
          View all <ArrowRight size={18} />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map(({ name, count }, index) => {
          const Icon = categoryIcons[name] || Laptop;

          return (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <Link
                to={`/products?category=${encodeURIComponent(name)}`}
                className="group block h-full rounded-2xl border border-slate-200 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <Icon size={26} />
                </div>
                <h3 className="mt-4 font-semibold text-slate-900">{name}</h3>
                <p className="mt-1 text-xs text-slate-500">
                  {count} {count === 1 ? "item" : "items"}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default CategorySection;
