import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../../components/products/ProductCard";
import { products } from "../../data/products";

const categories = ["All", ...new Set(products.map((p) => p.category))];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("default");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value && value !== "All") {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next, { replace: true });
  };

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    let result = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesSearch && matchesCategory;
    });

    if (sort === "low-high") {
      result = [...result].sort((a, b) => a.price - b.price);
    }

    if (sort === "high-low") {
      result = [...result].sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, category, sort]);

  const clearFilters = () => {
    setSearchParams({}, { replace: true });
    setSort("default");
  };

  return (
    <section className="bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
            Marketplace
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Explore All Products
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-slate-500">
            Find quality pre-owned products at affordable prices.
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => updateParam("search", e.target.value)}
                placeholder="Search by product name or category..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div className="relative">
              <SlidersHorizontal
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
                value={category}
                onChange={(e) => updateParam("category", e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-8 outline-none focus:border-emerald-500"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="default">Sort by Price</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-800">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

          {(search || category !== "All" || sort !== "default") && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              No Products Found
            </h2>

            <p className="mt-2 text-slate-500">
              Try another search term or category.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
