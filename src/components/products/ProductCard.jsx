import { Link } from "react-router-dom";
import { MapPin, Star } from "lucide-react";

const ProductCard = ({ product }) => {
  const {
    id,
    title,
    category,
    condition,
    price,
    rating,
    reviews,
    location,
    image,
  } = product;

  return (
    <Link
      to={`/products/${id}`}
      className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
          {condition}
        </span>
      </div>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {category}
        </p>

        <h3 className="mt-1 line-clamp-1 font-semibold text-slate-900 transition group-hover:text-emerald-600">
          {title}
        </h3>

        <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1">
            <Star size={14} fill="currentColor" className="text-amber-500" />
            <span className="font-medium text-slate-700">{rating}</span>
            <span>({reviews})</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={14} />
            {location}
          </span>
        </div>

        <p className="mt-4 text-lg font-bold text-emerald-600">
          ৳ {price.toLocaleString("en-US")}
        </p>
      </div>
    </Link>
  );
};

export default ProductCard;
