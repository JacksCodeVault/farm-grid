import React from 'react';
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

// Public pages
import LoginPage from '../pages/public/LoginPage';
import ResetPasswordPage from '../pages/public/ResetPasswordPage';
import NotFoundPage from '../pages/NotFoundPage';
import LandingPage from '../LandingPage';
import AboutUsPage from '../pages/AboutUsPage';
import SolutionsPage from '../pages/SolutionsPage';

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import OrganizationListPage from '../pages/admin/OrganizationListPage';
import CreateUserPage from '../pages/admin/CreateUserPage';
import EditOrganizationPage from '../pages/admin/EditOrganizationPage';
import UserListPage from '../pages/admin/UserListPage';
import CommodityListPage from '../pages/admin/CommodityListPage';
import GeographyManagementPage from '../pages/admin/GeographyManagementPage';
import OrderListPageAdmin from '../pages/admin/OrderListPage';
import CollectionListPageAdmin from '../pages/admin/CollectionListPage';

// Coop pages
import CoopDashboardPage from '../pages/coop/CoopDashboardPage';
import StaffListPage from '../pages/coop/StaffListPage';
import PayoutsPage from '../pages/coop/PayoutsPage';
import CoopCollectionListPage from '../pages/coop/CoopCollectionListPage';
import CoopOrderListPage from '../pages/coop/CoopOrderListPage';
import CoopAdminLayout from '../layout/CoopAdminLayout';
import FarmersPage from '../pages/coop/FarmersPage';
import VillagesPage from '../pages/coop/VillagesPage';
import DeliveriesPage from '../pages/coop/DeliveriesPage';

// Buyer pages
import BuyerAdminDashboardPage from '../pages/buyerAdmin/BuyerAdminDashboardPage';
import PlaceOrderPage from '../pages/buyerAdmin/PlaceOrderPage';
import MyOrdersPage from '../pages/buyerAdmin/MyOrdersPage';
import VerifyDeliveryPage from '../pages/buyerAdmin/VerifyDeliveryPage';
import RecordPaymentPage from '../pages/buyerAdmin/RecordPaymentPage';
import BuyerAdminLayout from '../layout/BuyerAdminLayout'; // Import the new BuyerAdminLayout

// Shared pages
import OrderListPage from '../pages/shared/OrderListPage';
import FarmerListPage from '../pages/shared/FarmerListPage';

export default function AppRouter() {
  return (
    <ErrorBoundary>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/reset-password" element={<ResetPasswordPage />} />
  <Route path="/about" element={<AboutUsPage />} />
  <Route path="/solutions" element={<SolutionsPage />} />

        {/* Admin routes */}
        <Route element={<RoleBasedRoute allowedRoles={["SYSTEM_ADMIN"]} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/organizations" element={<OrganizationListPage />} />
          <Route path="/admin/organizations/:id/edit" element={<EditOrganizationPage />} />
          <Route path="/admin/organizations" element={<OrganizationListPage />} />
          <Route path="/admin/create-user" element={<CreateUserPage />} />
          <Route path="/admin/users" element={<UserListPage />} />
          <Route path="/admin/commodities" element={<CommodityListPage />} />
          <Route path="/admin/geography" element={<GeographyManagementPage />} />
          <Route path="/admin/orders" element={<OrderListPageAdmin />} />
          <Route path="/admin/collections" element={<CollectionListPageAdmin />} />
        </Route>

        {/* Coop routes */}
        <Route element={<RoleBasedRoute allowedRoles={["COOP_ADMIN"]} />}>
          <Route element={<CoopAdminLayout />}>
            <Route path="/coop/dashboard" element={<CoopDashboardPage />} />
            <Route path="/coop/collections" element={<CoopCollectionListPage />} />
            <Route path="/coop/orders" element={<CoopOrderListPage />} />
            <Route path="/coop/deliveries" element={<DeliveriesPage />} />
            <Route path="/coop/staff" element={<StaffListPage />} />
            <Route path="/coop/farmers" element={<FarmersPage />} />
            <Route path="/coop/villages" element={<VillagesPage />} />
            <Route path="/coop/payouts" element={<PayoutsPage />} />
          </Route>
        </Route>

        {/* Buyer Admin routes */}
        <Route element={<RoleBasedRoute allowedRoles={["BUYER_ADMIN"]} />}>
          <Route element={<BuyerAdminLayout />}> {/* Wrap with BuyerAdminLayout */}
            <Route path="/buyer/dashboard" element={<BuyerAdminDashboardPage />} />
            <Route path="/buyer/place-order" element={<PlaceOrderPage />} />
            <Route path="/buyer/my-orders" element={<MyOrdersPage />} />
            <Route path="/buyer/verify-delivery" element={<VerifyDeliveryPage />} />
            <Route path="/buyer/record-payment" element={<RecordPaymentPage />} />
          </Route>
        </Route>

        {/* Shared routes (multiple roles) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/orders" element={<OrderListPage />} />
          <Route path="/farmers" element={<FarmerListPage />} />
        </Route>

        {/* 404 Not Found */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
