
import { authenticate, getDashboardRoute } from './auth';

export async function loginUser(credentials) {
	const { user, dashboard } = await authenticate(credentials);
	if (user.role === 'FIELD_OPERATOR') {
		throw new Error('Field Operators must use the mobile app.');
	}
	return { user, dashboard };
}

export { getDashboardRoute };
