import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import api from "../../api/axios";
import ProductCard from "../../components/products/ProductCard";
import ProductSkeleton from "../../components/products/ProductSkeleton";
import { categories } from "../../data/categories";

const PRODUCTS_PER_PAGE = 8;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "newest";
  const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);

  const [searchInput, setSearchInput] = useState(search);
  const [state, setState] = useState({
    products: [],
    pagination: null,
    loading: true,
    error: "",
  });

  const setParams = (updates) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);

        Object.entries(updates).forEach(([key, value]) => {
          const isDefault =
            !value ||
            value === "All" ||
            value === "newest" ||
            (key === "page" && value === 1);

          if (isDefault) {
            next.delete(key);
          } else {
            next.set(key, String(value));
          }
        });

        return next;
      },
      { replace: true },
    );
  };

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchInput.trim();
      if (value !== search) {
        setParams({ search: value, page: 1 });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();

    setState((current) => ({ ...current, loading: true, error: "" }));

    api
      .get("/products", {
        params: { search, category, sort, page, limit: PRODUCTS_PER_PAGE },
        signal: controller.signal,
      })
      .then(({ data }) => {
        setState({
          products: data.products,
          pagination: data.pagination,
          loading: false,
          error: "",
        });
      })
      .catch((error) => {
        if (error.code === "ERR_CANCELED") return;
        setState((current) => ({
          ...current,
          loading: false,
          error: "Products could not be loaded. Please try again.",
        }));
      });

    return () => controller.abort();
  }, [search, category, sort, page]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const { products, pagination, loading, error } = state;
  const totalPages = pagination?.totalPages || 0;
  const hasFilters = search || category !== "All" || sort !== "newest";

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({}, { replace: true });
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
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
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
                onChange={(e) =>
                  setParams({ category: e.target.value, page: 1 })
                }
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-8 outline-none focus:border-emerald-500"
              >
                <option value="All">All</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={sort}
              onChange={(e) => setParams({ sort: e.target.value, page: 1 })}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-emerald-500"
            >
              <option value="newest">Newest first</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {pagination ? (
              <>
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {products.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {pagination.totalProducts}
                </span>{" "}
                products
              </>
            ) : (
              "Loading products..."
            )}
          </p>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: PRODUCTS_PER_PAGE }, (_, index) => (
              <ProductSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
            {error}
          </div>
        ) : products.length > 0 ? (
          <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
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

        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setParams({ page: page - 1 })}
              disabled={page === 1}
              aria-label="Previous page"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
            >
              <ChevronLeft size={18} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const number = index + 1;

              return (
                <button
                  key={number}
                  type="button"
                  onClick={() => setParams({ page: number })}
                  className={`h-10 w-10 rounded-lg font-medium transition ${
                    page === number
                      ? "bg-emerald-600 text-white"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                  }`}
                >
                  {number}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setParams({ page: page + 1 })}
              disabled={page === totalPages}
              aria-label="Next page"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-500 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-slate-200 disabled:hover:text-slate-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
