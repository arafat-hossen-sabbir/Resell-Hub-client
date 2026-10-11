import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/dashboard/Dashboard";
import MyOrders from "./pages/dashboard/MyOrders";
import Wishlist from "./pages/dashboard/Wishlist";
import MyProducts from "./pages/dashboard/MyProducts";
import AddProduct from "./pages/dashboard/AddProduct";
import SellerOrders from "./pages/dashboard/SellerOrders";
import Analytics from "./pages/dashboard/Analytics";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import AdminProducts from "./pages/dashboard/AdminProducts";
import AdminUsers from "./pages/dashboard/AdminUsers";
import AdminOrders from "./pages/dashboard/AdminOrders";
import AdminPayments from "./pages/dashboard/AdminPayments";
import AdminAnalytics from "./pages/dashboard/AdminAnalytics";
import PaymentHistory from "./pages/dashboard/PaymentHistory";
import Profile from "./pages/dashboard/Profile";
import Home from "./pages/public/Home";
import Products from "./pages/public/Products";
import ProductDetails from "./pages/public/ProductDetails";
import Categories from "./pages/public/Categories";
import About from "./pages/public/About";
import Contact from "./pages/public/Contact";
import Checkout from "./pages/public/Checkout";
import PaymentSuccess from "./pages/public/PaymentSuccess";
import NotFound from "./pages/public/NotFound";

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
            path="/checkout/:orderId"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment-success"
            element={
              <ProtectedRoute>
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />

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
            <Route path="payments" element={<PaymentHistory />} />
            <Route path="wishlist" element={<Wishlist />} />
            <Route path="add-product" element={<AddProduct />} />
            <Route path="products" element={<MyProducts />} />
            <Route path="sales" element={<SellerOrders />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="admin" element={<AdminDashboard />} />
            <Route path="admin/products" element={<AdminProducts />} />
            <Route path="admin/users" element={<AdminUsers />} />
            <Route path="admin/orders" element={<AdminOrders />} />
            <Route path="admin/payments" element={<AdminPayments />} />
            <Route path="admin/analytics" element={<AdminAnalytics />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
