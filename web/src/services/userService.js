
import {
	getUsers,
	getUserById,
	getMe,
	createUser,
	updateUser,
	deleteUser,
} from './apiMethods';

export const fetchUsers = getUsers;
export const fetchUserById = getUserById;
export const fetchMe = getMe;
export const addUser = createUser;
export const editUser = updateUser;
export const removeUser = deleteUser;
