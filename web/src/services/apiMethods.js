// Buyer Admin API methods
export const placeOrder = (data) => api.post(ROUTES.API.ORDERS.BASE, data);
export const getMyOrders = () => api.get(ROUTES.API.ORDERS.MY);
export const verifyDelivery = (deliveryId, data) => api.patch(ROUTES.API.DELIVERIES.VERIFY(deliveryId), data);
export const recordPayment = (data) => api.post(ROUTES.API.PAYMENTS.RECORD, data);
// FarmGrid API methods for interacting with backend endpoints
// (No-op change to trigger re-save)
import axios from 'axios';
import { ROUTES } from '../config/routes';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3333/api/v1';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// Add interceptor to send JWT token in Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (data) => api.post(ROUTES.API.AUTH.LOGIN, data);
export const requestPasswordReset = (data) => api.post(ROUTES.API.AUTH.REQUEST_PASSWORD_RESET, data);
export const resetPassword = (data) => api.post(ROUTES.API.AUTH.RESET_PASSWORD, data);
export const requestOtp = (data) => api.post(ROUTES.API.AUTH.REQUEST_OTP, data);
export const verifyOtp = (data) => api.post(ROUTES.API.AUTH.VERIFY_OTP, data);
export const otpLogin = (data) => api.post(ROUTES.API.AUTH.OTP_LOGIN, data);
export const getProfile = () => api.get(ROUTES.API.AUTH.PROFILE);
export const refreshToken = () => api.post(ROUTES.API.AUTH.REFRESH_TOKEN);
export const getAdminDashboard = () => api.get(ROUTES.API.AUTH.ADMIN_DASHBOARD);

// Users
export const getUsers = () => api.get(ROUTES.API.USERS.BASE);
export const getUserById = (id) => api.get(ROUTES.API.USERS.BY_ID(id));
export const getMe = () => api.get(ROUTES.API.USERS.ME);
export const createUser = (data) => api.post(ROUTES.API.USERS.BASE, data);
export const updateUser = (id, data) => api.patch(ROUTES.API.USERS.BY_ID(id), data);
export const deleteUser = (id) => api.delete(ROUTES.API.USERS.BY_ID(id));

// Field Operators (Coop Admin)
export const getFieldOperators = () => api.get('/users/field-operators');
export const updateFieldOperator = (id, data) => api.patch(`/users/field-operators/${id}`, data);
export const activateFieldOperator = (id) => api.patch(`/users/field-operators/${id}/activate`);
export const deactivateFieldOperator = (id) => api.patch(`/users/field-operators/${id}/deactivate`);

// Farmers
export const getFarmers = () => api.get(ROUTES.API.FARMERS.BASE);
export const getFarmerById = (id) => api.get(ROUTES.API.FARMERS.BY_ID(id));
export const createFarmer = (data) => api.post(ROUTES.API.FARMERS.REGISTER, data);
export const updateFarmer = (id, data) => api.patch(ROUTES.API.FARMERS.BY_ID(id), data);
export const deactivateFarmer = (id) => api.patch(ROUTES.API.FARMERS.DEACTIVATE(id));
export const activateFarmer = (id) => api.patch(ROUTES.API.FARMERS.ACTIVATE(id));
export const deleteFarmer = (id) => api.delete(ROUTES.API.FARMERS.BY_ID(id));

// Collections
export const getCollections = () => api.get(ROUTES.API.COLLECTIONS.BASE);
export const getCollectionById = (id) => api.get(ROUTES.API.COLLECTIONS.BY_ID(id));
export const createCollection = (data) => api.post(ROUTES.API.COLLECTIONS.BASE, data);
export const updateCollection = (id, data) => api.patch(ROUTES.API.COLLECTIONS.BY_ID(id), data);
export const deactivateCollection = (id) => api.patch(ROUTES.API.COLLECTIONS.DEACTIVATE(id));
export const activateCollection = (id) => api.patch(ROUTES.API.COLLECTIONS.ACTIVATE(id));
export const markCollectionPaid = (id) => api.patch(ROUTES.API.COLLECTIONS.MARK_PAID(id));
export const assignCollectionToDelivery = (deliveryId, data) => api.post(ROUTES.API.COLLECTIONS.ASSIGN_TO_DELIVERY(deliveryId), data);

// Orders
export const activateOrder = (id) => api.patch(ROUTES.API.ORDERS.ACTIVATE(id));
export const getOrders = () => api.get(ROUTES.API.ORDERS.BASE);
export const getOrderById = (id) => api.get(ROUTES.API.ORDERS.BY_ID(id));
// getMyOrders for buyer admin portal (already exported above)
export const createOrder = (data) => api.post(ROUTES.API.ORDERS.BASE, data);
export const updateOrder = (id, data) => api.patch(ROUTES.API.ORDERS.BY_ID(id), data);
export const deactivateOrder = (id) => api.patch(ROUTES.API.ORDERS.DEACTIVATE(id));
export const acceptOrder = (id) => api.patch(ROUTES.API.ORDERS.ACCEPT(id));

