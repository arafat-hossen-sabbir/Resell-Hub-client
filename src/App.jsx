import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import DashboardPage from "./pages/dashboard/DashboardPage";
import MyOrders from "./pages/dashboard/MyOrders";
import Wishlist from "./pages/dashboard/Wishlist";
import MyProducts from "./pages/dashboard/MyProducts";
import Home from "./pages/public/Home";
import Products from "./pages/public/Products";
import ProductDetails from "./pages/public/ProductDetails";
import Categories from "./pages/public/Categories";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="products" element={<MyProducts />} />
            <Route
              path="sales"
              element={
                <DashboardPage
                  title="Sales Orders"
                  description="Orders placed on your products."
                />
              }
            />
            <Route
              path="analytics"
              element={
                <DashboardPage
                  title="Analytics"
                  description="See how your listings are performing."
                />
              }
            />
            <Route
              path="profile"
              element={
                <DashboardPage
                  title="Profile Settings"
                  description="Update your personal information."
                />
              }
            />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
