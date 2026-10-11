const PageLoader = ({ label = "Loading..." }) => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-emerald-100" />
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-emerald-600" />
      </div>
      <p className="text-lg font-bold text-slate-900">
        ReSell<span className="text-emerald-600">Hub</span>
      </p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
};

export default PageLoader;
