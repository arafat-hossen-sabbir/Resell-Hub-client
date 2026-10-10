import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Package, Pencil, Plus, Search, Store, Trash2 } from "lucide-react";
import api from "../../api/axios";
import ProductFormModal from "../../components/dashboard/ProductFormModal";
import {
  formatPrice,
  getErrorMessage,
  productStatusStyles,
} from "../../utils/format";
import {
  confirmAction,
  showError,
  showSuccess,
  toast,
} from "../../utils/notify";

const FILTERS = ["All", "approved", "pending", "rejected"];

const MyProducts = () => {
  const { profile, setProfile, ready } = useOutletContext();
  const isSeller = ["seller", "admin"].includes(profile?.role);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [upgrading, setUpgrading] = useState(false);

  useEffect(() => {
    if (!ready) return undefined;

    if (!isSeller) {
      setLoading(false);
      return undefined;
    }

    let active = true;
    setLoading(true);

    api
      .get("/products/my")
      .then(({ data }) => {
        if (active) setProducts(data.products);
      })
      .catch((err) => {
        if (active) {
          setError(getErrorMessage(err, "Your products could not be loaded."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ready, isSeller]);

  const becomeSeller = async () => {
    setUpgrading(true);

    try {
      const { data } = await api.post("/users/become-seller");
      setProfile(data.user);
      toast("You can now sell products");
    } catch (err) {
      showError(getErrorMessage(err, "Your account could not be upgraded."));
    } finally {
      setUpgrading(false);
    }
  };

  const handleSaved = (saved, isNew) => {
    if (isNew) {
      setProducts((current) => [saved, ...current]);
      showSuccess(
        "Product submitted",
        "It will appear in the marketplace after an admin approves it.",
      );
    } else {
      setProducts((current) =>
        current.map((item) => (item._id === saved._id ? saved : item)),
      );
      toast("Product updated");
    }

    setModal(null);
  };

  const handleDelete = async (product) => {
    const confirmed = await confirmAction({
      title: "Delete this product?",
      text: "Existing orders keep their own copy of the product details.",
      confirmText: "Yes, delete",
    });

    if (!confirmed) return;

    setDeletingId(product._id);

    try {
      await api.delete(`/products/${product._id}`);
      setProducts((current) =>
        current.filter((item) => item._id !== product._id),
      );
      toast("Product deleted");
    } catch (err) {
      showError(getErrorMessage(err, "The product could not be deleted."));
    } finally {
      setDeletingId(null);
    }
  };

  const counts = useMemo(
    () => ({
      All: products.length,
      approved: products.filter((p) => p.status === "approved").length,
      pending: products.filter((p) => p.status === "pending").length,
      rejected: products.filter((p) => p.status === "rejected").length,
    }),
    [products],
  );

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesStatus = filter === "All" || product.status === filter;
      const matchesQuery =
        !term ||
        product.title.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term);

      return matchesStatus && matchesQuery;
    });
  }, [products, filter, query]);

  if (!ready || loading) {
    return (
      <div className="space-y-4">
        <div className="h-10 w-56 animate-pulse rounded bg-slate-200" />
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-28 animate-pulse rounded-2xl bg-slate-200"
          />
        ))}
      </div>
    );
  }

  if (!isSeller) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Start selling on ReSell Hub
        </h1>
        <p className="mt-2 text-slate-500">
          Turn the things you no longer need into extra income.
        </p>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Store size={28} />
          </div>
          <h2 className="mt-4 text-xl font-semibold text-slate-900">
            Become a seller
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
            List your products, manage the orders you receive, and track your
            sales from one place. Your listings are reviewed before they go
            live.
          </p>
          <button
            type="button"
            onClick={becomeSeller}
            disabled={upgrading}
            className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
          >
            {upgrading ? "Please wait..." : "Become a seller"}
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            My Products
          </h1>
          <p className="mt-2 text-slate-500">
            Manage the products you have listed.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModal({ product: null })}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          <Plus size={18} />
          Add product
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                filter === item
                  ? "bg-emerald-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
              }`}
            >
              {item} ({counts[item]})
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-72">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search my products..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <Package className="mx-auto text-slate-300" size={40} />
          <p className="mt-4 text-slate-500">
            {products.length === 0
              ? "You have not listed any products yet."
              : "No products match your filters."}
          </p>
          {products.length === 0 && (
            <button
              type="button"
              onClick={() => setModal({ product: null })}
              className="mt-4 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Add your first product
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {visible.map((product) => (
            <div
              key={product._id}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <Package size={32} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="truncate font-semibold text-slate-900">
                    {product.title}
                  </h2>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${
                      productStatusStyles[product.status] ||
                      "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {product.status}
                  </span>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  {product.category} · {product.condition} · Stock{" "}
                  {product.stock}
                </p>

                <p className="mt-2 font-bold text-emerald-600">
                  {formatPrice(product.price)}
                </p>

                {product.status === "pending" && (
                  <p className="mt-1 text-xs text-amber-600">
                    Waiting for admin approval
                  </p>
                )}
                {product.status === "rejected" && (
                  <p className="mt-1 text-xs text-rose-600">
                    This listing was rejected. Edit it and contact support.
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {product.status === "approved" && (
                  <Link
                    to={`/products/${product._id}`}
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                  >
                    View
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setModal({ product })}
                  aria-label="Edit product"
                  className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                >
                  <Pencil size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  disabled={deletingId === product._id}
                  aria-label="Delete product"
                  className="rounded-lg border border-slate-200 p-2 text-rose-500 hover:border-rose-300 disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <ProductFormModal
          product={modal.product}
          onClose={() => setModal(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default MyProducts;
