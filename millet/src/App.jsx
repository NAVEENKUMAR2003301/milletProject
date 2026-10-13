import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProductProvider } from './contexts/ProductContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { AdminProvider } from './contexts/AdminContext';
import Background from './components/layout/Background';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './components/cart/CartDrawer';
import ScrollToTop from './components/ui/ScrollToTop';
import NotFound from './components/ui/NotFound';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Admin from './pages/Admin';
import Feedback from './pages/Feedback';

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AdminProvider>
          <ProductProvider>
            <CartProvider>
              <OrderProvider>
                <ScrollToTop />
                <Background />
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <div className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/checkout" element={<Checkout />} />
                      <Route path="/feedback" element={<Feedback />} />
                      <Route path="/admin" element={<Admin />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                  <Footer />
                </div>
                <CartDrawer />
              </OrderProvider>
            </CartProvider>
          </ProductProvider>
        </AdminProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}