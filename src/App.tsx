/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';
import { EnquiryCartDrawer } from './components/EnquiryCartDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

import { HomePage } from './pages/HomePage';
import { ProductListingPage } from './pages/ProductListingPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { EnquiryCartPage } from './pages/EnquiryCartPage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { BlogsPage } from './pages/BlogsPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname, hash]);

  return null;
};

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#14151B] text-white">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/products/car" element={<ProductListingPage presetVehicle="car" />} />
              <Route
                path="/products/two-wheelers"
                element={<ProductListingPage presetVehicle="two-wheelers" />}
              />
              <Route
                path="/products/commercial-vehicles"
                element={<ProductListingPage presetVehicle="commercial-vehicles" />}
              />
              <Route path="/category/:categorySlug" element={<ProductListingPage />} />
              <Route path="/search" element={<ProductListingPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/blogs" element={<BlogsPage />} />
              <Route path="/blogs/:slug" element={<BlogDetailPage />} />
              <Route path="/blog/:slug" element={<BlogDetailPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/enquiry-cart" element={<EnquiryCartPage />} />
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <Footer />
          <EnquiryModal />
          <EnquiryCartDrawer />
          <FloatingWhatsApp />
        </div>
      </BrowserRouter>
    </StoreProvider>
  );
}
