import { trimStr } from './utils/valStr.js';

let users = [];

export const findUser = user => {
	const UserName = trimStr(user.name);
	const UserRoom = trimStr(user.room);

	return users.find(
		u => trimStr(u.name) === UserName && trimStr(u.room) === UserRoom
	);
};

export const getUsers = room => {
	users.filter(u => {
		u.room === room;
	});

	return users;
};

export const addUser = user => {
	const isExist = findUser(user);

	if (!isExist) {
		users.push(user);
	}

	const curUser = isExist || user;

	return {
		isExist: !!isExist,
		user: curUser,
	};
};
