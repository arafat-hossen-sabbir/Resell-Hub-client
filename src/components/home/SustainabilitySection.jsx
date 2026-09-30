import { Leaf, Recycle, TrendingDown } from "lucide-react";

const impacts = [
  {
    icon: Leaf,
    value: "12 tons",
    title: "Less Waste",
    text: "Products kept out of landfills by getting a second life.",
  },
  {
    icon: Recycle,
    value: "18,000+",
    title: "Items Reused",
    text: "Useful products passed on from one home to another.",
  },
  {
    icon: TrendingDown,
    value: "Up to 70%",
    title: "Money Saved",
    text: "Buyers save compared to brand-new market prices.",
  },
];

const SustainabilitySection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-600">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-white/10 blur-2xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-sm font-medium text-white">
            <Leaf size={16} />
            Sustainability Impact
          </span>
          <h2 className="mt-5 text-3xl font-bold leading-tight text-white sm:text-4xl">
            Better products deserve a second chance.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-emerald-50">
            Every pre-owned product you buy or sell keeps useful items in
            circulation longer, reduces waste and helps build a more sustainable
            community.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {impacts.map(({ icon: Icon, value, title, text }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-5 shadow-lg transition hover:-translate-y-1"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                <Icon size={22} />
              </div>
              <p className="mt-4 text-2xl font-extrabold text-slate-900">
                {value}
              </p>
              <h3 className="mt-1 font-semibold text-slate-800">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection;