// Payments
export const getPayments = () => api.get(ROUTES.API.PAYMENTS.BASE);
export const getPaymentById = (id) => api.get(ROUTES.API.PAYMENTS.BY_ID(id));
export const createPayment = (data) => api.post(ROUTES.API.PAYMENTS.RECORD, data);
export const updatePayment = (id, data) => api.patch(ROUTES.API.PAYMENTS.BY_ID(id), data);
export const deactivatePayment = (id) => api.patch(ROUTES.API.PAYMENTS.DEACTIVATE(id));

// Organizations
export const getOrganizations = () => api.get(ROUTES.API.ORGANIZATIONS.BASE);
export const getOrganizationById = (id) => api.get(ROUTES.API.ORGANIZATIONS.BY_ID(id));
export const createOrganization = (data) => api.post(ROUTES.API.ORGANIZATIONS.BASE, data);
export const updateOrganization = (id, data) => api.patch(ROUTES.API.ORGANIZATIONS.BY_ID(id), data);
export const deleteOrganization = (id) => api.delete(ROUTES.API.ORGANIZATIONS.BY_ID(id));

// Commodities
export const getCommodities = () => api.get(ROUTES.API.COMMODITIES.BASE);
export const getCommodityById = (id) => api.get(ROUTES.API.COMMODITIES.BY_ID(id));
export const createCommodity = (data) => api.post(ROUTES.API.COMMODITIES.BASE, data);
export const updateCommodity = (id, data) => api.patch(ROUTES.API.COMMODITIES.BY_ID(id), data);
export const deleteCommodity = (id) => api.delete(ROUTES.API.COMMODITIES.BY_ID(id));

// Geography
export const getRegions = () => api.get(ROUTES.API.GEOGRAPHY.REGIONS);
export const getRegionById = (id) => api.get(ROUTES.API.GEOGRAPHY.REGION_BY_ID(id));
export const createRegion = (data) => api.post(ROUTES.API.GEOGRAPHY.REGIONS, data);
export const updateRegion = (id, data) => api.patch(ROUTES.API.GEOGRAPHY.REGION_BY_ID(id), data);
export const deleteRegion = (id) => api.delete(ROUTES.API.GEOGRAPHY.REGION_BY_ID(id));

export const getDistricts = () => api.get(ROUTES.API.GEOGRAPHY.DISTRICTS);
export const getDistrictById = (id) => api.get(ROUTES.API.GEOGRAPHY.DISTRICT_BY_ID(id));
export const createDistrict = (data) => api.post(ROUTES.API.GEOGRAPHY.DISTRICTS, data);
export const updateDistrict = (id, data) => api.patch(ROUTES.API.GEOGRAPHY.DISTRICT_BY_ID(id), data);
export const deleteDistrict = (id) => api.delete(ROUTES.API.GEOGRAPHY.DISTRICT_BY_ID(id));

export const getVillages = () => api.get(ROUTES.API.GEOGRAPHY.VILLAGES);
export const getVillageById = (id) => api.get(ROUTES.API.GEOGRAPHY.VILLAGE_BY_ID(id));
export const createVillage = (data) => api.post(ROUTES.API.GEOGRAPHY.VILLAGES, data);
export const updateVillage = (id, data) => api.patch(ROUTES.API.GEOGRAPHY.VILLAGE_BY_ID(id), data);
export const deleteVillage = (id) => api.delete(ROUTES.API.GEOGRAPHY.VILLAGE_BY_ID(id));

// Deliveries

// Coop Admin Deliveries
export const getDeliveries = () => api.get('/coop-admin/deliveries');
export const getDeliveryById = (id) => api.get(`/coop-admin/deliveries/${id}`);
export const createDelivery = (data) => api.post('/coop-admin/deliveries', data);
export const updateDeliveryStatus = (id, data) => api.patch(`/coop-admin/deliveries/${id}/status`, data);
export const dispatchDelivery = (id) => api.patch(`/coop-admin/deliveries/${id}/dispatch`);
// verifyDelivery for buyer admin portal (already exported above)
export const getPayoutReport = (id) => api.get(`/coop-admin/deliveries/${id}/payout-report`);

// Coop Admin
export const createFieldOperator = (data) => api.post(ROUTES.API.COOP_ADMIN.FIELD_OPERATORS, data);
