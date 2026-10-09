import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import api from "../../api/axios";
import ProductCard from "../products/ProductCard";
import ProductSkeleton from "../products/ProductSkeleton";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    api
      .get("/products", { params: { limit: 4 } })
      .then(({ data }) => {
        if (active) setProducts(data.products);
      })
      .catch(() => {
        if (active) setFailed(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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

        {loading ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <ProductSkeleton key={item} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center text-slate-500">
            {failed
              ? "Products could not be loaded. Please try again later."
              : "No products are available yet."}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
