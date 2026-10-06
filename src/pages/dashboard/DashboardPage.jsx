const DashboardPage = ({ title, description }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
      <p className="mt-2 text-slate-500">{description}</p>

      <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
        <p className="font-medium text-slate-700">Coming soon</p>
        <p className="mt-1 text-sm text-slate-500">
          This section will be built in an upcoming commit.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
