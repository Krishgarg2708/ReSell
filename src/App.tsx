/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { FluidCursor } from './components/common/FluidCursor';
import { RoleSwitcherBanner } from './components/common/RoleSwitcherBanner';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { LandingPage } from './pages/landing/LandingPage';
import { ExplorePage } from './pages/marketplace/ExplorePage';
import { CategoriesPage } from './pages/marketplace/CategoriesPage';
import { ProductDetailPage } from './pages/marketplace/ProductDetailPage';
import { HowItWorksPage } from './pages/marketplace/HowItWorksPage';
import { Inspection3DPage } from './pages/marketplace/Inspection3DPage';

import { OrdersPage } from './pages/customer/OrdersPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { MessagesPage } from './pages/customer/MessagesPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';

import { SellerDashboardPage } from './pages/seller/SellerDashboardPage';
import { SellerListingsPage } from './pages/seller/SellerListingsPage';
import { AddProductPage } from './pages/seller/AddProductPage';
import { SellerVerificationPage } from './pages/seller/SellerVerificationPage';
import { SellerEarningsPage } from './pages/seller/SellerEarningsPage';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
        {/* Fluid trailing cursor */}
        <FluidCursor />

        {/* Global Demo Switcher for Customer, Seller, and Super Admin */}
        <RoleSwitcherBanner />

        {/* Top Navigation */}
        <Navbar />

        {/* Dynamic Route Viewport */}
        <main className="flex-1">
          <Routes>
            {/* Public Marketplace */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/products" element={<ExplorePage />} />
            <Route path="/products/:productId" element={<ProductDetailPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/3d-studio" element={<Inspection3DPage />} />

            {/* Customer Operations */}
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/customer/orders" element={<OrdersPage />} />
            <Route path="/customer/wishlist" element={<WishlistPage />} />
            <Route path="/customer/messages" element={<MessagesPage />} />

            {/* Seller Management */}
            <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
            <Route path="/seller/listings" element={<SellerListingsPage />} />
            <Route path="/seller/add-product" element={<AddProductPage />} />
            <Route path="/seller/verification" element={<SellerVerificationPage />} />
            <Route path="/seller/earnings" element={<SellerEarningsPage />} />
            <Route path="/seller/messages" element={<MessagesPage />} />
            <Route path="/seller/orders" element={<OrdersPage />} />
            <Route path="/seller/offers" element={<MessagesPage />} />

            {/* Super Admin Console */}
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/verifications" element={<AdminDashboardPage />} />
            <Route path="/admin/reports" element={<AdminDashboardPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </BrowserRouter>
  );
}
