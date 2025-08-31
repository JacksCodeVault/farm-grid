// Centralized route definitions for FarmGrid web app
export const ROUTES = {
  // Public
  LANDING: '/',
  LOGIN: '/login',
  RESET_PASSWORD: '/reset-password',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ORGANIZATIONS: '/admin/organizations',
  CREATE_USER: '/admin/create-user',

  // Coop
  COOP_DASHBOARD: '/coop/dashboard',
  STAFF_LIST: '/coop/staff',
  PAYOUTS: '/coop/payouts',

  // Buyer
  BUYER_DASHBOARD: '/buyer/dashboard',
  CREATE_ORDER: '/buyer/create-order',

  // Shared
  ORDER_LIST: '/orders',
  FARMER_LIST: '/farmers',

  // Not Found
  NOT_FOUND: '*',

  // API endpoints (for services)
  API: {
    AUTH: {
      LOGIN: '/auth/login',
      REQUEST_PASSWORD_RESET: '/auth/request-password-reset',
      RESET_PASSWORD: '/auth/reset-password',
      REQUEST_OTP: '/auth/request-otp',
      VERIFY_OTP: '/auth/verify-otp',
      OTP_LOGIN: '/auth/otp-login',
      PROFILE: '/auth/profile',
      REFRESH_TOKEN: '/auth/refresh-token',
      ADMIN_DASHBOARD: '/auth/admin-dashboard',
    },
    USERS: {
      BASE: '/users',
      BY_ID: (id) => `/users/${id}`,
      ME: '/users/me',
    },
    FARMERS: {
      BASE: '/farmers',
      BY_ID: (id) => `/farmers/${id}`,
      DEACTIVATE: (id) => `/farmers/${id}/deactivate`,
      ACTIVATE: (id) => `/farmers/${id}/activate`,
      REGISTER: '/farmers',
    },
    COLLECTIONS: {
      BASE: '/collections',
      BY_ID: (id) => `/collections/${id}`,
      DEACTIVATE: (id) => `/collections/${id}/deactivate`,
      ACTIVATE: (id) => `/collections/${id}/activate`,
      MARK_PAID: (id) => `/collections/${id}/mark-paid`,
      ASSIGN_TO_DELIVERY: (id) => `/deliveries/${id}/assign-collections`,
    },
    ORDERS: {
  BASE: '/orders',
  BY_ID: (id) => `/orders/${id}`,
  MY: '/orders/my',
  DEACTIVATE: (id) => `/orders/${id}/deactivate`,
  ACTIVATE: (id) => `/orders/${id}/activate`,
  ACCEPT: (id) => `/orders/${id}/accept`,
    },
    PAYMENTS: {
      BASE: '/payments',
      BY_ID: (id) => `/payments/${id}`,
      RECORD: '/payments',
      DEACTIVATE: (id) => `/payments/${id}/deactivate`,
    },
    ORGANIZATIONS: {
      BASE: '/organizations',
      BY_ID: (id) => `/organizations/${id}`,
    },
    COMMODITIES: {
      BASE: '/commodities',
      BY_ID: (id) => `/commodities/${id}`,
    },
    GEOGRAPHY: {
      REGIONS: '/geography/regions',
      REGION_BY_ID: (id) => `/geography/regions/${id}`,
      DISTRICTS: '/geography/districts',
      DISTRICT_BY_ID: (id) => `/geography/districts/${id}`,
      VILLAGES: '/geography/villages',
      VILLAGE_BY_ID: (id) => `/geography/villages/${id}`,
    },
    DELIVERIES: {
      BASE: '/deliveries',
      BY_ID: (id) => `/deliveries/${id}`,
      VERIFY: (id) => `/deliveries/${id}/verify`,
      STATUS: (id) => `/deliveries/${id}/status`,
      PAYOUT_REPORT: (id) => `/deliveries/${id}/payout-report`,
    },
    COOP_ADMIN: {
      FIELD_OPERATORS: '/coop-admin/field-operators',
    },
  },
};
