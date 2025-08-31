// Role-based authentication service for FarmGrid web
import { login } from './apiMethods';
import { ROUTES } from '../config/routes';

// Map backend roles to dashboard routes
const ROLE_DASHBOARD = {
  ADMIN: ROUTES.ADMIN_DASHBOARD,
  SYSTEM_ADMIN: ROUTES.ADMIN_DASHBOARD,
  COOP_ADMIN: ROUTES.COOP_DASHBOARD,
  BUYER_ADMIN: ROUTES.BUYER_DASHBOARD,
  FIELD_OPERATOR: ROUTES.FARMER_LIST, // Example: field operator lands on farmer list
};

export async function authenticate(credentials) {
  // credentials: { email, password }
  const user = await login(credentials).then((res) => res.data);
  if (!user || !user.role) throw new Error('Invalid login response');
  return {
    user,
    dashboard: ROLE_DASHBOARD[user.role] || ROUTES.LANDING,
  };
}

export function getDashboardRoute(role) {
  return ROLE_DASHBOARD[role] || ROUTES.LANDING;
}
