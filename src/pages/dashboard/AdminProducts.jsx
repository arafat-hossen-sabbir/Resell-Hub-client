import { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Check, Package, Search, ShieldAlert, Trash2, X } from "lucide-react";
import api from "../../api/axios";
import Pager from "../../components/dashboard/Pager";
import {
  formatPrice,
  getErrorMessage,
  productStatusStyles,
} from "../../utils/format";
import { askReason, confirmAction, showError, toast } from "../../utils/notify";

const FILTERS = ["pending", "approved", "rejected", "All"];

const AdminProducts = () => {
  const { profile, ready } = useOutletContext();
  const isAdmin = profile?.role === "admin";

  const [status, setStatus] = useState("pending");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(0);
  const [data, setData] = useState({ products: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!ready || !isAdmin) return undefined;

    let active = true;
    setLoading(true);

    api
      .get("/admin/products", { params: { status, search, page } })
      .then(({ data: res }) => {
        if (active) {
          setData({ products: res.products, pagination: res.pagination });
          setError("");
        }
      })
      .catch((err) => {
        if (active) {
          setError(getErrorMessage(err, "Products could not be loaded."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ready, isAdmin, status, search, page, reload]);

  const review = async (product, nextStatus) => {
    let reason = "";

    if (nextStatus === "rejected") {
      reason = await askReason(`Reject "${product.title}"?`);
      if (reason === null) return;
    }

    setBusyId(product._id);

    try {
      await api.patch(`/admin/products/${product._id}/status`, {
        status: nextStatus,
        reason,
      });
      toast(`Product ${nextStatus}`);
      setReload((value) => value + 1);
    } catch (err) {
      showError(getErrorMessage(err, "The product could not be updated."));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (product) => {
    const confirmed = await confirmAction({
      title: `Delete "${product.title}"?`,
      text: "This permanently removes the listing.",
      confirmText: "Yes, delete",
    });

    if (!confirmed) return;

    setBusyId(product._id);

    try {
      await api.delete(`/admin/products/${product._id}`);
      toast("Product deleted");
      setReload((value) => value + 1);
    } catch (err) {
      showError(getErrorMessage(err, "The product could not be deleted."));
    } finally {
      setBusyId(null);
    }
  };

  if (ready && !isAdmin) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <ShieldAlert className="mx-auto text-slate-300" size={40} />
        <p className="mt-4 text-slate-500">
          This area is only available to administrators.
        </p>
        <Link
          to="/dashboard"
          className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Back to dashboard
        </Link>
      </div>
    );
  }

  const { products, pagination } = data;

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        Review Products
      </h1>
      <p className="mt-2 text-slate-500">
        Approve, reject or delete listings submitted by sellers.
      </p>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setStatus(item);
                setPage(1);
              }}
              className={`rounded-full px-4 py-1.5 text-sm font-medium capitalize transition ${
                status === item
                  ? "bg-emerald-600 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            setSearch(searchInput.trim());
            setPage(1);
          }}
          className="relative w-full lg:w-72"
        >
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search title or seller..."
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none focus:border-emerald-500"
          />
        </form>
      </div>

      {loading ? (
        <div className="mt-6 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-28 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
        </div>
      ) : error ? (
        <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-700">
          {error}
        </div>
      ) : products.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <Package className="mx-auto text-slate-300" size={40} />
          <p className="mt-4 text-slate-500">No products in this view.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {products.map((product) => (
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
                <p className="mt-1 text-sm text-slate-500">
                  Seller: {product.sellerInfo?.name} (
                  {product.sellerInfo?.email})
                </p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">
                  {product.description}
                </p>
                <p className="mt-2 font-bold text-emerald-600">
                  {formatPrice(product.price)}
                </p>
                {product.status === "rejected" && product.rejectReason ? (
                  <p className="mt-1 text-xs text-rose-600">
                    Reason: {product.rejectReason}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {product.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => review(product, "approved")}
                    disabled={busyId === product._id}
                    className="inline-flex items-center gap-1 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    <Check size={16} />
                    Approve
                  </button>
                )}

                {product.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => review(product, "rejected")}
                    disabled={busyId === product._id}
                    className="inline-flex items-center gap-1 rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-60"
                  >
                    <X size={16} />
                    Reject
                  </button>
                )}

                {product.status === "approved" && (
                  <Link
                    to={`/products/${product._id}`}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:border-emerald-500 hover:text-emerald-600"
                  >
                    View
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => remove(product)}
                  disabled={busyId === product._id}
                  aria-label="Delete product"
                  className="rounded-xl border border-slate-200 p-2 text-rose-500 hover:border-rose-300 disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pager pagination={pagination} onChange={setPage} />
    </div>
  );
};

export default AdminProducts;
