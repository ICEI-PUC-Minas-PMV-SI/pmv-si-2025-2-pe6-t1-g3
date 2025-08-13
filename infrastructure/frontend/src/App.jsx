import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Account from "./components/Account";
import Admin from "./components/ProductRegistration";
import Header from "./components/Header";
import Cart from "./components/Cart";
import Product from "./components/Product";
import Register from "./components/Register";
import Error404 from "./components/Error404";
import Aboutus from "./components/Aboutus";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Likedproducts from "./components/Likedproducts";
import ProductDetails from "./components/ProductDetails";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/aboutus" element={<Aboutus />} />
          <Route path="/favorites" element={<Likedproducts />} />
          <Route path="/product/:productId" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/product" element={<Product />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
