import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import ProductCard from "../products/ProductCard";
import { products } from "../../data/products";

const FeaturedProducts = () => {
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

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
