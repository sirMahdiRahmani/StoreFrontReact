import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AnnouncementBanner } from "./components/AnnouncementBanner";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./routes/Home";
import { Shop } from "./routes/Shop";
import { Product } from "./routes/Product";
import { Cart } from "./routes/Cart";
import { Checkout } from "./routes/Checkout";
import { PaymentResult } from "./routes/PaymentResult";
import { About } from "./routes/About";
import { NotFound } from "./routes/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="flex min-h-screen flex-col">
          <AnnouncementBanner />
          <Header />
          <main className="flex-1">
            <div className="mx-auto w-full max-w-6xl">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/payment-result" element={<PaymentResult />} />
                <Route path="/about" element={<About />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
