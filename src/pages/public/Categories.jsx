const Categories = () => {
  const categories = [
    "Electronics",
    "Furniture",
    "Vehicles",
    "Fashion",
    "Mobile Phones",
  ];

  return (
    <section className="mx-auto min-h-[65vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
        Explore
      </p>

      <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
        Popular Categories
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {categories.map((category) => (
          <div
            key={category}
            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200"
          >
            <h2 className="font-semibold text-slate-800">{category}</h2>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Categories;
