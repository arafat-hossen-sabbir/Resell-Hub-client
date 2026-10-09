import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingCart,
  Star,
  X,
} from "lucide-react";
import api from "../../api/axios";
import { getStoredUser } from "../../api/session";
import { useAuth } from "../../contexts/AuthContext";
import { formatPrice, getErrorMessage } from "../../utils/format";
import { showError, showSuccess, toast } from "../../utils/notify";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100";

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const [wished, setWished] = useState(false);
  const [wishBusy, setWishBusy] = useState(false);

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    quantity: 1,
  });

  useEffect(() => {
    let active = true;

    setLoading(true);
    setNotFound(false);
    setActiveImage(0);

    api
      .get(`/products/${id}`)
      .then(({ data }) => {
        if (active) setProduct(data.product);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!user) {
      setWished(false);
      return undefined;
    }

    let active = true;

    api
      .get("/wishlist")
      .then(({ data }) => {
        if (active) {
          setWished(data.wishlist.some((item) => item.productId === id));
        }
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [user, id]);

  const requireLogin = () => {
    if (user) return true;
    navigate("/login", { state: { from: location } });
    return false;
  };

  const toggleWishlist = async () => {
    if (!requireLogin()) return;

    setWishBusy(true);

    try {
      if (wished) {
        await api.delete(`/wishlist/${id}`);
        setWished(false);
        toast("Removed from wishlist");
      } else {
        await api.post(`/wishlist/${id}`);
        setWished(true);
        toast("Added to wishlist");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setWished(true);
      } else {
        showError(getErrorMessage(error, "Wishlist could not be updated."));
      }
    } finally {
      setWishBusy(false);
    }
  };

  const openCheckout = () => {
    if (!requireLogin()) return;

    setForm((current) => ({
      ...current,
      name: current.name || user?.displayName || "",
    }));
    setCheckoutOpen(true);
  };

  const updateForm = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  const placeOrder = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await api.post("/orders", {
        productId: product._id,
        quantity: Number(form.quantity),
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          address: form.address,
        },
      });

      setCheckoutOpen(false);
      await showSuccess(
        "Order placed",
        "The seller will review your order shortly.",
      );
      navigate("/dashboard/orders");
    } catch (error) {
      showError(getErrorMessage(error, "Unable to place the order."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section className="bg-slate-50 py-10">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="h-[420px] animate-pulse rounded-2xl bg-slate-200" />
          <div className="space-y-4 rounded-2xl bg-white p-8">
            <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-8 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="h-32 animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      </section>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">
            Product Not Found
          </h1>
          <p className="mt-3 text-slate-500">
            The product you are looking for does not exist.
          </p>

          <Link
            to="/products"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700"
          >
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const outOfStock = !product.stock || product.stock < 1;
  const isOwner =
    Boolean(user) && getStoredUser()?._id === product.sellerInfo?.userId;
  const total = product.price * (Number(form.quantity) || 0);

  return (
    <section className="bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/products"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
        >
          <ArrowLeft size={18} />
          Back to Products
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={product.title}
                  className="h-[360px] w-full object-cover sm:h-[500px]"
                />
              ) : (
                <div className="flex h-[360px] items-center justify-center text-slate-300 sm:h-[500px]">
                  <Package size={72} />
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${
                      activeImage === index
                        ? "border-emerald-500"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                  {product.condition}
                </span>

                <h1 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {product.title}
                </h1>
              </div>

              <button
                type="button"
                onClick={toggleWishlist}
                disabled={wishBusy}
                aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
                className={`rounded-full border p-3 transition disabled:opacity-60 ${
                  wished
                    ? "border-rose-200 bg-rose-50 text-rose-500"
                    : "border-slate-200 text-slate-600 hover:border-emerald-200 hover:text-emerald-600"
                }`}
              >
                <Heart size={21} fill={wished ? "currentColor" : "none"} />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="text-3xl font-bold text-emerald-600">
                {formatPrice(product.price)}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                {product.category}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  outOfStock
                    ? "bg-rose-50 text-rose-600"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {outOfStock ? "Out of stock" : `${product.stock} in stock`}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-slate-500">
              {product.location ? (
                <span className="flex items-center gap-2">
                  <MapPin size={18} />
                  {product.location}
                </span>
              ) : null}
              {product.rating ? (
                <span className="flex items-center gap-1">
                  <Star
                    size={17}
                    fill="currentColor"
                    className="text-amber-500"
                  />
                  <span className="font-medium text-slate-700">
                    {product.rating}
                  </span>
                  {product.reviews ? (
                    <span>({product.reviews} reviews)</span>
                  ) : null}
                </span>
              ) : null}
            </div>

            <div className="my-7 h-px bg-slate-200" />

            <h2 className="text-xl font-semibold text-slate-900">
              Product Description
            </h2>
            <p className="mt-3 leading-7 text-slate-600">
              {product.description}
            </p>

            <div className="mt-7 flex items-center gap-4 rounded-xl bg-slate-50 p-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 font-bold text-white">
                {getInitials(product.sellerInfo?.name)}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Seller
                </p>
                <p className="font-semibold text-slate-900">
                  {product.sellerInfo?.name}
                </p>
                {product.location ? (
                  <p className="text-sm text-slate-500">{product.location}</p>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              onClick={openCheckout}
              disabled={outOfStock || isOwner}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              <ShoppingCart size={19} />
              {isOwner
                ? "This is your listing"
                : outOfStock
                  ? "Out of stock"
                  : "Buy Now"}
            </button>

            <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={17} className="text-emerald-600" />
              Meet in a public place and check the product before paying.
            </p>
          </div>
        </div>
      </div>

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <form
            onSubmit={placeOrder}
            className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Place your order
                </h2>
                <p className="mt-1 text-sm text-slate-500">{product.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setCheckoutOpen(false)}
                aria-label="Close"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Full name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => updateForm("name", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Delivery address
                </label>
                <textarea
                  required
                  rows={3}
                  value={form.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Quantity
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={product.stock}
                  value={form.quantity}
                  onChange={(e) => updateForm("quantity", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-500">Total</span>
              <span className="text-lg font-bold text-emerald-600">
                {formatPrice(total)}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {submitting ? "Placing order..." : "Confirm order"}
            </button>
          </form>
        </div>
      )}
    </section>
  );
};

export default ProductDetails;
