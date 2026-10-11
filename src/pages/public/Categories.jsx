import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Laptop } from "lucide-react";
import api from "../../api/axios";
import { categoryIcons } from "../../components/home/CategorySection";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api
      .get("/public/categories")
      .then(({ data }) => {
        if (active) setCategories(data.categories);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Browse
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            All Categories
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            Pick a category to explore the latest pre-owned products.
          </p>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? [1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="h-40 animate-pulse rounded-2xl bg-slate-200"
                />
              ))
            : categories.map(({ name, count }) => {
                const Icon = categoryIcons[name] || Laptop;

                return (
                  <Link
                    key={name}
                    to={`/products?category=${encodeURIComponent(name)}`}
                    className="group flex items-center gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-emerald-500 hover:shadow-lg"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                      <Icon size={30} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-semibold text-slate-900">
                        {name}
                      </h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {count} {count === 1 ? "product" : "products"}
                      </p>
                    </div>
                    <ArrowRight
                      size={20}
                      className="text-slate-300 transition group-hover:text-emerald-600"
                    />
                  </Link>
                );
              })}
        </div>
      </div>
    </section>
  );
};

export default Categories;
