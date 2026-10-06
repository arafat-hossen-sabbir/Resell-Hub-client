import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  MapPin,
  MessageCircle,
  ShieldCheck,
  ShoppingCart,
  Star,
} from "lucide-react";
import { products } from "../../data/products";

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

const ProductDetails = () => {
  const { id } = useParams();
  const product = products.find((item) => item.id === id);

  if (!product) {
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
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <img
              src={product.image}
              alt={product.title}
              className="h-[360px] w-full object-cover sm:h-[500px]"
            />
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
                aria-label="Add to wishlist"
                className="rounded-full border border-slate-200 p-3 text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
              >
                <Heart size={21} />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <span className="text-3xl font-bold text-emerald-600">
                ৳ {product.price.toLocaleString("en-US")}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                {product.category}
              </span>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-5 text-slate-500">
              <span className="flex items-center gap-2">
                <MapPin size={18} />
                {product.location}
              </span>
              <span className="flex items-center gap-1">
                <Star
                  size={17}
                  fill="currentColor"
                  className="text-amber-500"
                />
                <span className="font-medium text-slate-700">
                  {product.rating}
                </span>
                <span>({product.reviews} reviews)</span>
              </span>
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
                {getInitials(product.seller)}
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Seller
                </p>
                <p className="font-semibold text-slate-900">{product.seller}</p>
                <p className="text-sm text-slate-500">{product.location}</p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
              >
                <ShoppingCart size={19} />
                Buy Now
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-emerald-600 px-5 py-3 font-semibold text-emerald-600 transition hover:bg-emerald-50"
              >
                <MessageCircle size={19} />
                Contact Seller
              </button>
            </div>

            <p className="mt-5 flex items-center gap-2 text-sm text-slate-500">
              <ShieldCheck size={17} className="text-emerald-600" />
              Meet in a public place and check the product before paying.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
