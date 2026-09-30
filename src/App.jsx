import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";

const Placeholder = ({ title }) => {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center px-4">
      <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
    </section>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Placeholder title="ReSell Hub Home" />} />
          <Route
            path="/products"
            element={<Placeholder title="All Products" />}
          />
          <Route
            path="/categories"
            element={<Placeholder title="Categories" />}
          />
          <Route
            path="/dashboard"
            element={<Placeholder title="Dashboard" />}
          />
          <Route path="/login" element={<Placeholder title="Login" />} />
          <Route path="/about" element={<Placeholder title="About Us" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
