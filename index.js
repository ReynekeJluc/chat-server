import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

import { addUser, findUser, getUsers, removeUser } from './users.js';

const app = express();
const server = http.createServer(app);

app.use(express.static('dist'));

const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
	res.send("It's my world!");
});

io.on('connection', socket => {
	socket.on('join', ({ name, room }) => {
		socket.join(room);

		const { user, isExist } = addUser({ name, room });

		const userMessage = isExist
			? `${
					user.name === '' || user.name === undefined || user.name === null
						? 'Anon'
						: user.name
			  }, here you go again`
			: `Hello, ${user.name}`;

		socket.emit('message', {
			data: {
				user: { name: 'Admin' },
				message: userMessage,
			},
		});

		socket.broadcast.to(user.room).emit('message', {
			data: {
				user: { name: 'Admin' },
				message: `${
					name === '' || name === undefined || name === null ? 'Anon' : name
				} has joined`,
			},
		});

		io.to(user.room).emit('joinRoom', {
			data: { users: getUsers(user.room) },
		});
	});

	socket.on('sendMessage', ({ message, params }) => {
		const user = findUser(params);

		if (user) {
			io.to(user.room).emit('message', { data: { user, message } });
		}
	});

	socket.on('leftRoom', ({ params }) => {
		const user = removeUser(params);

		if (user) {
			const { room, name } = user;

			io.to(room).emit('message', {
				data: {
					user: { name: 'Admin' },
					message: `${
						name === '' || name === undefined || name === null ? 'Anon' : name
					} is left`,
				},
			});

			io.to(room).emit('joinRoom', {
				data: { users: getUsers(room) },
			});
		}
	});

	socket.on('disconnect', () => {
		console.log('Disconnect');
	});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, err => {
	if (err) {
		return console.log(err);
	} else {
		console.log('Server has been started...');
	}
});
