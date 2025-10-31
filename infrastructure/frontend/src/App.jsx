import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { useScrollToTop } from "./hooks/useScrollToTop";
import Dashboard from "./components/Dashboard";
import Account from "./components/Account";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Header from "./components/Header";
import Cart from "./components/Cart";
import Register from "./components/Register";
import Error404 from "./components/Error404";
import Aboutus from "./components/Aboutus";
import Footer from "./components/Footer";
import Login from "./components/Auth/Login";
import Likedproducts from "./components/Likedproducts";
import ProductDetails from "./components/ProductDetails";
import SearchResults from "./components/SearchResults";
import Category from "./components/Category";
import Products from "./components/Products";

function ScrollToTop() {
  useScrollToTop();
  return null;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products" element={<Products />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/account" element={<Account />} />
              <Route path="/aboutus" element={<Aboutus />} />
              <Route path="/favorites" element={<Likedproducts />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/category/:categorySlug" element={<Category />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Error404 />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
