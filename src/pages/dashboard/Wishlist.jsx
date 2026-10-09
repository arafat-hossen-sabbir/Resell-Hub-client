import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Package, Trash2 } from "lucide-react";
import api from "../../api/axios";
import { formatPrice, getErrorMessage } from "../../utils/format";
import { showError, toast } from "../../utils/notify";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    let active = true;

    api
      .get("/wishlist")
      .then(({ data }) => {
        if (active) setItems(data.wishlist);
      })
      .catch((err) => {
        if (active) {
          setError(getErrorMessage(err, "Wishlist could not be loaded."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const removeItem = async (productId) => {
    setRemovingId(productId);

    try {
      await api.delete(`/wishlist/${productId}`);
      setItems((current) =>
        current.filter((item) => item.productId !== productId),
      );
      toast("Removed from wishlist");
    } catch (err) {
      showError(getErrorMessage(err, "Unable to remove the product."));
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div>
        <div className="h-10 w-56 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-72 animate-pulse rounded-2xl bg-slate-200"
            />
          ))}
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
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
        My Wishlist
      </h1>
      <p className="mt-2 text-slate-500">Products you have saved for later.</p>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <Heart className="mx-auto text-slate-300" size={40} />
          <p className="mt-4 text-slate-500">Your wishlist is empty.</p>
          <Link
            to="/products"
            className="mt-4 inline-block rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {items.map(({ _id, productId, product }) => (
            <div
              key={_id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="h-48 bg-slate-100">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <Package size={44} />
                  </div>
                )}
              </div>

              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {product.category}
                </p>
                <h2 className="mt-1 line-clamp-1 font-semibold text-slate-900">
                  {product.title}
                </h2>
                <p className="mt-2 text-lg font-bold text-emerald-600">
                  {formatPrice(product.price)}
                </p>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/products/${productId}`}
                    className="flex-1 rounded-xl bg-emerald-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    View Product
                  </Link>

                  <button
                    type="button"
                    onClick={() => removeItem(productId)}
                    disabled={removingId === productId}
                    aria-label="Remove from wishlist"
                    className="rounded-xl border border-slate-200 p-2.5 text-rose-500 hover:border-rose-300 disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
