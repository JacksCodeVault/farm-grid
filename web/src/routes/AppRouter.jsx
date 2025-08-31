import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Public pages
import LoginPage from '../pages/public/LoginPage';
import ResetPasswordPage from '../pages/public/ResetPasswordPage';
import NotFoundPage from '../pages/NotFoundPage';
import LandingPage from '../LandingPage';

// Admin pages
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import OrganizationListPage from '../pages/admin/OrganizationListPage';
import CreateUserPage from '../pages/admin/CreateUserPage';

// Coop pages
import CoopDashboardPage from '../pages/coop/CoopDashboardPage';
import StaffListPage from '../pages/coop/StaffListPage';
import PayoutsPage from '../pages/coop/PayoutsPage';

// Buyer pages
import BuyerDashboardPage from '../pages/buyer/BuyerDashboardPage';
import CreateOrderPage from '../pages/buyer/CreateOrderPage';

// Shared pages
import OrderListPage from '../pages/shared/OrderListPage';
import FarmerListPage from '../pages/shared/FarmerListPage';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Admin routes */}
        <Route element={<RoleBasedRoute allowedRoles={["SYSTEM_ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/organizations" element={<OrganizationListPage />} />
          <Route path="/admin/create-user" element={<CreateUserPage />} />
        </Route>

        {/* Coop routes */}
        <Route element={<RoleBasedRoute allowedRoles={["COOP_ADMIN"]} />}>
          <Route path="/coop/dashboard" element={<CoopDashboardPage />} />
          <Route path="/coop/staff" element={<StaffListPage />} />
          <Route path="/coop/payouts" element={<PayoutsPage />} />
        </Route>

        {/* Buyer routes */}
        <Route element={<RoleBasedRoute allowedRoles={["BUYER_ADMIN"]} />}>
          <Route path="/buyer/dashboard" element={<BuyerDashboardPage />} />
          <Route path="/buyer/create-order" element={<CreateOrderPage />} />
        </Route>

        {/* Shared routes (multiple roles) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/orders" element={<OrderListPage />} />
          <Route path="/farmers" element={<FarmerListPage />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}
