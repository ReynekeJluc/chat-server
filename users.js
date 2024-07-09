import { trimStr } from './utils/valStr.js';

let users = [];

export const findUser = user => {
	const UserName = trimStr(user.name);
	const UserRoom = trimStr(user.room);

	return users.find(
		u => trimStr(u.name) === UserName && trimStr(u.room) === UserRoom
	);
};

export const getUsers = room => users.filter(u => u.room === room);

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

export const removeUser = user => {
	const foundUser = findUser(user);

	if (foundUser) {
		users = users.filter(
			u =>
				(u.room === foundUser.room && u.name !== foundUser.name) ||
				u.room !== foundUser.room
		);
	}

	return foundUser;
};
