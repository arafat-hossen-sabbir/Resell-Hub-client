import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="text-center">
        <svg
          viewBox="0 0 400 220"
          className="mx-auto h-48 w-full max-w-sm"
          role="img"
          aria-label="Page not found illustration"
        >
          <ellipse cx="200" cy="200" rx="150" ry="12" fill="#d1fae5" />
          <text
            x="200"
            y="150"
            textAnchor="middle"
            fontSize="120"
            fontWeight="800"
            fill="#059669"
          >
            404
          </text>
          <rect x="140" y="20" width="120" height="50" rx="12" fill="#ecfdf5" />
          <circle cx="175" cy="45" r="6" fill="#059669" />
          <circle cx="225" cy="45" r="6" fill="#059669" />
          <path
            d="M180 58 Q200 48 220 58"
            stroke="#059669"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>

        <h1 className="mt-6 text-3xl font-bold text-slate-900">
          Oops! Page not found
        </h1>
        <p className="mt-3 text-slate-500">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 font-semibold text-white transition hover:bg-emerald-700"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default NotFound;
