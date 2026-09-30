import { Quote, Star } from "lucide-react";

const stories = [
  {
    name: "Rakib Hasan",
    role: "Buyer · Dhaka",
    text: "I found a laptop in excellent condition at a much better price than buying a new one. Smooth deal from start to finish.",
  },
  {
    name: "Nusrat Jahan",
    role: "Seller · Chattogram",
    text: "Selling things I no longer use has been simple. Managing my listings is easy and buyers respond quickly.",
  },
  {
    name: "Tanvir Ahmed",
    role: "Buyer · Sylhet",
    text: "The product details and seller information helped me make a confident purchase. Highly recommended.",
  },
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);

const SuccessStories = () => {
  return (
    <section className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">Success Stories</h2>
          <p className="mt-2 text-slate-600">
            Real experiences from our buyers and sellers.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {stories.map((story) => (
            <div
              key={story.name}
              className="relative rounded-2xl border border-slate-200 bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <Quote size={32} className="text-emerald-200" />

              <div className="mt-3 flex gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <p className="mt-4 leading-7 text-slate-600">“{story.text}”</p>

              <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-400 text-sm font-bold text-white">
                  {getInitials(story.name)}
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{story.name}</p>
                  <p className="text-sm text-slate-500">{story.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
