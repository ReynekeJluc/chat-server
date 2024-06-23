import { trimStr } from './utils/valStr.js';

let users = [];

export const AddUser = user => {
	const UserName = trimStr(user.name);
	const UserRoom = trimStr(user.room);

	const isExist = users.find(
		u => trimStr(u.name) === UserName && trimStr(u.room) === UserRoom
	);

	!isExist && users.push(user);

	const curUser = isExist || user;

	return {
		isExist: !!isExist,
		user: curUser,
	};
};
