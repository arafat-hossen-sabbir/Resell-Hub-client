const Contact = () => {
  return (
    <section className="mx-auto min-h-[65vh] max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-600">
          Get in touch
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
          Contact Us
        </h1>

        <p className="mt-4 leading-7 text-slate-600">
          Have a question about buying or selling? Our support team is here to
          help.
        </p>

        <div className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-700">support@resellhub.com</p>
          <p className="mt-2 text-slate-700">+880 1700-000000</p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
