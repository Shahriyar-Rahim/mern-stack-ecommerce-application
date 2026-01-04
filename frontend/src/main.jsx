import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "remixicon/fonts/remixicon.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/home/Home.jsx";
import ShopPage from "./pages/shop/ShopPage.jsx";
import CategoryPage from "./pages/category/CategoryPage.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
import Product from "./pages/shop/productDetails/Product.jsx";
import PaymentSuccess from "./pages/shop/PaymentSuccess.jsx";
import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import UserDMain from "./pages/dashboard/user/dashboard/UserDMain.jsx";
import UserOrders from "./pages/dashboard/user/orders/UserOrders.jsx";
import OrderDetails from "./pages/dashboard/user/orders/OrderDetails.jsx";
import UserPayments from "./pages/dashboard/user/payments/UserPayments.jsx";
import UserReviews from "./pages/dashboard/user/reviews/UserReviews.jsx";
import UserProfile from "./pages/dashboard/user/profile/UserProfile.jsx";
import AdminDMain from "./pages/dashboard/admin/dashboard/AdminDMain.jsx";
import ManageUsers from "./pages/dashboard/admin/manageUsers/ManageUsers.jsx";
import ManageOrders from "./pages/dashboard/admin/orders/ManageOrders.jsx";
import AddProduct from "./pages/dashboard/admin/addProduct/AddProduct.jsx";
import ManageProducts from "./pages/dashboard/admin/manageProducts/ManageProducts.jsx";
import UpdateProduct from "./pages/dashboard/admin/manageProducts/UpdateProduct.jsx";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <Provider store={store}>
  <BrowserRouter>
    <Routes>
      {/* Main App Layout */}
      <Route path="/" element={<App />} errorElement={<ErrorPage />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<ShopPage />} />
        <Route path="shop/:id" element={<Product />} />
        <Route path="categoris/:categoryName" element={<CategoryPage />} />
        <Route path="success" element={<PaymentSuccess />} />
        <Route path="/orders/:orderId" element={<OrderDetails />} />
      </Route>

      {/* Dashboard Layout with Nested Relative Paths */}
      <Route 
        path="/dashboard" 
        element={<PrivateRoute><DashboardLayout /></PrivateRoute>}
      >
        {/* Matches /dashboard */}
        <Route index element={<UserDMain />} /> 
        
        {/* Matches /dashboard/orders, /dashboard/payments, etc. */}
        <Route path="orders" element={<UserOrders />} />
        <Route path="payments" element={<UserPayments />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="reviews" element={<UserReviews />} />

        {/* Admin Section - Still within /dashboard/ */}
        <Route path="admin" element={<PrivateRoute role="admin"><AdminDMain /></PrivateRoute>} />
        <Route path="add-product" element={<PrivateRoute role="admin"><AddProduct /></PrivateRoute>} />
        <Route path="manage-products" element={<PrivateRoute role="admin"><ManageProducts /></PrivateRoute>}/>
        <Route path="manage-orders" element={<PrivateRoute role="admin"><ManageOrders /></PrivateRoute>} />
        <Route path="update-product/:id" element={<PrivateRoute role="admin"><UpdateProduct /></PrivateRoute>} />
        <Route path="users" element={<PrivateRoute role="admin"><ManageUsers /></PrivateRoute>} />
      </Route>

      {/* Auth & Error Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
</Provider>
  );
} else {
  console.error("Root element with id 'root' not found in the document.");
}
